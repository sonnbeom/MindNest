package com.mindnest.api.feedback;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindnest.api.domain.distortion.DistortionAnalysisResult;
import com.mindnest.api.llm.LlmMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * LLM 대화 내용을 .jsonl 파일에 기록하는 컴포넌트.
 *
 * 목적: 프롬프트 품질 평가 및 향후 fine-tuning 데이터 수집.
 * 저장 위치: application.yaml의 feedback.file-path 설정값 (기본: ./feedback/distortion_analysis.jsonl)
 *
 * 파일 형식 (한 줄 = 하나의 세션):
 * {
 *   "timestamp": "ISO8601",
 *   "sessionId": "uuid",
 *   "intakeSUD": 7,
 *   "messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}],
 *   "rawResponse": "LLM이 반환한 원본 텍스트",
 *   "parsed": { "distortions": [...], "positives": [...] },
 *   "feedback": null    ← 직접 "good" / "bad" / "edited" 로 채울 필드
 * }
 *
 * 쓰기 실패 시 예외를 던지지 않고 로그만 남긴다.
 * 로깅 실패가 핵심 분석 흐름을 방해해서는 안 되기 때문이다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FeedbackLogger {

    private final ObjectMapper objectMapper;

    /** 저장할 .jsonl 파일 경로 (application.yaml에서 설정) */
    @Value("${feedback.file-path:./feedback/distortion_analysis.jsonl}")
    private String filePath;

    /**
     * 분석 결과를 .jsonl 파일에 한 줄로 append한다.
     *
     * @param sessionId   세션 고유 ID
     * @param intakeSUD   감정 강도 0~10
     * @param messages    LLM에 실제로 전달된 메시지 목록 (system + user)
     * @param rawResponse LLM이 반환한 원본 텍스트
     * @param result      파싱·검증된 분석 결과
     */
    public void log(
            String sessionId,
            int intakeSUD,
            List<LlmMessage> messages,
            String rawResponse,
            DistortionAnalysisResult result
    ) {
        try {
            Map<String, Object> entry = Map.of(
                    "timestamp", Instant.now().toString(),
                    "sessionId", sessionId,
                    "intakeSUD", intakeSUD,
                    "messages", messages,
                    "rawResponse", rawResponse,
                    "parsed", result,
                    "feedback", "null"   // 나중에 직접 good / bad / edited 로 수정
            );

            String line = objectMapper.writeValueAsString(entry) + "\n";
            Path path = Paths.get(filePath);

            // 부모 디렉토리가 없으면 자동 생성
            Files.createDirectories(path.getParent());

            Files.writeString(path, line, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND);

        } catch (IOException e) {
            // 로깅 실패가 핵심 분석 흐름을 막으면 안 됨 — 경고 로그만 남기고 계속 진행
            log.warn("피드백 데이터 저장 실패 (sessionId={}): {}", sessionId, e.getMessage());
        }
    }
}
