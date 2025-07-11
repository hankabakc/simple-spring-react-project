package com.table.table.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // CorsConfiguration import'u
import org.springframework.web.cors.CorsConfiguration; // CorsConfigurationSource import'u
import org.springframework.web.cors.CorsConfigurationSource; // UrlBasedCorsConfigurationSource import'u
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.table.table.security.JwtAuthenticationFilter; // Arrays import'u

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // CORS yapılandırmasını doğrudan Spring Security'ye entegre ediyoruz
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Kimlik bilgilerini (örneğin çerezler, Authorization başlığı) göndermeye
                                          // izin ver
        config.setAllowedOrigins(
                Arrays.asList("http://localhost:3000", "https://simple-spring-react-project.onrender.com")); // Frontend'inizin
                                                                                                             // URL'sini
                                                                                                             // ve
                                                                                                             // Render
                                                                                                             // URL'sini
                                                                                                             // buraya
                                                                                                             // ekleyin
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // İzin verilen HTTP
                                                                                            // metodları
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept")); // İzin verilen başlıklar
        config.setExposedHeaders(Arrays.asList("Authorization")); // Tarayıcıya gösterilecek başlıklar
        config.setMaxAge(3600L); // Preflight isteğinin önbellekte ne kadar süre kalacağı (saniye cinsinden)
        source.registerCorsConfiguration("/**", config); // Tüm yollara bu CORS yapılandırmasını uygula
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // CSRF'yi devre dışı bırak
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- BURADA DEĞİŞİKLİK: CORS'u
                                                                                   // entegre et
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/products/**", "/api/categories/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
