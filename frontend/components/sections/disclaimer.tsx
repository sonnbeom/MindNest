export default function CtaFooterSection() {
  return (
    <footer className="px-6 pt-6 pb-10" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto">

        {/* 면책 고지 — CLAUDE.md 필수 표시 항목 */}
        <div
          className="rounded-2xl p-5 mb-8 flex gap-3 border"
          style={{
            background: "#fffbeb",
            borderColor: "#fde68a",
            borderRadius: "var(--radius-card)",
          }}
        >
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-sm leading-relaxed" style={{ color: "#92400e" }}>
            <strong>면책 고지:</strong> 본 앱은 전문 심리 치료를 대체하지 않습니다.
            심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
          </p>
        </div>

        {/* 푸터 */}
        <div
          className="flex items-center justify-center pt-6 border-t text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--text)" }}>
            <span>🧠</span>
            <span style={{ fontFamily: "var(--font-serif, serif)" }}>Mindnest</span>
            <span className="font-normal" style={{ color: "var(--muted)" }}>· CBT 기반 셀프 심리 상담</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
