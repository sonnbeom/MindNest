package com.mindnest.api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * POST /api/v1/analysis/distortion 요청 body DTO
 *
 * 프론트엔드에서 2단계(DISTORTION_ANALYSIS) 진입 시 전송.
 * @Valid 어노테이션으로 Bean Validation이 자동 실행되며,
 * 실패 시 GlobalExceptionHandler → HTTP 400 반환.
 *
 * - sessionId : 프론트엔드가 관리하는 세션 식별자
 * - stage     : 반드시 "DISTORTION_ANALYSIS" 여야 함 (SessionStageValidator가 재검증)
 * - intakeSUD : 사용자가 입력한 감정 강도 (0~10 정수)
 * - intakeText: 사용자가 입력한 자유 서술 텍스트 (5~2000자)
 */
public record DistortionAnalysisRequest(
        @NotBlank String sessionId,
        @NotBlank String stage,
        @Min(0) @Max(10) int intakeSUD,
        @NotBlank @Size(min = 5, max = 2000) String intakeText
) {}
