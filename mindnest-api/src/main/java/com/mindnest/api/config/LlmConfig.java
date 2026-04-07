package com.mindnest.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * LLM 관련 Spring 빈을 등록하는 설정 클래스
 *
 * - llmRestClient: Anthropic API 호출용 RestClient (기본 URL·헤더 설정)
 * - objectMapper : LLM 응답 JSON 파싱용 Jackson ObjectMapper
 *
 * 설정값은 application.yaml의 llm.anthropic.* 에서 주입받는다.
 * 다른 프로바이더로 전환 시 이 클래스의 헤더·URL만 수정하면 된다.
 */
@Configuration
public class LlmConfig {

    /** .env 파일의 LLM_API_KEY 환경변수에서 주입 */
    @Value("${llm.anthropic.api-key}")
    private String apiKey;

    @Value("${llm.anthropic.base-url:https://api.anthropic.com/v1}")
    private String baseUrl;

    /** Anthropic API 버전 헤더값 */
    @Value("${llm.anthropic.version:2023-06-01}")
    private String anthropicVersion;

    /**
     * Anthropic API 호출용 RestClient 빈
     *
     * 모든 요청에 공통 헤더를 기본값으로 설정한다:
     * - x-api-key       : Anthropic 인증 키
     * - anthropic-version: API 버전
     * - Content-Type    : application/json
     */
    @Bean
    public RestClient llmRestClient() {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", anthropicVersion)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * LLM 응답 JSON 파싱용 ObjectMapper 빈
     * DistortionAnalysisService에서 주입받아 사용한다.
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
