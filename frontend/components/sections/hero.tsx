import Link from "next/link";

const steps = [
  {
    icon: "💭",
    title: "생각 꺼내기",
    description: "머릿속에서 계속 맴도는 생각,\n그대로 꺼내보세요",
  },
  {
    icon: "🧩",
    title: "생각 나누기",
    description: "복잡한 생각도 글로 풀어보면\n조금씩 정리되기 시작합니다",
  },
  {
    icon: "🔍",
    title: "다르게 보기",
    description: "지금 떠오른 생각이 정말 사실인지,\n혹은 내가 그렇게 해석하고 있는 건지 살펴봅니다",
  },
  {
    icon: "🌿",
    title: "다시 바라보기",
    description: "한쪽으로 치우친 시선이 아니라,\n조금 더 차분하고 현실적인 관점으로 정리해봅니다",
  },
  {
    icon: "🚶",
    title: "작은 행동 정하기",
    description: "생각을 바꾸는 것에서 끝나지 않고,\n작은 행동으로 이어갑니다",
  },
];

export default function HeroSection() {
  return (
    <section className="px-6 pt-20 pb-24" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto text-center">

        {/* 제목 */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
        >
          감정은 사실이지만,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f5c800 0%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            생각은 사실이 아닐 수도 있습니다
          </span>
        </h1>

        {/* 소제목 */}
        <p className="text-lg leading-relaxed max-w-xl mx-auto mb-12" style={{ color: "var(--muted)" }}>
          지금 드는 생각, Mindnest와 함께 한 번 들여다볼까요?
        </p>

        {/* CTA 버튼 */}
        <div className="flex items-center justify-center mb-20">
          <Link
            href="/session"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold transition-all hover:scale-105"
            style={{
              background: "var(--primary)",
              color: "var(--text)",
              borderRadius: "var(--radius-button)",
              boxShadow: "0 4px 20px rgba(245, 200, 0, 0.4)",
            }}
          >
            생각 꺼내보기 →
          </Link>
        </div>

        {/* 🌱 마음 정리 여정 */}
        <div
          id="journey"
          className="rounded-3xl p-8 sm:p-12"
          style={{
            background: "#ffffff",
            boxShadow: "var(--shadow-card)",
            borderRadius: "var(--radius-section)",
          }}
        >
          <p
            className="text-xl font-bold mb-10 text-left"
            style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
          >
            생각 정리 과정
          </p>

          {/* 데스크탑: 가로 5열 / 모바일: 세로 리스트 */}
          <div className="hidden sm:grid sm:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: "var(--primary-light)" }}
                >
                  {step.icon}
                </div>
                <div>
                  <p className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className="absolute"
                    style={{ display: "none" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 모바일: 세로 카드 */}
          <div className="flex flex-col gap-6 sm:hidden">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-5">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "var(--primary-light)" }}
                  >
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-6" style={{ background: "var(--border)" }} />
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-base font-bold mb-1.5" style={{ color: "var(--text)" }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
