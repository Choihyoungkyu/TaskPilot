package com.taskpilot.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;
    private UserResponse user;

    @Data
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String email;
        private String name;
    }
}
