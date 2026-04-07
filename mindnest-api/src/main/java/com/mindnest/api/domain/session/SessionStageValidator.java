package com.mindnest.api.domain.session;

import com.mindnest.api.exception.ErrorCode;
import com.mindnest.api.exception.MindNestException;
import org.springframework.stereotype.Component;

/**
 * 세션 단계 전환 규칙을 검증하는 클래스
 *
 * 각 API 엔드포인트 진입 시 호출되어, 요청의 stage 값이
 * 해당 엔드포인트에서 기대하는 단계와 일치하는지 확인한다.
 *
 * 불일치 시 → MindNestException(INVALID_COUNSELING_STAGE) → HTTP 422
 */
@Component
public class SessionStageValidator {

    /**
     * 요청의 실제 stage 값이 필요한 단계와 일치하는지 검증한다.
     *
     * @param actual   요청 body에서 받은 stage 문자열
     * @param required 이 엔드포인트에서 반드시 필요한 단계
     * @throws MindNestException 단계가 일치하지 않으면 422 에러
     */
    public void requireStage(String actual, SessionStage required) {
        if (!required.name().equals(actual)) {
            throw new MindNestException(
                    ErrorCode.INVALID_COUNSELING_STAGE,
                    "현재 단계: " + actual + ", 필요 단계: " + required.name()
            );
        }
    }
}
