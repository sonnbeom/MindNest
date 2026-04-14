/**
 * LLM 호출 전용 모듈.
 * 컴포넌트에서 직접 fetch하지 않고 반드시 이 파일을 통해 호출합니다.
 *
 * Phase 2 RAG, Phase 3 Fine-tuning, Phase 4 멀티 에이전트 모두 여기서 교체.
 */

import type { Distortion, Positive } from "@/types/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * 인지 왜곡 분석 요청.
 * 백엔드 POST /api/v1/analysis/distortion 호출 후 distortions + positives 반환.
 *
 * @param sessionId  세션 고유 ID (프론트 useReducer에서 생성된 UUID)
 * @param intakeSUD  감정 지수 0~10
 * @param intakeText 사용자가 1단계에서 입력한 자유 서술 텍스트
 */
export async function analyzeDistortions(
  sessionId: string,
  intakeSUD: number,
  intakeText: string
): Promise<{ distortions: Distortion[]; positives: Positive[] }> {
  const res = await fetch(`${API_URL}/api/v1/analysis/distortion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      stage: "DISTORTION_ANALYSIS",
      intakeSUD,
      intakeText,
    }),
  });

  if (!res.ok) {
    throw new Error(`분석 요청 실패 (${res.status})`);
  }

  // 백엔드 응답: ApiResponse<DistortionAnalysisResponse>
  // { "data": { "sessionId": "...", "distortions": [...], "positives": [...] } }
  const json = await res.json();
  return {
    distortions: json.data.distortions,
    positives: json.data.positives,
  };
}
