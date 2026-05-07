package com.mindnest.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS(Cross-Origin Resource Sharing) 설정 클래스
 *
 * 프론트엔드(Next.js, localhost:3000)에서 백엔드 API를 호출할 수 있도록
 * 허용 출처를 설정한다.
 *
 * 허용 출처는 application.yaml의 cors.allowed-origins에서 주입받는다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String[] allowedOrigins;

    /**
     * /api/** 경로에 대한 CORS 정책을 등록한다.
     * 프론트엔드에서 GET, POST 등 모든 HTTP 메서드 호출 허용.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
