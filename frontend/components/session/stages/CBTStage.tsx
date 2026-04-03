"use client";

// TODO: AI 응답은 lib/llm.ts의 generateCBTResponse()로 교체 예정.
// 현재는 mockLLMResponses.ts의 목업 데이터를 사용합니다.

import type { ChatMessage } from "@/types/session";
import { useEffect, useRef, useState } from "react";

const CBT_TURN_LABELS = [
  "자동적 사고 탐색",
  "증거 검토",
  "대안적 관점",
  "인지 재구성",
  "행동 계획",
];

interface CBTStageProps {
  chatHistory: ChatMessage[];
  cbtTurn: number;
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function CBTStage({
  chatHistory,
  cbtTurn,
  onSendMessage,
  isLoading,
}: CBTStageProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
  }

  const isComplete = cbtTurn >= 5;
  const currentTurnLabel = CBT_TURN_LABELS[Math.min(cbtTurn, 4)];

  return (
    <div className="flex flex-col gap-4">
      {/* 진행 상태 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500">
            CBT 대화 진행
          </p>
          <span className="text-xs text-gray-400">
            {Math.min(cbtTurn, 5)} / 5 턴
          </span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < cbtTurn
                  ? "bg-gradient-to-r from-pink-300 to-purple-400"
                  : "bg-gray-100 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
        {!isComplete && (
          <p className="text-xs text-gray-400 mt-2">
            현재: {currentTurnLabel}
          </p>
        )}
        {isComplete && (
          <p className="text-xs text-purple-500 mt-2 font-medium">
            ✓ 5턴 대화가 완료되었어요. 다음 단계로 이동할 수 있어요.
          </p>
        )}
      </div>

      {/* 채팅 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-4 min-h-[280px] max-h-[360px] overflow-y-auto flex flex-col gap-3">
        {chatHistory.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400 text-center">
              AI 상담사가 첫 번째 질문을 드릴 거예요.
              <br />
              편하게 답변해주세요.
            </p>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <span className="text-lg mr-2 flex-shrink-0 self-end">🤝</span>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-gray-800 dark:text-gray-200 rounded-br-sm"
                  : "bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <span className="text-lg mr-2 flex-shrink-0 self-end">🤝</span>
            <div className="bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      {!isComplete && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="답변을 입력하세요..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-purple-800 disabled:opacity-50 transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 transition-all duration-200"
            style={{
              background:
                "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)",
            }}
          >
            전송
          </button>
        </div>
      )}
    </div>
  );
}
