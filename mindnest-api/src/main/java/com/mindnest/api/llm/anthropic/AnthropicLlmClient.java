package com.mindnest.api.llm.anthropic;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.LlmResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class AnthropicLlmClient implements LlmClient {

    private final RestClient llmRestClient;
    private final ObjectMapper objectMapper;
    private final HttpClient streamingHttpClient;
    private final String apiKey;
    private final String baseUrl;
    private final String version;

    public AnthropicLlmClient(
            RestClient llmRestClient,
            ObjectMapper objectMapper,
            @Value("${llm.anthropic.api-key}") String apiKey,
            @Value("${llm.anthropic.base-url}") String baseUrl,
            @Value("${llm.anthropic.version}") String version
    ) {
        this.llmRestClient = llmRestClient;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.version = version;
        this.streamingHttpClient = HttpClient.newHttpClient();
    }

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

    @Override
    public void completeStreaming(LlmRequest request, OutputStream outputStream) throws IOException {
        Map<String, Object> body = buildBody(request);
        body.put("stream", true);

        String bodyJson = objectMapper.writeValueAsString(body);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/messages"))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", version)
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

        try {
            HttpResponse<InputStream> httpResponse =
                    streamingHttpClient.send(httpRequest, HttpResponse.BodyHandlers.ofInputStream());

            if (httpResponse.statusCode() >= 400) {
                String msg = "Anthropic 스트리밍 API 호출 실패 [HTTP " + httpResponse.statusCode() + "]";
                log.error(msg);
                throw new MindNestException(ErrorCode.LLM_ERROR, msg);
            }

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(httpResponse.body(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.startsWith("data: ")) continue;
                    String data = line.substring(6).trim();
                    if ("[DONE]".equals(data)) break;

                    try {
                        JsonNode node = objectMapper.readTree(data);
                        if ("content_block_delta".equals(node.path("type").asText())) {
                            String text = node.path("delta").path("text").asText("");
                            if (!text.isEmpty()) {
                                outputStream.write(text.getBytes(StandardCharsets.UTF_8));
                                outputStream.flush();
                            }
                        }
                    } catch (Exception ignored) {
                        // 개별 SSE 청크 파싱 실패 시 스킵
                    }
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Anthropic 스트리밍 인터럽트", e);
        }
    }

    private Map<String, Object> buildBody(LlmRequest request) {
        String systemContent = request.messages().stream()
                .filter(m -> "system".equals(m.role()))
                .map(m -> m.content())
                .findFirst()
                .orElse("");

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
