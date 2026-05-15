"use client";

interface ReframeStageProps {
  reframedText: string;
  isStreaming: boolean;
  onTextChange: (value: string) => void;
}

export default function ReframeStage({
  reframedText,
  isStreaming,
  onTextChange,
}: ReframeStageProps) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--primary-light)",
          border: "1px solid var(--primary-mid)",
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "#5a4200" }}>
          선택하신 내용을 바탕으로 균형 잡힌 생각을 정리했어요.
          <br />
          마음에 들지 않으면 직접 수정해도 됩니다.
        </p>
      </div>

      <div
        className="rounded-2xl p-5 min-h-[120px]"
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {isStreaming ? (
          <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
            {reframedText}
            <span className="animate-pulse" style={{ color: "var(--primary)" }}>|</span>
          </p>
        ) : (
          <textarea
            value={reframedText}
            onChange={(e) => onTextChange(e.target.value)}
            rows={5}
            className="w-full resize-none bg-transparent border-0 text-base leading-relaxed placeholder-gray-300 focus:outline-none"
            style={{ color: "var(--text)" }}
            placeholder="재구성 문장이 여기에 표시됩니다..."
          />
        )}
      </div>
    </div>
  );
}
