"use client";

interface CurrentActionsStageProps {
  currentActions: string[];
  selectedActions: string[];
  customAction: string;
  onToggle: (action: string) => void;
  onCustomChange: (value: string) => void;
}

export default function CurrentActionsStage({
  currentActions,
  selectedActions,
  customAction,
  onToggle,
  onCustomChange,
}: CurrentActionsStageProps) {
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
          지금 이 순간에도 하고 있는 것들이 있어요.
          해당하는 것을 확인해주세요.
        </p>
      </div>

      <div className="space-y-2">
        {currentActions.map((action) => {
          const checked = selectedActions.includes(action);
          return (
            <button
              key={action}
              onClick={() => onToggle(action)}
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
              <span className="text-sm" style={{ color: "var(--text)" }}>{action}</span>
            </button>
          );
        })}

        {/* 기타 입력 */}
        <div
          className="rounded-2xl px-5 py-4"
          style={{
            background: "#ffffff",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
            기타 입력 (선택 사항)
          </p>
          <input
            type="text"
            value={customAction}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="다른 행동이 있다면 직접 적어주세요"
            className="w-full bg-transparent border-0 text-sm placeholder-gray-300 focus:outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
    </div>
  );
}
