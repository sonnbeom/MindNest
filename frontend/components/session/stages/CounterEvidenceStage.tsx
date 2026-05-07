"use client";

interface CounterEvidenceStageProps {
  counterHints: string[];
  selectedCounters: string[];
  customCounter: string;
  onToggle: (hint: string) => void;
  onCustomChange: (value: string) => void;
}

export default function CounterEvidenceStage({
  counterHints,
  selectedCounters,
  customCounter,
  onToggle,
  onCustomChange,
}: CounterEvidenceStageProps) {
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
          지금 그 생각과 다르게 볼 수 있는 근거들이에요.
          해당하는 것을 골라주세요.
        </p>
      </div>

      <div className="space-y-2">
        {counterHints.map((hint) => {
          const checked = selectedCounters.includes(hint);
          return (
            <button
              key={hint}
              onClick={() => onToggle(hint)}
              className="w-full text-left rounded-2xl px-5 py-4 transition-all duration-200 flex items-center gap-3"
              style={{
                background: checked ? "var(--primary-light)" : "#ffffff",
                border: checked ? "1.5px solid var(--primary-mid)" : "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2"
                style={{
                  borderColor: checked ? "var(--primary)" : "var(--border)",
                  background: checked ? "var(--primary)" : "transparent",
                }}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: "var(--text)" }}>{hint}</span>
            </button>
          );
        })}

        {/* 직접 입력 */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
            직접 입력 (선택 사항)
          </p>
          <input
            type="text"
            value={customCounter}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="다른 근거가 있다면 직접 적어주세요"
            className="w-full bg-transparent border-0 text-sm placeholder-gray-300 focus:outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
    </div>
  );
}
