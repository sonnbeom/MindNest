package com.mindnest.api.service;

import com.mindnest.api.dto.request.ReframeGenerationRequest;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmMessage;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.prompt.ReframeGenerationPrompt;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReframeGenerationService {

    private final LlmClient llmClient;
    private final ReframeGenerationPrompt prompt;

    @Value("${llm.anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    @Value("${llm.anthropic.temperature:0.3}")
    private double temperature;

    @Value("${llm.anthropic.max-tokens:2000}")
    private int maxTokens;

    public void generateStreaming(ReframeGenerationRequest request, OutputStream outputStream) throws IOException {
        List<LlmMessage> messages = prompt.buildMessages(
                request.fact(),
                request.selectedThought(),
                request.selectedCounters(),
                request.selectedActions()
        );
        llmClient.completeStreaming(new LlmRequest(model, messages, temperature, maxTokens), outputStream);
    }
}
