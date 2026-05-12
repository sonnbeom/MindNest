package com.mindnest.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.domain.intake.IntakeAnalysisResult;
import com.mindnest.api.exception.LlmResponseParseException;
import com.mindnest.api.llm.RagClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IntakeAnalysisService {

    private final RagClient ragClient;
    private final ObjectMapper objectMapper;

    public IntakeAnalysisResult analyze(String userInput) {
        String json = ragClient.analyze(userInput);
        return parseResult(json);
    }

    private IntakeAnalysisResult parseResult(String content) {
        try {
            return objectMapper.readValue(content, IntakeAnalysisResult.class);
        } catch (JsonProcessingException e) {
            throw new LlmResponseParseException("intake 분석 결과 JSON 파싱 실패: " + e.getOriginalMessage());
        }
    }
}
