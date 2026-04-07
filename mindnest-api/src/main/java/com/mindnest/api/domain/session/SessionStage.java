package com.mindnest.api.domain.session;

/**
 * CBT 세션의 5단계 상태를 나타내는 열거형
 *
 * 반드시 아래 순서로만 진행되며, 단계 건너뛰기는 금지된다.
 *
 * INTAKE              → 1단계: SUD 슬라이더 + 자유 서술 입력
 * DISTORTION_ANALYSIS → 2단계: LLM 인지 왜곡 분석
 * REFRAME             → 3단계: 감정 이면 탐색, 긍정 가치 선택
 * CBT_DIALOGUE        → 4단계: 소크라테스식 5턴 대화
 * CLOSE               → 5단계: 세션 후 SUD 기록 + 요약
 */
public enum SessionStage {
    INTAKE,
    DISTORTION_ANALYSIS,
    REFRAME,
    CBT_DIALOGUE,
    CLOSE
}
