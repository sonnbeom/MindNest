package com.mindnest.api.llm.prompt;

import com.mindnest.api.llm.LlmMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Component
public class ReframeGenerationPrompt implements PromptTemplate {

    private static final String SYSTEM_SECTION = "## SYSTEM";
    private static final String USER_TEMPLATE_SECTION = "## USER TEMPLATE";
    private static final String FEW_SHOT_SECTION = "## FEW-SHOT EXAMPLE";

    @Value("classpath:${llm.anthropic.prompt.reframe-generation}")
    private Resource promptResource;

    private String systemPrompt;
    private String userTemplate;
    private String fewShotExample;

    @PostConstruct
    void init() throws IOException {
        String raw = promptResource.getContentAsString(StandardCharsets.UTF_8);
        this.systemPrompt = extractSection(raw, SYSTEM_SECTION, USER_TEMPLATE_SECTION);
        this.userTemplate = extractSection(raw, USER_TEMPLATE_SECTION, FEW_SHOT_SECTION);
        this.fewShotExample = extractSection(raw, FEW_SHOT_SECTION, "## CHANGELOG");
    }

    public List<LlmMessage> buildMessages(
            String fact,
            String selectedThought,
            List<String> selectedCounters,
            List<String> selectedActions
    ) {
        String renderedUser = render(Map.of(
                "fact", fact,
                "selectedThought", selectedThought,
                "selectedCounters", String.join(", ", selectedCounters),
                "selectedActions", String.join(", ", selectedActions)
        ));
        return List.of(
                LlmMessage.system(systemPrompt.trim()),
                LlmMessage.user(fewShotExample.trim() + "\n\n---\n\n" + renderedUser.trim())
        );
    }

    @Override
    public String render(Map<String, String> variables) {
        String result = userTemplate;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }

    private String extractSection(String raw, String startMarker, String endMarker) {
        int start = raw.indexOf(startMarker);
        int end = raw.indexOf(endMarker, start + startMarker.length());
        if (start == -1) return "";
        String section = end == -1 ? raw.substring(start) : raw.substring(start, end);
        int newline = section.indexOf('\n');
        return newline == -1 ? "" : section.substring(newline + 1);
    }
}
