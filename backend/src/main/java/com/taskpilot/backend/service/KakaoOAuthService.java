package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.AuthResponse;
import com.taskpilot.backend.dto.KakaoTokenResponse;
import com.taskpilot.backend.dto.KakaoUserInfo;
import com.taskpilot.backend.entity.User;
import com.taskpilot.backend.entity.UserPreference;
import com.taskpilot.backend.repository.UserPreferenceRepository;
import com.taskpilot.backend.repository.UserRepository;
import com.taskpilot.backend.util.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
public class KakaoOAuthService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.token-url:https://kauth.kakao.com/oauth/token}")
    private String tokenUrl;

    @Value("${kakao.user-info-url:https://kapi.kakao.com/v2/user/me}")
    private String userInfoUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthResponse loginWithKakao(String code) {
        // 1. Get Kakao access token
        KakaoTokenResponse tokenResponse = getKakaoToken(code);

        // 2. Get Kakao user info
        KakaoUserInfo userInfo = getKakaoUserInfo(tokenResponse.getAccessToken());

        // 3. Create or update user
        User user = upsertUser(userInfo);

        // 4. Generate JWT token
        String jwtToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        // 5. Return response
        return new AuthResponse(
                jwtToken,
                "Bearer",
                86400L, // 24 hours
                new AuthResponse.UserResponse(user.getId(), user.getEmail(), user.getName())
        );
    }

    private KakaoTokenResponse getKakaoToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
        return restTemplate.postForObject(tokenUrl, request, KakaoTokenResponse.class);
    }

    private KakaoUserInfo getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        return restTemplate.postForObject(userInfoUrl, request, KakaoUserInfo.class);
    }

    private User upsertUser(KakaoUserInfo userInfo) {
        String email = userInfo.getEmail();
        String name = userInfo.getNickname();

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setCreatedAt(LocalDateTime.now());
                    newUser.setUpdatedAt(LocalDateTime.now());

                    User saved = userRepository.save(newUser);

                    // Create default preference
                    UserPreference preference = new UserPreference(saved.getId());
                    userPreferenceRepository.save(preference);

                    return saved;
                });

        return user;
    }
}
