package com.mindnest.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.domain.distortion.DistortionAnalysisResultValidator;
import com.mindnest.api.domain.session.SessionStageValidator;
import com.mindnest.api.dto.request.DistortionAnalysisRequest;
import com.mindnest.api.dto.response.DistortionAnalysisResponse;
import com.mindnest.api.exception.LlmResponseParseException;
import com.mindnest.api.exception.MindNestException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmResponse;
import com.mindnest.api.llm.prompt.DistortionAnalysisPrompt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class DistortionAnalysisServiceTest {

    @Mock
    private LlmClient llmClient;

    @Mock
    private DistortionAnalysisPrompt prompt;

    private DistortionAnalysisService service;

    @BeforeEach
    void setUp() {
        service = new DistortionAnalysisService(
                llmClient,
                prompt,
                new DistortionAnalysisResultValidator(),
                new SessionStageValidator(),
                new ObjectMapper()
        );
    }

    @Test
    void should_returnDistortionResponse_when_validRequestGiven() {
        String validJson = """
                {
                  "distortions": [
                    { "name": "예언자적 말하기", "quote": "원문 인용", "explanation": "설명" }
                  ],
                  "positives": [
                    { "value": "성취", "explanation": "설명" }
                  ]
                }
                """;

        given(prompt.buildMessages(any(), any(Integer.class))).willReturn(java.util.List.of());
        given(llmClient.complete(any())).willReturn(new LlmResponse(validJson));

        DistortionAnalysisRequest request = new DistortionAnalysisRequest(
                "session-1", "DISTORTION_ANALYSIS", 7, "이번 발표를 망치면 완전히 끝이에요"
        );

        DistortionAnalysisResponse response = service.analyze(request);

        assertThat(response.sessionId()).isEqualTo("session-1");
        assertThat(response.distortions()).hasSize(1);
        assertThat(response.distortions().get(0).name()).isEqualTo("예언자적 말하기");
        assertThat(response.positives()).hasSize(1);
    }

    @Test
    void should_throwMindNestException_when_stageIsNotDistortionAnalysis() {
        DistortionAnalysisRequest request = new DistortionAnalysisRequest(
                "session-1", "INTAKE", 7, "이번 발표를 망치면 완전히 끝이에요"
        );

        assertThatThrownBy(() -> service.analyze(request))
                .isInstanceOf(MindNestException.class);
    }

    @Test
    void should_throwLlmResponseParseException_when_llmReturnsInvalidJson() {
        given(prompt.buildMessages(any(), any(Integer.class))).willReturn(java.util.List.of());
        given(llmClient.complete(any())).willReturn(new LlmResponse("invalid json"));

        DistortionAnalysisRequest request = new DistortionAnalysisRequest(
                "session-1", "DISTORTION_ANALYSIS", 7, "이번 발표를 망치면 완전히 끝이에요"
        );

        assertThatThrownBy(() -> service.analyze(request))
                .isInstanceOf(LlmResponseParseException.class);
    }

    @Test
    void should_throwLlmResponseParseException_when_llmReturnsUnknownDistortionType() {
        String invalidTypeJson = """
                {
                  "distortions": [
                    { "name": "존재하지않는유형", "quote": "원문 인용", "explanation": "설명" }
                  ],
                  "positives": [
                    { "value": "성취", "explanation": "설명" }
                  ]
                }
                """;

        given(prompt.buildMessages(any(), any(Integer.class))).willReturn(java.util.List.of());
        given(llmClient.complete(any())).willReturn(new LlmResponse(invalidTypeJson));

        DistortionAnalysisRequest request = new DistortionAnalysisRequest(
                "session-1", "DISTORTION_ANALYSIS", 7, "이번 발표를 망치면 완전히 끝이에요"
        );

        assertThatThrownBy(() -> service.analyze(request))
                .isInstanceOf(LlmResponseParseException.class)
                .hasMessageContaining("허용되지 않은 인지 왜곡 유형");
    }

    @Test
    void should_throwLlmResponseParseException_when_llmReturnsNoPositives() {
        String noPositivesJson = """
                {
                  "distortions": [],
                  "positives": []
                }
                """;

        given(prompt.buildMessages(any(), any(Integer.class))).willReturn(java.util.List.of());
        given(llmClient.complete(any())).willReturn(new LlmResponse(noPositivesJson));

        DistortionAnalysisRequest request = new DistortionAnalysisRequest(
                "session-1", "DISTORTION_ANALYSIS", 7, "이번 발표를 망치면 완전히 끝이에요"
        );

        assertThatThrownBy(() -> service.analyze(request))
                .isInstanceOf(LlmResponseParseException.class);
    }
}
