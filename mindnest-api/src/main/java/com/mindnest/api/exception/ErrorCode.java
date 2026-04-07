package com.mindnest.api.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // 400 — 클라이언트 입력 오류
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "잘못된 입력입니다"),
    COUNSELING_NOT_FOUND(HttpStatus.BAD_REQUEST, "상담을 찾을 수 없습니다"),
    INVALID_SUD_VALUE(HttpStatus.BAD_REQUEST, "SUD 값은 0~10 사이여야 합니다"),

    // 422 — 비즈니스 규칙 위반
    INVALID_COUNSELING_STAGE(HttpStatus.UNPROCESSABLE_CONTENT, "현재 상담 단계에서 허용되지 않는 요청입니다"),

    // 500 — 서버 오류
    LLM_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI 분석 중 오류가 발생했습니다"),
    LLM_PARSE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI 응답 형식이 올바르지 않습니다"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다");

    private final HttpStatus status;
    private final String defaultMessage;

    ErrorCode(HttpStatus status, String defaultMessage) {
        this.status = status;
        this.defaultMessage = defaultMessage;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
