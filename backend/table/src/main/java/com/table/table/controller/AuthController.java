package com.table.table.controller;

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
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        User user = authService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
        return ResponseEntity.ok("Kullanici basariyla kaydoldu" + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {
        String token = authService.loginUser(request.getUsername(), request.getPassword());

        return ResponseEntity.ok(new LoginResponse(token));
    }

}
