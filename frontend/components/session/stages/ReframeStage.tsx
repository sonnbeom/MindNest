"use client";

import { reframeExamples } from "@/data/reframeExamples";
import type { Distortion } from "@/types/session";

interface ReframeStageProps {
  distortions: Distortion[];
  reframeEntries: string[];
  onEntryChange: (index: number, value: string) => void;
  submitted: boolean;
  onSubmit: () => void;
}

export default function ReframeStage({
  distortions,
  reframeEntries,
  onEntryChange,
  submitted,
  onSubmit,
}: ReframeStageProps) {
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
              장점과 나의 가치관
            </p>
          </div>
        </div>

        {/* 행 */}
        {distortions.map((distortion, i) => {
          const example = reframeExamples.find((e) => e.distortionType === distortion.name);
          return (
            <div
              key={i}
              className={`grid grid-cols-[2fr_3fr] ${
                i < distortions.length - 1
                  ? "border-b border-purple-100 dark:border-purple-900/20"
                  : ""
              }`}
            >
              {/* 왼쪽 — 부정적 생각 */}
              <div className="px-4 py-4 bg-white/40 dark:bg-white/[0.02] space-y-2">
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-300">
                  {distortion.name}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                  &ldquo;{distortion.quote}&rdquo;
                </p>
                {distortion.explanation && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-500 leading-relaxed">
                    {distortion.explanation}
                  </p>
                )}
              </div>

              {/* 오른쪽 — 예시 + 입력 (or 결과 + 힌트) */}
              <div className="border-l border-purple-100 dark:border-purple-900/30 flex flex-col">
                {/* 예시 블록 */}
                {example && (
                  <div className="px-4 pt-3 pb-2.5 border-b border-dashed border-purple-100 dark:border-purple-900/20 bg-purple-50/30 dark:bg-purple-900/5">
                    <p className="text-[10px] font-semibold text-purple-400 dark:text-purple-500 mb-1">
                      예시
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed mb-1">
                      &ldquo;{example.negativeThought}&rdquo;
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                      → {example.positiveReframe}
                    </p>
                  </div>
                )}

                {/* 입력 영역 (제출 전) */}
                {!submitted && (
                  <div className="flex-1 bg-white dark:bg-white/5 focus-within:bg-purple-50/30 dark:focus-within:bg-purple-900/10 transition-colors duration-200 px-4 py-3">
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
                )}

                {/* 제출 후 — 작성 내용 + LLM 힌트 */}
                {submitted && (
                  <div className="flex-1 px-4 py-3 space-y-3">
                    {reframeEntries[i]?.trim() ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {reframeEntries[i]}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-300 dark:text-gray-600 italic">
                        작성 내용 없음
                      </p>
                    )}
                    {distortion.reframeSuggestion && (
                      <div
                        className="rounded-xl px-3 py-2.5 border border-purple-100 dark:border-purple-900/30"
                        style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #fce7f3 100%)" }}
                      >
                        <p className="text-[10px] font-semibold text-purple-400 mb-1">
                          💡 다른 시각
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          {distortion.reframeSuggestion}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ③ 제출 버튼 */}
      {!submitted && (
        <button
          onClick={onSubmit}
          disabled={reframeEntries.every((e) => !e.trim())}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc)" }}
        >
          긍정적 재구성 확인하기
        </button>
      )}
    </div>
  );
}
