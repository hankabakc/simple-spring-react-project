package com.table.table.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.LoginRequest;
import com.table.table.dto.request.RegisterRequest;
import com.table.table.dto.response.LoginResponse;
import com.table.table.model.User;
import com.table.table.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Boolean>> register(@RequestBody RegisterRequest request) {
        authService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Şifreyi doğrula ve token üret
        String token = authService.loginUser(request.getUsername(), request.getPassword());

        // Kullanıcıyı bul ve rolünü al
        User user = authService.findByUsername(request.getUsername());
        String role = user.getRole().getName();

        return ResponseEntity.ok(new LoginResponse(token, role));
    }
}
