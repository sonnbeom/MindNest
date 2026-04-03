import { AnimatedGroup } from "@/components/ui/animated-group";

const features = [
  {
    icon: "🧩",
    title: "인지 왜곡 자동 분석",
    description:
      "흑백논리, 파국화, 독심술 등 Beck의 인지 왜곡 기준으로 AI가 내 생각 속 패턴을 찾아줍니다.",
    tag: "AI 분석",
    tagColor: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300",
  },
  {
    icon: "⚖️",
    title: "증거 기반 생각 균형 잡기",
    description:
      "왜곡된 생각마다 찬반 증거를 직접 모아보고, 더 균형잡힌 생각을 스스로 찾아가는 구조적 방식입니다.",
    tag: "생각 균형",
    tagColor:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    icon: "📊",
    title: "감정 강도 기록",
    description:
      "기록 전후 감정 강도(0~10)를 비교해 변화를 확인합니다. 작은 변화도 소중한 진전이에요.",
    tag: "SUD 트래킹",
    tagColor: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
  },
  {
    icon: "🔒",
    title: "내 이야기는 내 것",
    description:
      "상담 내용은 외부 서버로 전송되지 않습니다. 데이터는 로컬에 머물며, 당신의 이야기는 당신만 볼 수 있습니다.",
    tag: "프라이버시",
    tagColor:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    icon: "🧭",
    title: "구조화된 5단계 흐름",
    description:
      "감정 지수 → 왜곡 분석 → 긍정적 재구성 → 생각 균형 잡기 → 오늘의 마무리, 순서대로 진행됩니다.",
    tag: "5단계 흐름",
    tagColor:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    icon: "💡",
    title: "긍정적 재구성",
    description:
      "발견된 인지 왜곡 옆에, 더 긍정적으로 바라볼 수 있는 생각을 직접 써봅니다. 스스로 발견한 생각이 가장 강력해요.",
    tag: "리프레이밍",
    tagColor: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="px-6 py-20"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #fdf2f8 50%, #f5f3ff 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
            MindNest가 특별한 이유
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            단순한 일기 앱이 아닙니다.
            <br />
            인지 왜곡을 발견하고 스스로 생각을 바꾸는 구조적 여정입니다.
          </p>
        </div>

        <AnimatedGroup preset="blur-slide" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{feature.icon}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${feature.tagColor}`}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
