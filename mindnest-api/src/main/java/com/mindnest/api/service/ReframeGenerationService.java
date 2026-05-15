package com.mindnest.api.service;

import com.mindnest.api.dto.request.ReframeGenerationRequest;
import com.mindnest.api.llm.RagClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class ReframeGenerationService {

    private final RagClient ragClient;

    public void generateStreaming(ReframeGenerationRequest request, OutputStream outputStream) throws IOException {
        String result = ragClient.reframe(request);
        outputStream.write(result.getBytes(StandardCharsets.UTF_8));
        outputStream.flush();
    }
}
