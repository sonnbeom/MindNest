const reframeQuestions: Record<string, string> = {
  흑백논리: "이 상황을 흑과 백이 아닌 다른 방식으로 바라본다면 무엇이 보이나요?",
  파국화: "지금 이 순간, 최악의 가정 너머에 있는 것은 무엇인가요?",
  독심술: "직접 확인하지 않고 단정 짓고 있다면, 다른 가능성은 무엇인가요?",
  감정적추론: "이 감정을 잠시 내려놓고 바라본다면, 실제로 일어난 일은 무엇인가요?",
  과잉일반화: "'항상'과 '절대' 사이에서 예외가 있다면 어떤 것이 있나요?",
  개인화: "이 결과에 나 외에 영향을 준 것들은 무엇인가요?",
  선택적추상화: "부정적인 부분에만 집중했다면, 지금 시야 밖에 있는 것은 무엇인가요?",
  "축소·과장": "이 상황을 실제 크기로 바라본다면 어떻게 보이나요?",
  당위적사고: "'해야 한다'는 규칙이 없다면, 나는 어떤 선택을 하고 싶은가요?",
  낙인찍기: "이 순간의 행동이 아닌, 나라는 사람 전체를 본다면 어떤 모습인가요?",
};

const DEFAULT_QUESTION =
  "이 상황에서 지금껏 보지 못했던 것이 있다면 무엇인가요?";

export function getReframeQuestion(distortionName: string): string {
  const normalized = distortionName.replace(/\s/g, "");
  return reframeQuestions[normalized] ?? reframeQuestions[distortionName] ?? DEFAULT_QUESTION;
}
