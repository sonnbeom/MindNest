package com.mindnest.api.domain.distortion;

/**
 * LLM이 분석해 반환하는 인지 왜곡 하나를 나타내는 값 객체(Value Object)
 *
 * - name              : 왜곡 유형명 (DistortionType의 koreanName 중 하나여야 함)
 * - quote             : 사용자 원문에서 그대로 인용한 왜곡 발생 문장
 * - explanation       : 왜 이 왜곡인지 LLM이 생성한 간략한 설명
 * - reframeSuggestion : 이 왜곡에 대한 LLM의 긍정적 재구성 예시 (3단계 피드백용)
 */
public record CognitiveDistortion(
        String name,
        String quote,
        String explanation,
        String reframeSuggestion
) {}
