package com.mindnest.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RagConfig {

    @Value("${rag.server.url}")
    private String ragServerUrl;

    @Bean
    public RestClient ragRestClient() {
        return RestClient.builder()
                .baseUrl(ragServerUrl)
                .build();
    }
}
