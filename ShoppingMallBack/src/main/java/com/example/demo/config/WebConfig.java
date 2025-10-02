package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8000")
                .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)   // 쿠키/세션 쓰면 true로 바꾸고 Origin 와일드카드 금지
                .maxAge(3600);
    }
}