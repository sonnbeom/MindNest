"use client";

interface IntakeStageProps {
  text: string;
  isStreaming: boolean;
  onTextChange: (value: string) => void;
}

export default function IntakeStage({ text, isStreaming, onTextChange }: IntakeStageProps) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#ffffff",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <label
        htmlFor="intake-text"
        className="block text-sm font-semibold mb-1"
        style={{ color: "var(--text)" }}
      >
        지금 어떤 생각이 드나요?
      </label>
      <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
        머릿속에 맴도는 생각을 그대로 꺼내보세요. 판단하지 않아도 됩니다.
      </p>
      <div
        className="rounded-2xl px-5 py-4 transition-all duration-200"
        style={{ background: "var(--background)", border: "1.5px solid var(--border)" }}
      >
        <textarea
          id="intake-text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isStreaming}
          placeholder="예: 오늘 발표를 망쳤는데, 앞으로 아무도 나를 믿어주지 않을 것 같아요..."
          rows={6}
          className="w-full resize-none bg-transparent border-0 text-base leading-loose placeholder-gray-300 focus:outline-none disabled:opacity-60"
          style={{ color: "var(--text)" }}
        />
        <p className="text-right text-xs mt-1" style={{ color: "var(--border)" }}>
          {text.length}자
        </p>
      </div>
    </div>
  );
}
