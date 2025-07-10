package com.table.table.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.table.table.model.Role;
import com.table.table.model.User;
import com.table.table.repository.RoleRepository;
import com.table.table.repository.UserRepository;
import com.table.table.security.JwtUtil;

@Service
public class AuthService {
    final private UserRepository userRepository;
    final private RoleRepository roleRepository;
    final private PasswordEncoder passwordEncoder;
    final private JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(String username, String password, String email) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("There is same email already registered");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("There is same username already registered");
        }

        Role userRole = roleRepository.findByName("user")
                .orElseThrow(() -> new RuntimeException("User rolune sahip degil"));

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(userRole);

        return userRepository.save(newUser);
    }

    public String loginUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No username matched" + username));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Password does not match!");
        }

        return jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().getName());
    }

}
