const steps = [
  {
    num: "01",
    title: "자동적 사고 알아차리기",
    description: "무의식적으로 반복되는 부정적 생각 패턴을 포착합니다. 인식 자체가 변화의 시작입니다.",
    before: "요즘 아무것도 제대로 못 하고 있다\n시간만 계속 버리는 느낌이다",
    after: "눈에 보이는 결과는 없지만,\n정리하고 준비하는 과정일 수도 있다",
  },
  {
    num: "02",
    title: "생각의 근거 함께 살피기",
    description: "그 생각이 사실인지, 과장된 것인지 증거를 함께 점검합니다. 왜곡된 렌즈를 발견합니다.",
    before: "괜히 도전했다\n처음부터 안 하는 게 나았을지도 모른다",
    after: "결과는 아쉽지만,\n시도해본 경험은 남았다",
  },
  {
    num: "03",
    title: "균형 잡힌 시각으로 다시 쓰기",
    description: "더 현실적이고 건강한 관점으로 재구성합니다. 새로운 생각이 감정과 행동을 바꿉니다.",
    before: "이 나이까지 이 정도면\n이미 늦은 거 아닌가",
    after: "남들이랑 비교해서 늦어 보일 뿐,\n내 기준에서는 아직 진행 중일 수 있다",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className="px-6 py-20" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-base text-center mb-10" style={{ color: "var(--muted)" }}>
          같은 상황도 어떻게 바라보느냐에 따라 달라집니다
        </p>

        {/* 스텝 카드 */}
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-6 flex flex-col gap-4 rounded-2xl"
              style={{
                background: "#ffffff",
                boxShadow: "var(--shadow-card)",
                borderRadius: "var(--radius-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Before / After */}
              <div className="mt-auto flex flex-col gap-2">
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "#f5f5f3" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--muted)" }}>Before</p>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--text)" }}>
                    &ldquo;{step.before}&rdquo;
                  </p>
                </div>
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "var(--primary-light)" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "#92700a" }}>After</p>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: "#5a4200" }}>
                    &ldquo;{step.after}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
