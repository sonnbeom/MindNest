package com.mindnest.api.controller;

import com.mindnest.api.dto.request.ReframeGenerationRequest;
import com.mindnest.api.service.ReframeGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReframeGenerationController {

    private final ReframeGenerationService reframeGenerationService;

    @PostMapping("/reframe/generate")
    public ResponseEntity<StreamingResponseBody> generate(@RequestBody @Valid ReframeGenerationRequest request) {
        StreamingResponseBody body = outputStream ->
                reframeGenerationService.generateStreaming(request, outputStream);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(body);
    }
}
