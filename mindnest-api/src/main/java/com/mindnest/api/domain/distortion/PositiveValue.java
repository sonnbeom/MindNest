package com.mindnest.api.domain.distortion;

/**
 * LLM이 분석해 반환하는 감정 이면의 긍정 가치를 나타내는 값 객체(Value Object)
 *
 * - value      : 긍정 가치명 (예: 성취, 책임감, 연결)
 * - explanation: 이 가치가 어떻게 보이는지 LLM이 생성한 설명
 *
 * 3단계(REFRAME)에서 사용자가 이 목록을 보고 가치를 선택하거나 직접 입력한다.
 */
public record PositiveValue(
        String value,
        String explanation
) {}
