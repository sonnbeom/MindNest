import { AnimatedGroup } from "@/components/ui/animated-group";

const steps = [
  {
    number: "01",
    stage: "INTAKE",
    title: "감정 지수",
    description:
      "지금 이 순간 감정 강도(0~10)를 입력하고, 마음속 이야기를 자유롭게 적어보세요.",
    icon: "🌱",
    color: "from-orange-50 to-amber-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-600",
  },
  {
    number: "02",
    stage: "DISTORTION_ANALYSIS",
    title: "인지 왜곡 분석",
    description:
      "AI가 작성된 내용에서 인지 왜곡 패턴(흑백논리, 파국화 등)을 분석하고 근거 구절을 함께 제시합니다.",
    icon: "🔍",
    color: "from-pink-50 to-rose-50",
    border: "border-pink-100",
    badge: "bg-pink-100 text-pink-600",
  },
  {
    number: "03",
    stage: "REFRAME",
    title: "긍정적 재구성",
    description:
      "발견된 인지 왜곡 옆에, 더 긍정적으로 바라볼 수 있는 생각을 직접 적어보세요.",
    icon: "💡",
    color: "from-yellow-50 to-lime-50",
    border: "border-yellow-100",
    badge: "bg-yellow-100 text-yellow-600",
  },
  {
    number: "04",
    stage: "CBT_DIALOGUE",
    title: "생각 균형 잡기",
    description:
      "왜곡마다 찬반 증거를 직접 모아보고, 균형잡힌 생각을 찾아봅니다.",
    icon: "⚖️",
    color: "from-purple-50 to-violet-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-600",
  },
  {
    number: "05",
    stage: "CLOSE",
    title: "오늘의 마무리",
    description:
      "처음과 지금의 감정 강도를 비교하고, 오늘 발견한 왜곡과 균형잡힌 생각을 돌아봅니다.",
    icon: "🌿",
    color: "from-sky-50 to-blue-50",
    border: "border-sky-100",
    badge: "bg-sky-100 text-sky-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-pink-400 mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
            5단계 마음 돌봄 여정
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            인지 왜곡을 발견하고, 생각을 바꾸고, 감정을 돌보는 5단계 여정입니다.
            <br />
            단계를 건너뛰지 않고, 순서대로 진행됩니다.
          </p>
        </div>

        <AnimatedGroup preset="blur-slide" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.stage}
              className={`relative rounded-2xl border ${step.border} bg-gradient-to-br ${step.color} dark:bg-white/5 dark:border-white/10 dark:from-transparent dark:to-transparent p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{step.icon}</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${step.badge} dark:bg-white/10 dark:text-white`}
                >
                  {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}

          {/* 연결 화살표 카드 대신 빈 슬롯 처리용 */}
          <div className="hidden lg:flex items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-6 text-center">
            <div>
              <p className="text-2xl mb-2">🔄</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                기록이 끝나면
                <br />
                새로 시작할 수 있어요
              </p>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
