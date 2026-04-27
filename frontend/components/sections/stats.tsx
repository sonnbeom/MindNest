const stats = [
  { icon: "🎓", value: "11가지", label: "인지 왜곡 유형 분석" },
  { icon: "🔍", value: "5단계", label: "구조화된 CBT 흐름" },
  { icon: "🕐", value: "20분", label: "평균 세션 소요 시간" },
];

export default function StatsSection() {
  return (
    <section className="px-6 py-10" style={{ background: "var(--background)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-5 rounded-2xl"
              style={{
                background: "#ffffff",
                boxShadow: "var(--shadow-card)",
                borderRadius: "var(--radius-card)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--primary-light)" }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}>
                  {stat.value}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
