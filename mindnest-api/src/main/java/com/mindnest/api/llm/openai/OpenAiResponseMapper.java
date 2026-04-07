package com.mindnest.api.llm.openai;

import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import com.mindnest.api.llm.LlmResponse;

public class OpenAiResponseMapper {

    public static LlmResponse fromResponse(OpenAiChatResponse response) {
        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new MindNestException(ErrorCode.LLM_ERROR, "OpenAI 응답에 choices가 없습니다");
        }
        String content = response.choices().get(0).message().content();
        return new LlmResponse(content);
    }
}
