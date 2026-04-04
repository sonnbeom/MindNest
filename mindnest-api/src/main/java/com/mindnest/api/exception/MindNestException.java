package com.mindnest.api.exception;

public class MindNestException extends RuntimeException {

    private final ErrorCode errorCode;

    public MindNestException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorCode = errorCode;
    }

    public MindNestException(ErrorCode errorCode, String detail) {
        super(detail);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
