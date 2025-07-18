package com.table.table.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer; // Bu import'u ekleyin
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.table.table.security.JwtAuthenticationFilter;

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(
                Arrays.asList("http://localhost:3000", "https://simple-spring-react-project.onrender.com"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        config.setMaxAge(3600L);
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // --- Önceki FilterRegistrationBean bean'ini silin veya yorum satırı yapın ---
    // @Bean
    // public FilterRegistrationBean<CorsFilter> corsFilterRegistrationBean() {
    // FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new
    // CorsFilter(corsConfigurationSource()));
    // bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
    // return bean;
    // }
    // --- Son ---

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                // CORS'u Spring Security'nin kendi mekanizmasıyla yönetiyoruz
                .cors(Customizer.withDefaults()) // BURAYI DÜZELTİYORUZ! Bu, yukarıdaki corsConfigurationSource()
                                                 // bean'ini kullanır.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS isteklerine her zaman izin ver
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoint'ler
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/products",
                                "/api/products/search",
                                "/api/products/detail",
                                "/api/categories",
                                "/api/categories/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-resources/**",
                                "/webjars/**")
                        .permitAll()
                        // Admin endpoint'leri ADMIN rolü gerektirir
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // Kimlik doğrulaması gerektiren diğer endpoint'ler
                        .requestMatchers(
                                "/api/cart/**",
                                "/api/orders",
                                "/api/orders/my")
                        .authenticated()
                        // Diğer tüm istekler de kimlik doğrulaması gerektirir
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}