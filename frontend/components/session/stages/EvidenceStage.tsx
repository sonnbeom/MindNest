"use client";

import type { Distortion, EvidenceEntry } from "@/types/session";

interface EvidenceStageProps {
  distortions: Distortion[];
  evidenceEntries: EvidenceEntry[];
  onFieldChange: (index: number, field: keyof EvidenceEntry, value: string) => void;
}

function EvidenceTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-xl bg-white dark:bg-white/5 shadow-sm focus-within:ring-2 focus-within:ring-purple-200 dark:focus-within:ring-purple-800 transition-all duration-200 px-4 py-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent border-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
      />
      <p className="text-right text-[10px] text-gray-300 dark:text-gray-600">
        {value.length}자
      </p>
    </div>
  );
}

export default function EvidenceStage({
  distortions,
  evidenceEntries,
  onFieldChange,
}: EvidenceStageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          우리의 뇌는 부정적인 면에 더 오래 머물도록 설계되어 있어요.
          인지 왜곡은 그 과정에서 조용히 생각을 비틀곤 합니다.
          <br />
          <br />
          하지만 <strong className="text-gray-700 dark:text-gray-300">생각을 바꾸면, 감정도 달라질 수 있어요.</strong>
          <br />
          두 가지 시각의 증거를 직접 모아보고, 더 균형 잡힌 생각을 찾아봅시다.
        </p>
      </div>

      {distortions.map((distortion, i) => {
        const entry = evidenceEntries[i] ?? { forEvidence: "", againstEvidence: "", alternativeThought: "" };
        return (
          <div
            key={i}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-purple-100 dark:border-purple-900/30 rounded-2xl overflow-hidden"
          >
            {/* 자동적 사고 헤더 */}
            <div className="px-5 py-4 border-b border-purple-100 dark:border-purple-900/20"
              style={{ background: "linear-gradient(135deg, #fff7ed, #fdf2f8)" }}
            >
              <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300 mb-2">
                {distortion.name}
              </span>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                &ldquo;{distortion.quote}&rdquo;
              </p>
            </div>

            {/* 증거 표 */}
            <div className="grid grid-cols-2 border-b border-purple-100 dark:border-purple-900/20">
              {/* 참이라는 증거 */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-red-400 dark:text-red-300">
                  ✗ 참이라는 증거
                </p>
                <EvidenceTextarea
                  value={entry.forEvidence}
                  onChange={(v) => onFieldChange(i, "forEvidence", v)}
                  placeholder="이 생각이 사실일 수도 있다는 근거를 적어보세요."
                />
              </div>

              {/* 거짓이라는 증거 */}
              <div className="p-4 space-y-2 border-l border-purple-100 dark:border-purple-900/20">
                <p className="text-xs font-semibold text-green-500 dark:text-green-400">
                  ✓ 거짓이라는 증거
                </p>
                <EvidenceTextarea
                  value={entry.againstEvidence}
                  onChange={(v) => onFieldChange(i, "againstEvidence", v)}
                  placeholder="이 생각이 사실이 아닐 수 있다는 근거를 적어보세요."
                />
              </div>
            </div>

            {/* 대안적 사고 */}
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-purple-500 dark:text-purple-400">
                💡 균형잡힌 생각은 무엇일까요?
              </p>
              <div className="rounded-xl bg-white dark:bg-white/5 shadow-sm focus-within:ring-2 focus-within:ring-purple-300 dark:focus-within:ring-purple-700 transition-all duration-200 px-4 py-3">
                <textarea
                  value={entry.alternativeThought}
                  onChange={(e) => onFieldChange(i, "alternativeThought", e.target.value)}
                  rows={2}
                  placeholder="예: 나는 이번에 어려움을 겪고 있지만, 완전한 실패는 아니다."
                  className="w-full resize-none bg-transparent border-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
                />
                <p className="text-right text-[10px] text-gray-300 dark:text-gray-600">
                  {entry.alternativeThought.length}자
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
