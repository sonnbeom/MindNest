package com.mindnest.api.llm;

/**
 * LLM에 전달하는 단일 메시지를 나타내는 값 객체
 *
 * - role   : 메시지 역할 ("system" 또는 "user")
 * - content: 메시지 내용
 *
 * system  → LLM의 역할·규칙·출력 형식 정의 (프롬프트 파일의 SYSTEM 섹션)
 * user    → 실제 분석 요청 내용 (few-shot 예시 + 사용자 입력)
 */
public record LlmMessage(String role, String content) {

    /** system 역할 메시지를 생성하는 팩토리 메서드 */
    public static LlmMessage system(String content) {
        return new LlmMessage("system", content);
    }

    /** user 역할 메시지를 생성하는 팩토리 메서드 */
    public static LlmMessage user(String content) {
        return new LlmMessage("user", content);
    }
}
