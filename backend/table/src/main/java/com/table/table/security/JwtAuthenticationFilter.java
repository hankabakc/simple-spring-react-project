// src/main/java/com/table/table/security/JwtAuthenticationFilter.java
package com.table.table.security;

import java.io.IOException;

import org.springframework.http.HttpMethod; // EKLE
import org.springframework.lang.NonNull; // EKLE
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // EKLE
import org.springframework.security.core.context.SecurityContextHolder; // EKLE
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    // JwtAuthenticationEntryPoint ve JwtAccessDeniedHandler'ı burada kullanmıyoruz
    // çünkü onlar SecurityConfig'te global exception handling için tanımlandı.

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // OPTIONS isteklerini ve public endpoint'leri atla
        if (HttpMethod.OPTIONS.matches(request.getMethod()) ||
                request.getRequestURI().equals("/api/auth/register") ||
                request.getRequestURI().equals("/api/auth/login") ||
                request.getRequestURI().startsWith("/api/products") ||
                request.getRequestURI().startsWith("/api/categories") ||
                request.getRequestURI().startsWith("/swagger-ui") ||
                request.getRequestURI().startsWith("/v3/api-docs") ||
                request.getRequestURI().startsWith("/swagger-resources") ||
                request.getRequestURI().startsWith("/webjars")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token != null) {
            try {
                // Token'dan kullanıcı adını al
                username = jwtUtil.parseClaims(token).get("username", String.class);
            } catch (ExpiredJwtException e) {
                // Token süresi dolduysa
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json"); // JSON yanıtı için
                response.getWriter().write("{ \"error\": \"Token expired: " + e.getMessage() + "\" }");
                return;
            } catch (MalformedJwtException | SignatureException | UnsupportedJwtException
                    | IllegalArgumentException e) {
                // Diğer JWT hataları (geçersiz token, imza hatası vb.)
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 veya 401
                response.setContentType("application/json"); // JSON yanıtı için
                response.getWriter().write("{ \"error\": \"Invalid Token: " + e.getMessage() + "\" }");
                return;
            } catch (Exception e) {
                // Beklenmeyen diğer hatalar
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("application/json"); // JSON yanıtı için
                response.getWriter().write("{ \"error\": \"An unexpected error occurred during token processing: "
                        + e.getMessage() + "\" }");
                return;
            }
        }

        // Eğer token'da kullanıcı adı varsa VE güvenlik bağlamında henüz kimlik
        // doğrulaması yapılmamışsa
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // *** BURADA validateToken metodunu kullanıyoruz ***
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Kimlik bilgisi JWT'den geldiği için şifre null bırakılır
                            userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    // Token geçerli değilse (süresi dolduysa veya kullanıcı bilgisi uyuşmuyorsa)
                    // validateToken zaten süresi dolmuş token'ları ele aldığı için, buraya
                    // genellikle
                    // kullanıcı adının uyuşmadığı durumlar düşer.
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter()
                            .write("{ \"error\": \"Invalid or outdated token for user: " + username + "\" }");
                    return;
                }
            } catch (Exception e) {
                // userDetailsService.loadUserByUsername() hatası veya başka beklenmeyen hata
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter()
                        .write("{ \"error\": \"Authentication processing failed: " + e.getMessage() + "\" }");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}