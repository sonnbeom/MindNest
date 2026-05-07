package com.mindnest.api.dto.request;

import jakarta.validation.constraints.NotBlank;

public record IntakeAnalysisRequest(
        @NotBlank String userInput
) {}
