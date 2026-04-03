import type { Stage } from "@/types/session";

interface SessionFooterProps {
  stage: Stage;
  canAdvance: boolean;
  onAdvance: () => void;
}

const BUTTON_LABELS: Record<Stage, string> = {
  INTAKE: "다음으로",
  DISTORTION_ANALYSIS: "인지왜곡 재구성하기",
  REFRAME: "다음으로",
  CBT_DIALOGUE: "다음으로",
  CLOSE: "오늘 기록 마치기",
};

export default function SessionFooter({
  stage,
  canAdvance,
  onAdvance,
}: SessionFooterProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div
        className={`w-full rounded-[14px] p-0.5 transition-opacity duration-200 ${canAdvance ? "opacity-100" : "opacity-40"}`}
        style={{
          background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)",
        }}
      >
        <button
          onClick={onAdvance}
          disabled={!canAdvance}
          className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {BUTTON_LABELS[stage]}
        </button>
      </div>

      {!canAdvance && (
        <p className="text-xs text-gray-400">
          {stage === "INTAKE" && "이야기를 조금 더 적어주세요."}
          {stage === "REFRAME" && "긍정적인 생각을 하나 이상 적어주세요."}
          {stage === "CBT_DIALOGUE" && "균형 잡힌 생각을 하나 이상 적어주세요."}
        </p>
      )}
    </div>
  );
}
