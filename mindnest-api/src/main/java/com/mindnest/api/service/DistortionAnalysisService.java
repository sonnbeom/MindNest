package com.mindnest.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.domain.distortion.DistortionAnalysisResult;
import com.mindnest.api.domain.distortion.DistortionAnalysisResultValidator;
import com.mindnest.api.domain.session.SessionStage;
import com.mindnest.api.domain.session.SessionStageValidator;
import com.mindnest.api.dto.request.DistortionAnalysisRequest;
import com.mindnest.api.dto.response.DistortionAnalysisResponse;
import com.mindnest.api.exception.LlmResponseParseException;
import com.mindnest.api.llm.LlmClient;
import com.mindnest.api.llm.LlmMessage;
import com.mindnest.api.llm.LlmRequest;
import com.mindnest.api.llm.LlmResponse;
import com.mindnest.api.llm.prompt.DistortionAnalysisPrompt;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 인지 왜곡 분석 비즈니스 로직을 담당하는 서비스
 *
 * 처리 흐름:
 * 1. 세션 단계 검증 (DISTORTION_ANALYSIS인지 확인)
 * 2. 프롬프트 생성 (DistortionAnalysisPrompt)
 * 3. LLM 호출 (LlmClient)
 * 4. 응답 JSON 파싱 + 도메인 검증
 * 5. 응답 DTO 변환 후 반환
 *
 * LLM 모델·설정값은 application.yaml에서 주입받아
 * 코드 수정 없이 변경 가능하다.
 */
@Service
@RequiredArgsConstructor
public class DistortionAnalysisService {

    private final LlmClient llmClient;
    private final DistortionAnalysisPrompt prompt;
    private final DistortionAnalysisResultValidator validator;
    private final SessionStageValidator stageValidator;
    private final ObjectMapper objectMapper;

    /** application.yaml의 llm.anthropic.model 값 (기본: claude-haiku) */
    @Value("${llm.anthropic.model:claude-haiku-4-5-20251001}")
    private String model;

    /** 응답 다양성 조절 (0.3 = 낮은 창의성, 높은 일관성) */
    @Value("${llm.anthropic.temperature:0.3}")
    private double temperature;

    /** 응답 최대 토큰 수 */
    @Value("${llm.anthropic.max-tokens:1000}")
    private int maxTokens;

    /**
     * 인지 왜곡 분석의 전체 흐름을 조율하는 메인 메서드
     *
     * @param request 사용자 입력 (sessionId, stage, intakeSUD, intakeText)
     * @return 분석 결과 DTO (distortions + positives)
     */
    public DistortionAnalysisResponse analyze(DistortionAnalysisRequest request) {
        // 1. 현재 단계가 DISTORTION_ANALYSIS인지 검증
        stageValidator.requireStage(request.stage(), SessionStage.DISTORTION_ANALYSIS);

        // 2. 프롬프트 메시지 생성 후 LLM 호출
        List<LlmMessage> messages = prompt.buildMessages(request.intakeText(), request.intakeSUD());
        LlmResponse llmResponse = llmClient.complete(new LlmRequest(model, messages, temperature, maxTokens));

        // 3. LLM 응답 파싱·검증 후 DTO 변환
        DistortionAnalysisResult result = parseAndValidate(llmResponse.content());
        return toResponse(request.sessionId(), result);
    }

    /**
     * LLM 응답 텍스트를 파싱하고 도메인 규칙을 검증한다.
     *
     * LLM이 JSON 앞뒤에 설명 텍스트를 붙이는 경우를 대비해
     * extractJson()으로 JSON 부분만 먼저 추출한다.
     */
    private DistortionAnalysisResult parseAndValidate(String rawJson) {
        String json = extractJson(rawJson);
        try {
            DistortionAnalysisResult result = objectMapper.readValue(json, DistortionAnalysisResult.class);
            validator.validate(result);
            return result;
        } catch (JsonProcessingException e) {
            throw new LlmResponseParseException("LLM 응답 JSON 파싱 실패: " + e.getOriginalMessage());
        }
    }

    /**
     * 텍스트에서 첫 번째 { 부터 마지막 } 까지를 JSON으로 추출한다.
     * LLM이 JSON 앞뒤에 부연 설명을 추가하는 경우를 방어한다.
     */
    private String extractJson(String raw) {
        int start = raw.indexOf('{');
        int end = raw.lastIndexOf('}');
        if (start == -1 || end == -1) {
            throw new LlmResponseParseException("LLM 응답에서 JSON을 찾을 수 없습니다");
        }
        return raw.substring(start, end + 1);
    }

    /**
     * 도메인 결과 객체를 프론트엔드에 반환할 응답 DTO로 변환한다.
     * 도메인 레이어와 DTO 레이어를 분리하는 매핑 메서드.
     */
    private DistortionAnalysisResponse toResponse(String sessionId, DistortionAnalysisResult result) {
        List<DistortionAnalysisResponse.DistortionDto> distortions = result.distortions().stream()
                .map(d -> new DistortionAnalysisResponse.DistortionDto(d.name(), d.quote(), d.explanation()))
                .toList();

        List<DistortionAnalysisResponse.PositiveDto> positives = result.positives().stream()
                .map(p -> new DistortionAnalysisResponse.PositiveDto(p.value(), p.explanation()))
                .toList();

        return new DistortionAnalysisResponse(sessionId, distortions, positives);
    }
}
