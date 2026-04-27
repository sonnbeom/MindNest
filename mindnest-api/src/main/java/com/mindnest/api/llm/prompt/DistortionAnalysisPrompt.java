package com.mindnest.api.llm.prompt;

import com.mindnest.api.domain.distortion.DistortionType;
import com.mindnest.api.llm.LlmMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 인지 왜곡 분석용 LLM 프롬프트를 생성하는 클래스
 *
 * 프롬프트 내용은 코드에 인라인으로 넣지 않고
 * resources/prompts/distortion_analysis.md 파일에서 읽는다.
 * → 코드 수정 없이 파일만 편집해서 프롬프트를 개선할 수 있다.
 *
 * 파일 구조:
 *   ## SYSTEM       → LLM 역할 정의 + 왜곡 유형 정의 (고정)
 *   ## USER TEMPLATE → {{변수}} 포함 템플릿
 *   ## FEW-SHOT EXAMPLE → 입력/출력 예시
 *   ## CHANGELOG    → 변경 이력 (코드에서 무시)
 */
@Component
public class DistortionAnalysisPrompt implements PromptTemplate {

    private static final String SYSTEM_SECTION = "## SYSTEM";
    private static final String USER_TEMPLATE_SECTION = "## USER TEMPLATE";
    private static final String FEW_SHOT_SECTION = "## FEW-SHOT EXAMPLE";

    @Value("classpath:${llm.anthropic.prompt.distortion-analysis}")
    private Resource promptResource;

    private String systemPrompt;    // SYSTEM 섹션 내용
    private String userTemplate;    // USER TEMPLATE 섹션 내용 ({{변수}} 포함)
    private String fewShotExample;  // FEW-SHOT EXAMPLE 섹션 내용

    /**
     * 애플리케이션 시작 시 프롬프트 파일을 읽어 각 섹션을 파싱한다.
     * 한 번만 실행되므로 매 요청마다 파일을 읽지 않는다.
     */
    @PostConstruct
    void init() throws IOException {
        String raw = promptResource.getContentAsString(StandardCharsets.UTF_8);
        this.systemPrompt = extractSection(raw, SYSTEM_SECTION, USER_TEMPLATE_SECTION);
        this.userTemplate = extractSection(raw, USER_TEMPLATE_SECTION, FEW_SHOT_SECTION);
        this.fewShotExample = extractSection(raw, FEW_SHOT_SECTION, "## CHANGELOG");
    }

    /**
     * 사용자 입력을 받아 LLM에 전달할 메시지 목록을 생성한다.
     *
     * 반환 구조:
     *   [0] system 메시지 → SYSTEM 섹션 (역할 정의 + 왜곡 유형 정의)
     *   [1] user 메시지   → FEW-SHOT 예시 + 실제 분석 요청
     *
     * @param intakeText 사용자가 입력한 자유 서술 텍스트
     * @param sudLevel   사용자가 입력한 감정 강도 (0~10)
     */
    public List<LlmMessage> buildMessages(String intakeText, int sudLevel) {
        // DistortionType enum에서 한국어 명칭 목록을 자동 생성
        // → enum과 프롬프트가 항상 동기화된 상태 유지
        String distortionTypes = Arrays.stream(DistortionType.values())
                .map(DistortionType::getKoreanName)
                .collect(Collectors.joining(", "));

        String renderedUser = render(Map.of(
                "intakeText", intakeText,
                "sudLevel", String.valueOf(sudLevel),
                "distortionTypes", distortionTypes
        ));

        return List.of(
                LlmMessage.system(systemPrompt.trim()),
                LlmMessage.user(fewShotExample.trim() + "\n\n---\n\n" + renderedUser.trim())
        );
    }

    /**
     * USER TEMPLATE의 {{변수명}} 자리를 실제 값으로 치환한다.
     *
     * @param variables 치환할 변수 맵 (예: {"intakeText": "발표가 걱정돼요"})
     */
    @Override
    public String render(Map<String, String> variables) {
        String result = userTemplate;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }

    /**
     * 마크다운 파일에서 두 섹션 헤더 사이의 내용을 추출한다.
     *
     * @param raw         파일 전체 문자열
     * @param startMarker 시작 헤더 (예: "## SYSTEM")
     * @param endMarker   종료 헤더 (예: "## USER TEMPLATE")
     * @return 헤더를 제외한 섹션 본문
     */
    private String extractSection(String raw, String startMarker, String endMarker) {
        int start = raw.indexOf(startMarker);
        int end = raw.indexOf(endMarker, start + startMarker.length());
        if (start == -1) return "";
        String section = end == -1 ? raw.substring(start) : raw.substring(start, end);
        // 섹션 헤더 줄 제거 후 본문만 반환
        int newline = section.indexOf('\n');
        return newline == -1 ? "" : section.substring(newline + 1);
    }
}
