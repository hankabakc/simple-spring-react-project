// src/main/java/com/table/table/security/JwtAccessDeniedHandler.java
package com.table.table.security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException, ServletException {
        // Kimliği doğrulanmış ancak yetkisiz bir kullanıcının korumalı bir kaynağa
        // erişmeye çalıştığında çağrılır.
        // 403 Forbidden yanıtı döner.
        response.setContentType("application/json"); // JSON yanıtı döndürmek için
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getOutputStream().println(
                "{ \"error\": \"Access Denied: You don't have enough permissions to access this resource.\" }");
    }
}