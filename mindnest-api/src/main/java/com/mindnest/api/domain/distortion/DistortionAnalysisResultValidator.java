package com.mindnest.api.domain.distortion;

import com.mindnest.api.exception.LlmResponseParseException;
import org.springframework.stereotype.Component;

/**
 * LLM이 반환한 인지 왜곡 분석 결과의 도메인 규칙을 검증하는 클래스
 *
 * LLM 응답을 JSON 파싱한 직후 호출되어, 허용되지 않은 유형이나
 * 빈 값이 포함된 경우 LlmResponseParseException을 던진다.
 *
 * 검증 실패 → GlobalExceptionHandler → HTTP 500 (LLM_PARSE_ERROR)
 */
@Component
public class DistortionAnalysisResultValidator {

    /**
     * 분석 결과 전체를 검증한다.
     * 왜곡 목록 → 긍정 가치 목록 순서로 검증.
     */
    public void validate(DistortionAnalysisResult result) {
        validateDistortions(result);
        validatePositives(result);
    }

    /**
     * 각 인지 왜곡 항목을 검증한다.
     *
     * - name이 DistortionType의 11개 허용 목록 중 하나인지 확인
     * - quote(원문 인용)가 비어있지 않은지 확인
     */
    private void validateDistortions(DistortionAnalysisResult result) {
        for (CognitiveDistortion distortion : result.distortions()) {
            if (!DistortionType.isValid(distortion.name())) {
                throw new LlmResponseParseException(
                        "허용되지 않은 인지 왜곡 유형: " + distortion.name()
                );
            }
            if (distortion.quote() == null || distortion.quote().isBlank()) {
                throw new LlmResponseParseException(
                        "인지 왜곡의 quote가 비어있습니다: " + distortion.name()
                );
            }
            if (distortion.reframeQuestion() == null || distortion.reframeQuestion().isBlank()) {
                throw new LlmResponseParseException(
                        "인지 왜곡의 reframeQuestion이 비어있습니다: " + distortion.name()
                );
            }
        }
    }

    /**
     * 긍정 가치 목록이 최소 1개 이상인지 확인한다.
     * LLM이 positives를 빈 배열로 반환하는 경우를 방어한다.
     */
    private void validatePositives(DistortionAnalysisResult result) {
        if (result.positives() == null || result.positives().isEmpty()) {
            throw new LlmResponseParseException("긍정 가치(positives)가 1개 이상 필요합니다");
        }
    }
}
