const features = [
  {
    icon: "🧩",
    title: "인지 왜곡 자동 분석",
    description:
      "흑백논리, 지나친 일반화, 독심술 등 11가지 공식 심리학 기준으로 AI가 내 생각 속 패턴을 찾아줍니다.",
    tag: "AI 분석",
  },
  {
    icon: "⚖️",
    title: "증거 기반 생각 균형 잡기",
    description:
      "왜곡된 생각마다 찬반 증거를 직접 모아보고, 더 균형잡힌 생각을 스스로 찾아가는 구조적 방식입니다.",
    tag: "CBT 핵심",
  },
  {
    icon: "📊",
    title: "감정 강도 기록",
    description:
      "세션 전후 감정 강도(0~10)를 비교해 변화를 확인합니다. 작은 변화도 소중한 진전이에요.",
    tag: "SUD 트래킹",
  },
  {
    icon: "🔒",
    title: "내 이야기는 내 것",
    description:
      "상담 내용은 외부 서버로 전송되지 않습니다. 데이터는 로컬에 머물며, 당신의 이야기는 당신만 볼 수 있습니다.",
    tag: "프라이버시",
  },
  {
    icon: "🧭",
    title: "구조화된 5단계 흐름",
    description:
      "감정 지수 → 왜곡 분석 → 재구성 → 균형 잡기 → 마무리, 순서대로 진행되는 CBT 세션 구조입니다.",
    tag: "5단계",
  },
  {
    icon: "💡",
    title: "생각 재구성",
    description:
      "발견된 인지 왜곡에 대해 사실/해석을 나누고, 반례를 찾으며 더 균형잡힌 생각을 직접 써봅니다.",
    tag: "리프레이밍",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20" style={{ background: "#ffffff" }}>
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{ background: "var(--primary-light)", color: "#92700a" }}
          >
            주요 기능
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
          >
            Mindnest가 특별한 이유
          </h2>
          <p className="max-w-md mx-auto text-base leading-relaxed" style={{ color: "var(--muted)" }}>
            단순한 일기 앱이 아닙니다. 인지 왜곡을 발견하고
            스스로 생각을 바꾸는 구조적 CBT 여정입니다.
          </p>
        </div>

        {/* 기능 그리드 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 flex flex-col gap-3 rounded-2xl border transition-shadow hover:shadow-md"
              style={{
                background: "#ffffff",
                borderColor: "var(--border)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{feature.icon}</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--primary-light)", color: "#92700a" }}
                >
                  {feature.tag}
                </span>
              </div>
              <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
