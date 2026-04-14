// TODO: 이 파일의 목업 응답은 lib/llm.ts의 실제 API 호출로 교체됩니다.
// analyzeDistortions() 및 generateCBTResponse() 구현 후 삭제 예정.

import type { Distortion, Positive } from "@/types/session";

export const mockDistortionResult: {
  distortions: Distortion[];
  positives: Positive[];
} = {
  distortions: [
    {
      name: "파국화",
      quote: "이번 일이 잘못되면 모든 게 끝날 것 같아요",
      explanation:
        "실제보다 결과를 훨씬 나쁘게 예측하고 있어요. 최악의 경우만 상상하며 불안이 커지고 있습니다.",
      reframeSuggestion:
        "이 일을 잘 마무리하고 싶은 마음이 강하다는 건, 그만큼 진지하게 임하고 있다는 뜻이에요.",
    },
    {
      name: "흑백논리",
      quote: "완벽하게 해내지 못하면 실패한 거잖아요",
      explanation:
        "성공과 실패 사이의 다양한 가능성을 보지 못하고 있어요. 중간 지점이 분명히 존재합니다.",
      reframeSuggestion:
        "완벽하게 하고 싶은 마음 자체가 성장하고 싶다는 의지예요. 그 기준이 당신을 여기까지 오게 했어요.",
    },
  ],
  positives: [
    {
      value: "성취",
      explanation:
        "결과를 잘 만들어내고 싶은 마음이 강하게 있군요. 그 열망이 이 상황을 더 힘들게 느끼게 했을 수 있어요.",
    },
    {
      value: "책임감",
      explanation:
        "맡은 일을 제대로 해내고 싶은 진지한 태도가 느껴져요. 그 책임감이 당신을 이 자리까지 오게 했습니다.",
    },
  ],
};

// CBT 5턴 목업 응답 (Turn 0~4)
export const mockCBTResponses: string[] = [
  "그 순간 가장 먼저 떠오른 생각은 무엇이었나요? 구체적으로 이야기해주실 수 있나요?",
  "그 생각을 지지하는 근거와 반대하는 근거를 각각 떠올려볼 수 있을까요?",
  "만약 가장 친한 친구가 같은 상황에 있다면, 당신은 친구에게 뭐라고 말해줄 것 같나요?",
  "지금까지 이야기를 나누면서, 처음 생각을 조금 다르게 표현해볼 수 있을까요?",
  "이번 주 안에 작게 시도해볼 수 있는 한 가지 행동이 있다면 무엇일까요?",
];
