package com.taskpilot.backend.controller;

import com.taskpilot.backend.entity.User;
import com.taskpilot.backend.entity.UserPreference;
import com.taskpilot.backend.repository.UserPreferenceRepository;
import com.taskpilot.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            HttpServletRequest request) {
        Long authUserId = userId != null ? userId : (Long) request.getAttribute("userId");

        if (authUserId == null) {
            return ResponseEntity.badRequest().build();
        }

        final Long finalUserId = authUserId;
        return userRepository.findById(finalUserId)
                .map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());
                    response.put("email", user.getEmail());
                    response.put("name", user.getName());

                    userPreferenceRepository.findByUserId(finalUserId)
                            .ifPresent(pref -> response.put("preferences", pref));

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        User saved = userRepository.save(user);

        UserPreference preference = new UserPreference(saved.getId());
        userPreferenceRepository.save(preference);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{userId}/preferences")
    public ResponseEntity<UserPreference> updatePreferences(
            @PathVariable Long userId,
            @RequestBody UserPreference request) {
        return userPreferenceRepository.findByUserId(userId)
                .map(pref -> {
                    if (request.getPreferredDifficulty() != null) {
                        pref.setPreferredDifficulty(request.getPreferredDifficulty());
                    }
                    if (request.getAlertLeadTimeEasy() != null) {
                        pref.setAlertLeadTimeEasy(request.getAlertLeadTimeEasy());
                    }
                    if (request.getAlertLeadTimeMedium() != null) {
                        pref.setAlertLeadTimeMedium(request.getAlertLeadTimeMedium());
                    }
                    if (request.getAlertLeadTimeHard() != null) {
                        pref.setAlertLeadTimeHard(request.getAlertLeadTimeHard());
                    }
                    UserPreference updated = userPreferenceRepository.save(pref);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
