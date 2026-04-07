package com.mindnest.api.controller;

import com.mindnest.api.dto.request.DistortionAnalysisRequest;
import com.mindnest.api.dto.response.ApiResponse;
import com.mindnest.api.dto.response.DistortionAnalysisResponse;
import com.mindnest.api.service.DistortionAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인지 왜곡 분석 API 컨트롤러
 *
 * 역할: HTTP 요청 수신 → 서비스 호출 → 응답 반환
 * 비즈니스 로직은 없으며 DistortionAnalysisService에 위임한다.
 *
 * 엔드포인트: POST /api/v1/analysis/distortion
 */
@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class DistortionAnalysisController {

    private final DistortionAnalysisService analysisService;

    /**
     * 사용자 입력을 받아 인지 왜곡 분석 결과를 반환한다.
     *
     * @param request  세션 정보 + 사용자 입력 텍스트 (@Valid로 Bean Validation 실행)
     * @return 200 OK + 분석 결과 (distortions, positives)
     *         400 Bad Request: 입력값 유효성 오류
     *         422 Unprocessable Entity: 세션 단계 불일치
     *         500 Internal Server Error: LLM 호출 실패
     */
    @PostMapping("/distortion")
    public ResponseEntity<ApiResponse<DistortionAnalysisResponse>> analyze(
            @RequestBody @Valid DistortionAnalysisRequest request) {
        DistortionAnalysisResponse response = analysisService.analyze(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
