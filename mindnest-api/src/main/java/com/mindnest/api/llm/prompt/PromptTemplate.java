package com.mindnest.api.llm.prompt;

import java.util.Map;

/**
 * 프롬프트 템플릿 추상화 인터페이스
 *
 * 이 인터페이스가 존재하는 이유:
 * - Phase 2 RAG 도입 시 render() 내부에서 벡터 DB 검색 결과를
 *   컨텍스트로 주입할 수 있는 구조를 미리 확보
 * - 현재(Phase 1): DistortionAnalysisPrompt가 파일 기반 템플릿 변수 치환
 */
public interface PromptTemplate {

    /**
     * 템플릿의 {{변수}} 자리에 실제 값을 채워 완성된 프롬프트 문자열을 반환한다.
     *
     * @param variables 치환할 변수 이름과 값의 맵 (예: {"intakeText": "..."})
     * @return 변수가 치환된 완성 프롬프트 문자열
     */
    String render(Map<String, String> variables);
}
