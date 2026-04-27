package com.mindnest.api.domain;

import com.mindnest.api.domain.distortion.*;
import com.mindnest.api.exception.LlmResponseParseException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatNoException;

class DistortionAnalysisResultValidatorTest {

    private DistortionAnalysisResultValidator validator;

    @BeforeEach
    void setUp() {
        validator = new DistortionAnalysisResultValidator();
    }

    @Test
    void should_passValidation_when_resultIsValid() {
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(new CognitiveDistortion("전부 아니면 전무", "원문 인용", "설명", "재구성 질문", "후속 질문")),
                List.of(new PositiveValue("성취", "설명", "기억 유도 질문"))
        );

        assertThatNoException().isThrownBy(() -> validator.validate(result));
    }

    @Test
    void should_throwException_when_distortionNameIsUnknown() {
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(new CognitiveDistortion("존재하지않는유형", "원문 인용", "설명", "재구성 질문", "후속 질문")),
                List.of(new PositiveValue("성취", "설명", "기억 유도 질문"))
        );

        assertThatThrownBy(() -> validator.validate(result))
                .isInstanceOf(LlmResponseParseException.class)
                .hasMessageContaining("허용되지 않은 인지 왜곡 유형");
    }

    @Test
    void should_throwException_when_quoteIsBlank() {
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(new CognitiveDistortion("전부 아니면 전무", "  ", "설명", "재구성 질문", "후속 질문")),
                List.of(new PositiveValue("성취", "설명", "기억 유도 질문"))
        );

        assertThatThrownBy(() -> validator.validate(result))
                .isInstanceOf(LlmResponseParseException.class)
                .hasMessageContaining("quote가 비어있습니다");
    }

    @Test
    void should_throwException_when_reframeQuestionIsBlank() {
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(new CognitiveDistortion("전부 아니면 전무", "원문 인용", "설명", "  ", "후속 질문")),
                List.of(new PositiveValue("성취", "설명", "기억 유도 질문"))
        );

        assertThatThrownBy(() -> validator.validate(result))
                .isInstanceOf(LlmResponseParseException.class)
                .hasMessageContaining("reframeQuestion이 비어있습니다");
    }

    @Test
    void should_throwException_when_positivesIsEmpty() {
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(new CognitiveDistortion("전부 아니면 전무", "원문 인용", "설명", "재구성 질문", "후속 질문")),
                List.of()
        );

        assertThatThrownBy(() -> validator.validate(result))
                .isInstanceOf(LlmResponseParseException.class)
                .hasMessageContaining("positives");
    }

    @Test
    void should_passValidation_when_distortionsIsEmpty() {
        // 왜곡이 발견되지 않을 수도 있음 — 빈 배열 허용
        DistortionAnalysisResult result = new DistortionAnalysisResult(
                List.of(),
                List.of(new PositiveValue("성취", "설명", "기억 유도 질문"))
        );

        assertThatNoException().isThrownBy(() -> validator.validate(result));
    }
}
