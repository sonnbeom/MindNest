package com.mindnest.api.domain.distortion;

import java.util.List;

/**
 * LLM의 인지 왜곡 분석 결과 전체를 담는 값 객체(Value Object)
 *
 * - distortions: 발견된 인지 왜곡 목록 (없으면 빈 리스트)
 * - positives  : 감정 이면에서 찾은 긍정 가치 목록 (최소 1개)
 *
 * Jackson이 JSON 역직렬화할 때 이 record를 사용한다.
 * LLM 응답 JSON의 최상위 구조와 필드명이 일치해야 한다.
 */
public record DistortionAnalysisResult(
        List<CognitiveDistortion> distortions,
        List<PositiveValue> positives
) {}
