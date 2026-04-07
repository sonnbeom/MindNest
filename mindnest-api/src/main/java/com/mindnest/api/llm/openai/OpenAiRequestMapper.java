package com.mindnest.api.llm.openai;

import com.mindnest.api.llm.LlmRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OpenAiRequestMapper {

    public static Map<String, Object> toBody(LlmRequest request) {
        List<Map<String, String>> messages = request.messages().stream()
                .map(m -> Map.of("role", m.role(), "content", m.content()))
                .toList();

        Map<String, Object> body = new HashMap<>();
        body.put("model", request.model());
        body.put("messages", messages);
        body.put("temperature", request.temperature());
        body.put("max_tokens", request.maxTokens());
        return body;
    }
}
