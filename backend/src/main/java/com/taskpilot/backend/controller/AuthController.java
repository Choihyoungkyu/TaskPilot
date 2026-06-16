package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.AuthRequest;
import com.taskpilot.backend.dto.AuthResponse;
import com.taskpilot.backend.entity.User;
import com.taskpilot.backend.repository.UserRepository;
import com.taskpilot.backend.service.KakaoOAuthService;
import com.taskpilot.backend.util.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private KakaoOAuthService kakaoOAuthService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/kakao")
    public ResponseEntity<AuthResponse> loginWithKakao(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = kakaoOAuthService.loginWithKakao(request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, Object>> generateToken(@RequestParam Long userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
                    Map<String, Object> response = new HashMap<>();
                    response.put("accessToken", token);
                    response.put("tokenType", "Bearer");
                    response.put("expiresIn", 86400);
                    response.put("userId", user.getId());
                    response.put("email", user.getEmail());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
