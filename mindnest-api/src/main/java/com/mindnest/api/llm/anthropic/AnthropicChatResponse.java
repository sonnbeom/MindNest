package com.mindnest.api.llm.anthropic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

/**
 * Anthropic Messages API의 응답 JSON을 역직렬화하는 record
 *
 * Anthropic 응답 구조:
 * {
 *   "content": [
 *     { "type": "text", "text": "LLM이 생성한 텍스트" }
 *   ],
 *   ... (id, model, role 등 무시)
 * }
 *
 * @JsonIgnoreProperties(ignoreUnknown = true) 로 미사용 필드는 무시한다.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AnthropicChatResponse(List<Content> content) {

    /**
     * content 배열의 각 항목
     * - type: "text" 타입만 사용 (tool_use 등 다른 타입은 무시)
     * - text: LLM이 생성한 실제 텍스트
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Content(String type, String text) {}
}
