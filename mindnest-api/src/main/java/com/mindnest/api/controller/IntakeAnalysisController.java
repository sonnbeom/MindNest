package com.mindnest.api.controller;

import com.mindnest.api.domain.intake.IntakeAnalysisResult;
import com.mindnest.api.dto.request.IntakeAnalysisRequest;
import com.mindnest.api.service.IntakeAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class IntakeAnalysisController {

    private final IntakeAnalysisService intakeAnalysisService;

    @PostMapping("/analysis/intake")
    public ResponseEntity<IntakeAnalysisResult> analyze(@RequestBody @Valid IntakeAnalysisRequest request) {
        return ResponseEntity.ok(intakeAnalysisService.analyze(request.userInput()));
    }
}
