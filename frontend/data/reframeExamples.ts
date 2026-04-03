export interface ReframeExample {
  situation: string;
  negativeThought: string;
  positiveReframe: string;
}

export const reframeExamples: ReframeExample[] = [
  {
    situation: "실직 후 우울함을 느끼는 상황",
    negativeThought: "나는 가장인데 실패했어. 가족들이 나를 어떻게 볼까.",
    positiveReframe:
      "이 우울함의 이면에는 가족을 책임지고 싶은 강한 사랑이 있어요. 경제적으로 기여해 가정을 지키고자 하는 마음이 그만큼 크기 때문에 지금이 더 힘든 거예요.",
  },
  {
    situation: "발표 실수 후 자책하는 상황",
    negativeThought: "다들 나를 무능하다고 볼 거야. 이번 기회를 완전히 망쳤어.",
    positiveReframe:
      "잘 해내고 싶은 마음이 컸기 때문에 실수가 더 크게 느껴지는 거예요. 그 열망은 성장을 향한 긍정적인 에너지예요.",
  },
  {
    situation: "친구와 다툰 후 관계가 걱정되는 상황",
    negativeThought: "이 관계가 끝날 것 같아. 내가 너무 심한 말을 했나 봐.",
    positiveReframe:
      "이 불안함 이면에는 그 관계를 소중히 여기는 진심이 있어요. 관계가 중요하기 때문에 잃을까 봐 두려운 거예요.",
  },
];
