package com.mindnest.api.dto.response;

import java.util.List;

/**
 * POST /api/v1/analysis/distortion 성공 응답 DTO
 *
 * ApiResponse<DistortionAnalysisResponse> 형태로 감싸져 반환된다.
 * 프론트엔드는 이 구조를 받아 SET_DISTORTIONS 액션으로 세션 상태를 업데이트한다.
 *
 * - sessionId  : 요청에서 받은 sessionId를 그대로 반환
 * - distortions: 발견된 인지 왜곡 목록
 * - positives  : 감정 이면에서 찾은 긍정 가치 목록
 */
public record DistortionAnalysisResponse(
        String sessionId,
        List<DistortionDto> distortions,
        List<PositiveDto> positives
) {

    /**
     * 인지 왜곡 하나를 프론트엔드에 전달하는 DTO
     * domain의 CognitiveDistortion과 동일한 구조이지만
     * 직렬화 관심사 분리를 위해 별도로 정의한다.
     */
    public record DistortionDto(String name, String quote, String explanation, String reframeSuggestion) {}

    /**
     * 긍정 가치 하나를 프론트엔드에 전달하는 DTO
     * domain의 PositiveValue와 동일한 구조이지만
     * 직렬화 관심사 분리를 위해 별도로 정의한다.
     */
    public record PositiveDto(String value, String explanation) {}
}
