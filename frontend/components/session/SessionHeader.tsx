import type { Stage } from "@/types/session";

const STAGE_META: Record<Stage, { number: number; label: string; emoji: string }> = {
  INTAKE: { number: 1, label: "감정 지수", emoji: "🌱" },
  DISTORTION_ANALYSIS: { number: 2, label: "인지 왜곡 분석", emoji: "🔍" },
  REFRAME: { number: 3, label: "긍정적 재구성", emoji: "💡" },
  CBT_DIALOGUE: { number: 4, label: "생각 균형 잡기", emoji: "⚖️" },
  CLOSE: { number: 5, label: "오늘의 마무리", emoji: "🌿" },
};

const TOTAL = 5;

interface SessionHeaderProps {
  stage: Stage;
}

export default function SessionHeader({ stage }: SessionHeaderProps) {
  const meta = STAGE_META[stage];
  const progress = (meta.number / TOTAL) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              {meta.number} / {TOTAL}단계
            </p>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {meta.label}
            </h2>
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
          MindNest
        </span>
      </div>

      {/* 진행 바 */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #f9a8d4, #c084fc, #a78bfa)",
          }}
        />
      </div>

      {/* 면책 고지 — CLAUDE.md 필수 표시 */}
      <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-600">
        본 앱은 전문 심리 치료를 대체하지 않습니다. 심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
      </p>
    </div>
  );
}
