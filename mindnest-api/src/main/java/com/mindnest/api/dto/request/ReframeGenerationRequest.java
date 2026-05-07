package com.mindnest.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReframeGenerationRequest(
        @NotBlank String fact,
        @NotBlank String selectedThought,
        @NotEmpty List<String> selectedCounters,
        @NotEmpty List<String> selectedActions
) {}
