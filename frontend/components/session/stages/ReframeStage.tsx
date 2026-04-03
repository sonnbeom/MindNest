"use client";

import { reframeExamples } from "@/data/reframeExamples";
import type { Distortion } from "@/types/session";
import { useState } from "react";

interface ReframeStageProps {
  distortions: Distortion[];
  reframeEntries: string[];
  onEntryChange: (index: number, value: string) => void;
}

export default function ReframeStage({
  distortions,
  reframeEntries,
  onEntryChange,
}: ReframeStageProps) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="space-y-5">
      {/* ① 납득 멘트 */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, #fff7ed 0%, #fce7f3 50%, #f5f3ff 100%)",
          border: "1px solid #f9a8d4",
        }}
      >
        <p className="text-sm text-gray-700 leading-relaxed">
          모든 감정은 사실이지만, 그 감정에서 비롯된{" "}
          <strong>생각은 사실이 아닐 수 있습니다.</strong>
          <br />
          <br />
          부정적 감정의 이면에는{" "}
          <strong>긍정적인 가치관과 생각이 존재합니다.</strong>
        </p>
      </div>

      {/* ② 긍정적 재구성 표 */}
      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-purple-100 dark:border-purple-900/30 rounded-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="grid grid-cols-[2fr_3fr] border-b border-purple-100 dark:border-purple-900/30">
          <div className="px-4 py-3 bg-pink-50/80 dark:bg-pink-900/10">
            <p className="text-xs font-semibold text-pink-500 dark:text-pink-400">
              부정적 생각
            </p>
          </div>
          <div className="px-4 py-3 bg-purple-50/80 dark:bg-purple-900/10 border-l border-purple-100 dark:border-purple-900/30">
            <p className="text-xs font-semibold text-purple-500 dark:text-purple-400">
              장점과 핵심 가치관
            </p>
          </div>
        </div>

        {/* 행 */}
        {distortions.map((distortion, i) => (
          <div
            key={i}
            className={`grid grid-cols-[2fr_3fr] ${
              i < distortions.length - 1
                ? "border-b border-purple-100 dark:border-purple-900/20"
                : ""
            }`}
          >
            {/* 왼쪽 — 부정적 생각 (자동 채움) */}
            <div className="px-4 py-4 bg-white/40 dark:bg-white/[0.02] space-y-2">
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-300">
                {distortion.name}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                &ldquo;{distortion.quote}&rdquo;
              </p>
            </div>

            {/* 오른쪽 — 사용자 입력 */}
            <div className="border-l border-purple-100 dark:border-purple-900/30">
              <div className="h-full rounded-none bg-white dark:bg-white/5 shadow-none focus-within:bg-purple-50/30 dark:focus-within:bg-purple-900/10 transition-colors duration-200 px-4 py-3">
                <textarea
                  value={reframeEntries[i] ?? ""}
                  onChange={(e) => onEntryChange(i, e.target.value)}
                  rows={3}
                  className="w-full resize-none bg-transparent border-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
                  placeholder="이 상황에서 발견할 수 있는 긍정적인 가치관이나 장점을 적어보세요."
                />
                <p className="text-right text-[10px] text-gray-300 dark:text-gray-600">
                  {(reframeEntries[i] ?? "").length}자
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ③ 예시 토글 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-5 space-y-3">
        <button
          onClick={() => setShowExamples((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-purple-500 dark:text-purple-400 font-medium hover:text-purple-600 transition-colors"
        >
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: showExamples ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          {showExamples ? "예시 닫기" : "다른 사람들의 예시 보기"}
        </button>

        {showExamples && (
          <div className="space-y-3 pt-1">
            {reframeExamples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-purple-100 dark:border-purple-900/20 bg-purple-50/50 dark:bg-purple-900/10 p-4 space-y-2"
              >
                <p className="text-xs font-semibold text-purple-500 dark:text-purple-400">
                  상황 {i + 1}: {ex.situation}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  &ldquo;{ex.negativeThought}&rdquo;
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  → {ex.positiveReframe}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
