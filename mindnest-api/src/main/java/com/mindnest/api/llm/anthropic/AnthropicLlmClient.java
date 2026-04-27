package com.mindnest.api.llm.anthropic;

import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.LlmResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AnthropicLlmClient implements LlmClient {

    private final RestClient llmRestClient;

    /**
     * LLM에 요청을 보내고 텍스트 응답을 반환한다.
     *
     * @param request 모델명, 메시지 목록, 설정값을 담은 요청
     * @return LLM이 생성한 텍스트를 담은 응답
     * @throws MindNestException HTTP 오류 또는 응답 구조 이상 시
     */
    @Override
    public LlmResponse complete(LlmRequest request) {
        Map<String, Object> body = buildBody(request);

        AnthropicChatResponse response = llmRestClient.post()
                .uri("/messages")
                .body(body)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    String msg = "Anthropic API 호출 실패 [HTTP " + res.getStatusCode() + "]";
                    log.error(msg);
                    throw new MindNestException(ErrorCode.LLM_ERROR, msg);
                })
                .body(AnthropicChatResponse.class);

        return extractResponse(response);
    }

    /**
     * LlmRequest를 Anthropic API 형식의 요청 body Map으로 변환한다.
     *
     * Anthropic은 OpenAI와 달리 system 메시지를 messages 배열 밖
     * 별도 "system" 필드에 넣어야 한다.
     */
    private Map<String, Object> buildBody(LlmRequest request) {
        // system 메시지 추출
        String systemContent = request.messages().stream()
                .filter(m -> "system".equals(m.role()))
                .map(m -> m.content())
                .findFirst()
                .orElse("");

        // user/assistant 메시지만 messages 배열로 변환
        List<Map<String, String>> userMessages = request.messages().stream()
                .filter(m -> !"system".equals(m.role()))
                .map(m -> Map.of("role", m.role(), "content", m.content()))
                .toList();

        Map<String, Object> body = new HashMap<>();
        body.put("model", request.model());
        body.put("max_tokens", request.maxTokens());
        body.put("messages", userMessages);
        if (!systemContent.isEmpty()) {
            body.put("system", systemContent);
        }
        return body;
    }

    /**
     * Anthropic 응답에서 텍스트 content를 추출한다.
     * type이 "text"인 첫 번째 content 항목을 반환한다.
     */
    private LlmResponse extractResponse(AnthropicChatResponse response) {
        if (response == null || response.content() == null || response.content().isEmpty()) {
            log.error("Anthropic 응답 구조 이상: content 없음 (response={})", response);
            throw new MindNestException(ErrorCode.LLM_ERROR, "Anthropic 응답에 content가 없습니다");
        }
        String text = response.content().stream()
                .filter(c -> "text".equals(c.type()))
                .map(AnthropicChatResponse.Content::text)
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Anthropic 응답 구조 이상: text content 없음 (content={})", response.content());
                    return new MindNestException(ErrorCode.LLM_ERROR, "Anthropic 응답에 text content가 없습니다");
                });
        return new LlmResponse(text);
    }
}
