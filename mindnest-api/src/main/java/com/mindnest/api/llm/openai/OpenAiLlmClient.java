package com.mindnest.api.llm.openai;

import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.LlmResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;

// OpenAI 전환 시 @Component 추가 후 AnthropicLlmClient에서 제거
@RequiredArgsConstructor
public class OpenAiLlmClient implements LlmClient {

    private final RestClient llmRestClient;

    @Override
    public LlmResponse complete(LlmRequest request) {
        OpenAiChatResponse response = llmRestClient.post()
                .uri("/chat/completions")
                .body(OpenAiRequestMapper.toBody(request))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new MindNestException(
                            ErrorCode.LLM_ERROR,
                            "OpenAI API 오류: HTTP " + res.getStatusCode()
                    );
                })
                .body(OpenAiChatResponse.class);

        return OpenAiResponseMapper.fromResponse(response);
    }
}
