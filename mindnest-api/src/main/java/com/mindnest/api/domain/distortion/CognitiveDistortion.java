package com.mindnest.api.domain.distortion;

/**
 * LLM이 분석해 반환하는 인지 왜곡 하나를 나타내는 값 객체(Value Object)
 *
 * - name            : 왜곡 유형명 (DistortionType의 koreanName 중 하나여야 함)
 * - quote           : 사용자 원문에서 그대로 인용한 왜곡 발생 문장
 * - explanation     : 왜 이 왜곡인지 LLM이 생성한 간략한 설명
 * - reframeQuestion : 감정 인정 후 다른 시각을 열어주는 질문
 * - followUpPrompt  : 구체적 기억을 유도하는 작고 구체적인 질문 1개
 */
public record CognitiveDistortion(
        String name,
        String quote,
        String explanation,
        String reframeQuestion,
        String followUpPrompt
) {}
