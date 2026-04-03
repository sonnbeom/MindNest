"use client";

import type { SessionContext } from "@/types/session";

interface CloseStageProps {
  session: SessionContext;
  onCloseSUDChange: (value: number) => void;
}

const SUD_LABELS: Record<number, string> = {
  0: "완전히 평온해요",
  1: "거의 편안해요",
  2: "약간 불편해요",
  3: "조금 힘들어요",
  4: "힘든 편이에요",
  5: "많이 힘들어요",
  6: "꽤 힘들어요",
  7: "매우 힘들어요",
  8: "아주 많이 힘들어요",
  9: "거의 한계예요",
  10: "극도로 힘들어요",
};

export default function CloseStage({ session, onCloseSUDChange }: CloseStageProps) {
  const closeSUD = session.closeSUD ?? 5;
  const diff = session.intakeSUD - closeSUD;
  const improved = diff > 0;
  const same = diff === 0;

  return (
    <div className="space-y-5">
      {/* 오늘의 기록 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
          📋 오늘의 기록
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">처음 감정 강도</p>
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
              {session.intakeSUD}
            </p>
          </div>
          <div
            className="rounded-xl p-3 text-center border"
            style={{
              background: improved
                ? "linear-gradient(135deg, #fdf2f8, #f5f3ff)"
                : "rgba(255,255,255,0.3)",
              borderColor: improved ? "#e9d5ff" : "#f3f4f6",
            }}
          >
            <p className="text-xs text-gray-400 mb-1">지금 감정 강도</p>
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-200">
              {closeSUD}
            </p>
          </div>
        </div>

        {!same && (
          <div
            className={`rounded-xl p-3 text-center text-sm font-medium ${
              improved
                ? "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400"
                : "bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400"
            }`}
          >
            {improved
              ? `처음보다 ${diff}점 낮아졌어요 🌿`
              : `처음보다 ${Math.abs(diff)}점 높아졌어요. 괜찮아요, 이것도 과정이에요.`}
          </div>
        )}

        {session.distortions.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">
              오늘 발견한 인지 왜곡
            </p>
            <div className="flex flex-wrap gap-2">
              {session.distortions.map((d) => (
                <span
                  key={d.name}
                  className="text-xs px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-100 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-900/30"
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {session.reframeEntries.some((e) => e.trim().length > 0) && (
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-2">
              내가 발견한 긍정적 생각
            </p>
            <div className="space-y-1">
              {session.reframeEntries
                .filter((e) => e.trim().length > 0)
                .map((e, i) => (
                  <p key={i} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    · {e}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* 마무리 감정 강도 슬라이더 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          오늘을 돌아보며, 지금 이 순간 감정 강도는?
        </label>
        <p className="text-xs text-gray-400 mb-5">
          0 = 완전히 평온 &nbsp;/&nbsp; 10 = 극도로 힘듦
        </p>

        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-gray-800 dark:text-gray-100">
            {closeSUD}
          </span>
          <p className="text-sm text-gray-500 mt-1">{SUD_LABELS[closeSUD]}</p>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={closeSUD}
          onChange={(e) => onCloseSUDChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f9a8d4 0%, #c084fc ${closeSUD * 10}%, #e5e7eb ${closeSUD * 10}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
}
