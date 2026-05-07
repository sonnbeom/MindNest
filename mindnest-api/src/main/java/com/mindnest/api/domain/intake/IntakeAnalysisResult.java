package com.mindnest.api.domain.intake;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * intake_analysis.md 프롬프트의 JSON 출력 스키마와 1:1 대응하는 도메인 레코드.
 *
 * counter_hints / current_actions 는 LLM JSON에서 snake_case이므로
 * @JsonProperty로 역직렬화(LLM → Java) 및 직렬화(Java → 프론트) 모두 처리한다.
 */
public record IntakeAnalysisResult(
        List<String> thoughts,
        String fact,
        String interpretation,
        @JsonProperty("counter_hints") List<String> counterHints,
        @JsonProperty("current_actions") List<String> currentActions
) {}
