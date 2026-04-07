package com.mindnest.api.llm;

import java.util.List;

/**
 * LlmClient.complete()에 전달하는 요청 객체
 *
 * - model      : 사용할 LLM 모델명 (application.yaml에서 설정)
 * - messages   : system + user 메시지 목록
 * - temperature: 응답 다양성 조절 (0.0~1.0, 낮을수록 일관된 출력)
 * - maxTokens  : 응답 최대 토큰 수 제한
 */
public record LlmRequest(
        String model,
        List<LlmMessage> messages,
        double temperature,
        int maxTokens
) {}
