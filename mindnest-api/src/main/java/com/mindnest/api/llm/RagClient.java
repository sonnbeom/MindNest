package com.mindnest.api.llm;

import com.mindnest.api.dto.request.ReframeGenerationRequest;

public interface RagClient {
    String analyze(String intakeText);
    String reframe(ReframeGenerationRequest request);
}
