package com.table.table.config;

import org.springframework.context.annotation.Bean; // Yeni import
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Tüm yollar için CORS ayarları
                        .allowedOrigins("http://localhost:3000", "https://simple-spring-react-project.onrender.com") // Frontend
                                                                                                                     // URL'leri
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen HTTP metotları
                        .allowedHeaders("Authorization", "Content-Type", "Accept") // İzin verilen başlıklar
                        .exposedHeaders("Authorization") // Frontend'e gösterilecek başlıklar
                        .allowCredentials(true) // Kimlik bilgilerinin (örn. çerezler, Authorization başlığı)
                                                // gönderilmesine izin ver
                        .maxAge(3600); // Preflight (OPTIONS) isteğinin önbellekte ne kadar süreyle tutulacağı (saniye)
            }
        };
    }
}
