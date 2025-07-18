// src/main/java/com/table/table/security/JwtAuthenticationEntryPoint.java
package com.table.table.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        // Kimliği doğrulanmamış bir kullanıcının korumalı bir kaynağa erişmeye
        // çalıştığında çağrılır.
        // 401 Unauthorized yanıtı döner.
        response.setContentType("application/json"); // JSON yanıtı döndürmek için
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getOutputStream().println("{ \"error\": \"" + authException.getMessage() + "\" }");
    }
}