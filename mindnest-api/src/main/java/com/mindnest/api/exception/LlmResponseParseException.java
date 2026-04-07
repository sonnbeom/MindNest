package com.mindnest.api.exception;

/**
 * LLM 응답을 파싱하거나 도메인 규칙 검증에 실패했을 때 던지는 예외
 *
 * 발생 시점:
 * - LLM이 JSON 형식이 아닌 텍스트를 반환한 경우
 * - 허용되지 않은 인지 왜곡 유형이 포함된 경우
 * - quote 필드가 비어있는 경우
 * - positives가 빈 배열인 경우
 *
 * GlobalExceptionHandler에서 잡아 HTTP 500 (LLM_PARSE_ERROR)로 변환한다.
 */
public class LlmResponseParseException extends RuntimeException {

    /**
     * @param detail 어떤 파싱/검증 오류가 발생했는지 설명하는 메시지
     */
    public LlmResponseParseException(String detail) {
        super(detail);
    }
}
