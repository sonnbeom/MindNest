import type { Stage } from "@/types/session";

const STAGE_META: Record<Stage, { number: number; label: string }> = {
  INTAKE:              { number: 1, label: "생각 입력" },
  THOUGHT_SUMMARY:     { number: 2, label: "생각 정리" },
  FACT_INTERPRETATION: { number: 3, label: "사실과 해석" },
  COUNTER_EVIDENCE:    { number: 4, label: "시야 넓히기" },
  CURRENT_ACTIONS:     { number: 5, label: "지금 나는" },
  REFRAME:             { number: 6, label: "다시 보기" },
};

const TOTAL = 6;

interface SessionHeaderProps {
  stage: Stage;
}

export default function SessionHeader({ stage }: SessionHeaderProps) {
  const meta = STAGE_META[stage];
  const progress = (meta.number / TOTAL) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted)" }}>
            {meta.number} / {TOTAL}단계
          </p>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
          >
            {meta.label}
          </h2>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full border font-medium"
          style={{ color: "var(--muted)", borderColor: "var(--border)", background: "#ffffff" }}
        >
          Mindnest
        </span>
      </div>

      <div
        className="h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "var(--primary)" }}
        />
      </div>

      {/* 면책 고지 — CLAUDE.md 필수 표시 */}
      <p className="mt-2 text-center text-[10px]" style={{ color: "var(--muted)" }}>
        본 앱은 전문 심리 치료를 대체하지 않습니다. 심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
      </p>
    </div>
  );
}
