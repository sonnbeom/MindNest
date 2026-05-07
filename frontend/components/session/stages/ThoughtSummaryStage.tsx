"use client";

import StreamingText from "@/components/session/StreamingText";

interface ThoughtSummaryStageProps {
  thoughts: string[];
  selectedIndex: number;
  isAnimating: boolean;
  onSelect: (index: number) => void;
}

export default function ThoughtSummaryStage({
  thoughts,
  selectedIndex,
  isAnimating,
  onSelect,
}: ThoughtSummaryStageProps) {
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
          작성하신 내용에서 핵심 생각을 정리했어요.
          가장 지금 마음에 걸리는 생각을 선택해주세요.
        </p>
      </div>

      <div className="space-y-3">
        {thoughts.map((thought, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="w-full text-left rounded-2xl p-5 transition-all duration-200"
            style={{
              background: selectedIndex === i ? "var(--primary-light)" : "#ffffff",
              border: selectedIndex === i
                ? "1.5px solid var(--primary-mid)"
                : "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                style={{
                  borderColor: selectedIndex === i ? "var(--primary)" : "var(--border)",
                  background: selectedIndex === i ? "var(--primary)" : "transparent",
                }}
              >
                {selectedIndex === i && (
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--text)" }} />
                )}
              </div>
              <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text)" }}>
                {isAnimating ? (
                  <StreamingText text={thought} speed={35} />
                ) : (
                  thought
                )}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
