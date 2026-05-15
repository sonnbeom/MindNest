import type { Llm1Result } from "@/types/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function analyzeIntake(
  userInput: string,
  onChunk: (accumulated: string) => void
): Promise<Llm1Result> {
  const response = await fetch(`${API_URL}/api/v1/analysis/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput }),
  });

  if (!response.ok) throw new Error(`분석 요청 실패: ${response.status}`);
  if (!response.body) throw new Error("스트리밍 응답이 없습니다");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onChunk(accumulated);
  }

  return JSON.parse(accumulated) as Llm1Result;
}

export async function generateReframe(
  fact: string,
  selectedThought: string,
  selectedCounters: string[],
  selectedActions: string[],
  onChunk?: (accumulated: string) => void
): Promise<string> {
  const response = await fetch(`${API_URL}/api/v1/reframe/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fact, selectedThought, selectedCounters, selectedActions }),
  });

  if (!response.ok) throw new Error(`재구성 요청 실패: ${response.status}`);
  if (!response.body) throw new Error("스트리밍 응답이 없습니다");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onChunk?.(accumulated);
  }

  return accumulated;
}
