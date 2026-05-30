package com.mindnest.api.llm;

import com.mindnest.api.dto.request.ReframeGenerationRequest;
import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Slf4j
@Component
public class RagHttpClient implements RagClient {

    private final RestClient ragRestClient;

    public RagHttpClient(@Qualifier("ragRestClient") RestClient ragRestClient) {
        this.ragRestClient = ragRestClient;
    }

    @Override
    public String analyze(String intakeText) {
        record AnalyzeResponse(String result) {}

        AnalyzeResponse response = ragRestClient.post()
                .uri("/rag/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("intake_text", intakeText))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    String msg = "RAG 서버 analyze 호출 실패 [HTTP " + res.getStatusCode() + "]";
                    log.error(msg);
                    throw new MindNestException(ErrorCode.LLM_ERROR, msg);
                })
                .body(AnalyzeResponse.class);

        if (response == null || response.result() == null) {
            throw new MindNestException(ErrorCode.LLM_ERROR, "RAG 서버 analyze 응답이 비어있습니다");
        }
        return response.result();
    }

    @Override
    public String reframe(ReframeGenerationRequest request) {
        record ReframeResponse(String result) {}

        ReframeResponse response = ragRestClient.post()
                .uri("/rag/reframe")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "selected_thought", request.selectedThought(),
                        "fact", request.fact(),
                        "selected_counters", request.selectedCounters(),
                        "selected_actions", request.selectedActions()
                ))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    String msg = "RAG 서버 reframe 호출 실패 [HTTP " + res.getStatusCode() + "]";
                    log.error(msg);
                    throw new MindNestException(ErrorCode.LLM_ERROR, msg);
                })
                .body(ReframeResponse.class);

        if (response == null || response.result() == null) {
            throw new MindNestException(ErrorCode.LLM_ERROR, "RAG 서버 reframe 응답이 비어있습니다");
        }
        return response.result();
    }
}
