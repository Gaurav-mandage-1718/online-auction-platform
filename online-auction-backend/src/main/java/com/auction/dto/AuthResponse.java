package com.auction.dto;

import com.auction.entity.Role;

public class AuthResponse {

    private String message;
    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;

    public AuthResponse(String message, String token, Long userId, String fullName, String email, Role role) {
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}