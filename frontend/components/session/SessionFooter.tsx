import type { Stage } from "@/types/session";

interface SessionFooterProps {
  stage: Stage;
  canAdvance: boolean;
  onAdvance: () => void;
}

const BUTTON_LABELS: Record<Stage, string> = {
  INTAKE:              "생각 꺼내보기",
  THOUGHT_SUMMARY:     "다음",
  FACT_INTERPRETATION: "다음",
  COUNTER_EVIDENCE:    "다음",
  CURRENT_ACTIONS:     "다음",
  REFRAME:             "저장하기",
};

const HINT_MESSAGES: Partial<Record<Stage, string>> = {
  INTAKE:          "생각을 조금 더 적어주세요.",
  COUNTER_EVIDENCE: "하나 이상 선택하거나 직접 입력해주세요.",
  CURRENT_ACTIONS:  "하나 이상 선택하거나 직접 입력해주세요.",
  REFRAME:          "재구성이 완료되면 저장할 수 있어요.",
};

export default function SessionFooter({ stage, canAdvance, onAdvance }: SessionFooterProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <button
        onClick={onAdvance}
        disabled={!canAdvance}
        className="w-full py-3 text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          background: canAdvance ? "var(--primary)" : "var(--border)",
          color: "var(--text)",
          borderRadius: "var(--radius-button)",
          boxShadow: canAdvance ? "0 4px 16px rgba(245, 200, 0, 0.35)" : "none",
        }}
      >
        {BUTTON_LABELS[stage]}
      </button>

      {!canAdvance && HINT_MESSAGES[stage] && (
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {HINT_MESSAGES[stage]}
        </p>
      )}
    </div>
  );
}
