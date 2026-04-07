package com.mindnest.api.llm;

/**
 * LLM 호출을 추상화하는 핵심 인터페이스
 *
 * 이 인터페이스가 존재하는 이유:
 * - 현재(Phase 1): AnthropicLlmClient가 Claude API를 직접 호출
 * - Phase 4 전환 시: PythonAgentGateway로 구현체만 교체하면
 *   Service·Controller 등 상위 코드를 전혀 수정하지 않아도 된다
 *
 * 새로운 LLM 프로바이더를 추가하려면 이 인터페이스를 구현하면 된다.
 */
public interface LlmClient {

    /**
     * LLM에 메시지를 보내고 응답을 받는다.
     *
     * @param request 모델명, 메시지 목록, 온도, 최대 토큰 수를 담은 요청 객체
     * @return LLM이 생성한 텍스트 응답
     */
    LlmResponse complete(LlmRequest request);
}
