package com.auction.controller;

import com.auction.dto.AuthResponse;
import com.auction.dto.VerifyOtpRequest;
import java.util.Map;
import com.auction.dto.LoginRequest;
import com.auction.dto.RegisterRequest;
import com.auction.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    
    @PostMapping("/verify-otp")
    public Map<String, String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        return Map.of("message", authService.verifyOtp(request));
    }
}