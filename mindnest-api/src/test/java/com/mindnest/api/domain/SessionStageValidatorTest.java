package com.mindnest.api.domain;

import com.mindnest.api.domain.session.SessionStage;
import com.mindnest.api.domain.session.SessionStageValidator;
import com.mindnest.api.exception.MindNestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThatNoException;

class SessionStageValidatorTest {

    private SessionStageValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SessionStageValidator();
    }

    @Test
    void should_passValidation_when_stageMatches() {
        assertThatNoException().isThrownBy(() ->
                validator.requireStage("DISTORTION_ANALYSIS", SessionStage.DISTORTION_ANALYSIS)
        );
    }

    @Test
    void should_throwMindNestException_when_stageDoesNotMatch() {
        assertThatThrownBy(() ->
                validator.requireStage("INTAKE", SessionStage.DISTORTION_ANALYSIS)
        ).isInstanceOf(MindNestException.class);
    }
}
