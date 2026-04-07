package com.mindnest.api.dto.response;

import com.mindnest.api.exception.ErrorCode;

public record ApiResponse<T>(
        boolean success,
        T data,
        ErrorDetail error
) {

    public record ErrorDetail(String code, String message) {}

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static ApiResponse<Void> fail(ErrorCode errorCode) {
        return new ApiResponse<>(false, null,
                new ErrorDetail(errorCode.name(), errorCode.getDefaultMessage()));
    }

    public static ApiResponse<Void> fail(ErrorCode errorCode, String detail) {
        return new ApiResponse<>(false, null,
                new ErrorDetail(errorCode.name(), detail));
    }
}
