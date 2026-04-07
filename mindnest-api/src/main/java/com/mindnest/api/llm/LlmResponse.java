package com.mindnest.api.llm;

/**
 * LlmClient.complete()가 반환하는 응답 객체
 *
 * - content: LLM이 생성한 텍스트 (JSON 문자열)
 *
 * 이 content를 DistortionAnalysisService에서 JSON 파싱해
 * DistortionAnalysisResult로 변환한다.
 */
public record LlmResponse(String content) {}
