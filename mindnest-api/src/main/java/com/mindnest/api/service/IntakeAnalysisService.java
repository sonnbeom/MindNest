package com.mindnest.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.domain.intake.IntakeAnalysisResult;
import com.mindnest.api.exception.LlmResponseParseException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmMessage;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.LlmResponse;
import com.mindnest.api.llm.prompt.IntakeAnalysisPrompt;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IntakeAnalysisService {

    private final LlmClient llmClient;
    private final IntakeAnalysisPrompt prompt;
    private final ObjectMapper objectMapper;

    @Value("${llm.anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    @Value("${llm.anthropic.temperature:0.3}")
    private double temperature;

    @Value("${llm.anthropic.max-tokens:2000}")
    private int maxTokens;

    public IntakeAnalysisResult analyze(String userInput) {
        List<LlmMessage> messages = prompt.buildMessages(userInput);
        LlmResponse response = llmClient.complete(new LlmRequest(model, messages, temperature, maxTokens));
        return parseResult(response.content());
    }

    private IntakeAnalysisResult parseResult(String content) {
        String json = extractJson(content);
        try {
            return objectMapper.readValue(json, IntakeAnalysisResult.class);
        } catch (JsonProcessingException e) {
            throw new LlmResponseParseException("intake 분석 결과 JSON 파싱 실패: " + e.getOriginalMessage());
        }
    }

    private String extractJson(String raw) {
        int start = raw.indexOf('{');
        int end = raw.lastIndexOf('}');
        if (start == -1 || end == -1) {
            throw new LlmResponseParseException("LLM 응답에서 JSON을 찾을 수 없습니다");
        }
        return raw.substring(start, end + 1);
    }
}
