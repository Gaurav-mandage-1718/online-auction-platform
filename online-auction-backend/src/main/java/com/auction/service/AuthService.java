package com.auction.service;

import com.auction.dto.AuthResponse;
import com.auction.dto.LoginRequest;
import com.auction.dto.RegisterRequest;
import com.auction.entity.User;
import com.auction.repository.UserRepository;
import com.auction.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.auction.dto.VerifyOtpRequest;
import com.auction.entity.OtpVerification;
import com.auction.repository.OtpRepository;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpRepository otpRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpRepository otpRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpRepository = otpRepository;
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
      //  generateOtp(savedUser.getEmail());

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                "User registered successfully",
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.isBlocked()) {
            throw new RuntimeException("Your account is blocked");
        }
        
//        if (!user.isVerified()) {
//            throw new RuntimeException("Please verify your email before login");
//        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                "Login successful",
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }
    
    private void generateOtp(String email) {

        String otpCode = String.valueOf(100000 + new Random().nextInt(900000));

        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otpCode);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        otpRepository.save(otpVerification);

        System.out.println("OTP for " + email + " is: " + otpCode);
    }

    public String verifyOtp(VerifyOtpRequest request) {

        OtpVerification otpVerification = otpRepository
                .findTopByEmailAndUsedFalseOrderByIdDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

//        if (!otpVerification.getOtp().equals(request.getOtp())) {
//            throw new RuntimeException("Invalid OTP");
//        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepository.save(user);

        otpVerification.setUsed(true);
        otpRepository.save(otpVerification);

        return "Email verified successfully";
    }
}