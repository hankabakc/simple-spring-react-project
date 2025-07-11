package com.table.table.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // If a token exists and no authentication is currently set in the context
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // Parse the JWT token to get claims
                Claims claims = jwtUtil.parseClaims(token);
                // Extract username from claims
                String username = claims.get("username", String.class);

                if (username != null) {
                    // Load user details by username
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Create an authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credentials are null as token is already validated
                            userDetails.getAuthorities());
                    // Set authentication details from the request
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // IMPORTANT: Log the exception to see what's going wrong with the token
                System.err.println("JWT Token validation failed: " + e.getMessage());
                // You might want to clear the security context if an invalid token was
                // attempted
                SecurityContextHolder.clearContext();
                // Optionally, you can send an error response here if you want to explicitly
                // handle invalid tokens before the main Spring Security filter chain.
                // For now, we'll just log and let the filter chain continue, which will
                // likely result in a 403 if the endpoint requires authentication.
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
