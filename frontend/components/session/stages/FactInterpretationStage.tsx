interface FactInterpretationStageProps {
  fact: string;
  interpretation: string;
}

export default function FactInterpretationStage({
  fact,
  interpretation,
}: FactInterpretationStageProps) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          같은 상황도 <strong style={{ color: "var(--text)" }}>사실</strong>과{" "}
          <strong style={{ color: "var(--text)" }}>해석</strong>으로 나눌 수 있어요.
          사실은 누구나 동의할 수 있는 것, 해석은 내가 붙인 의미입니다.
        </p>
      </div>

      {/* 사실 카드 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "#f0fdfa",
          border: "1.5px solid #99f6e4",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "#0d9488" }}>
          사실 — 객관적으로 일어난 일
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#134e4a" }}>
          {fact}
        </p>
      </div>

      {/* 해석 카드 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--primary-light)",
          border: "1.5px solid var(--primary-mid)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "#92700a" }}>
          해석 — 내가 붙인 의미
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "#5a4200" }}>
          {interpretation}
        </p>
      </div>
    </div>
  );
}
