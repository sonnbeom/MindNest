"use client";

import SessionFooter from "@/components/session/SessionFooter";
import SessionHeader from "@/components/session/SessionHeader";
import CounterEvidenceStage from "@/components/session/stages/CounterEvidenceStage";
import CurrentActionsStage from "@/components/session/stages/CurrentActionsStage";
import FactInterpretationStage from "@/components/session/stages/FactInterpretationStage";
import IntakeStage from "@/components/session/stages/IntakeStage";
import ReframeStage from "@/components/session/stages/ReframeStage";
import ThoughtSummaryStage from "@/components/session/stages/ThoughtSummaryStage";
import { analyzeIntake, generateReframe } from "@/lib/llm";
import { useSessionState } from "@/hooks/useSessionState";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TherapySession() {
  const { session, dispatch } = useSessionState();
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isThoughtAnimating, setIsThoughtAnimating] = useState(false);

  // LLM 2 스트리밍 텍스트 — 리듀서 외부에서 ref + state로 관리
  const llm2PromiseRef = useRef<Promise<string> | null>(null);
  const [reframeStreamText, setReframeStreamText] = useState("");
  const [reframeStreamDone, setReframeStreamDone] = useState(false);

  // REFRAME 진입 시 LLM 2 결과 대기 및 표시
  useEffect(() => {
    if (session.stage !== "REFRAME" || !llm2PromiseRef.current) return;
    dispatch({ type: "SET_STREAMING", payload: true });
    llm2PromiseRef.current
      .then((text) => {
        dispatch({ type: "SET_REFRAMED_TEXT", payload: text });
        setReframeStreamDone(true);
        dispatch({ type: "SET_STREAMING", payload: false });
      })
      .catch((e: Error) => {
        setError(e.message);
        dispatch({ type: "SET_STREAMING", payload: false });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.stage]);

  function canAdvance(): boolean {
    switch (session.stage) {
      case "INTAKE":
        return session.userInput.trim().length > 0 && !session.isStreaming;
      case "THOUGHT_SUMMARY":
        return session.llm1Result !== null && !isThoughtAnimating;
      case "FACT_INTERPRETATION":
        return true;
      case "COUNTER_EVIDENCE":
        return session.selectedCounters.length > 0 || session.customCounter.trim().length > 0;
      case "CURRENT_ACTIONS":
        return session.selectedActions.length > 0 || session.customAction.trim().length > 0;
      case "REFRAME":
        return reframeStreamDone && session.reframedText.trim().length > 0;
    }
  }

  async function handleIntakeSubmit() {
    dispatch({ type: "SET_STREAMING", payload: true });
    setError(null);
    try {
      const result = await analyzeIntake(session.userInput, () => {});
      dispatch({ type: "SET_LLM1_RESULT", payload: result });

      // counter_hints: 처음 2개 자동 체크
      result.counter_hints
        .slice(0, Math.min(2, result.counter_hints.length))
        .forEach((hint) => dispatch({ type: "TOGGLE_COUNTER", payload: hint }));

      // current_actions: 전체 자동 체크
      result.current_actions.forEach((action) =>
        dispatch({ type: "TOGGLE_ACTION", payload: action })
      );

      dispatch({ type: "SET_STREAMING", payload: false });
      setIsThoughtAnimating(true);
      dispatch({ type: "NEXT_STAGE" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다");
      dispatch({ type: "SET_STREAMING", payload: false });
    }
  }

  function handleCounterEvidenceNext() {
    const llm1Result = session.llm1Result!;
    const allCounters = [
      ...session.selectedCounters,
      ...(session.customCounter.trim() ? [session.customCounter.trim()] : []),
    ];
    const allActions = [
      ...session.selectedActions,
      ...(session.customAction.trim() ? [session.customAction.trim()] : []),
    ];
    const selectedThought = llm1Result.thoughts[session.selectedThoughtIndex];

    setReframeStreamText("");
    setReframeStreamDone(false);
    llm2PromiseRef.current = generateReframe(
      llm1Result.fact,
      selectedThought,
      allCounters,
      allActions,
      (chunk) => setReframeStreamText(chunk)
    );

    dispatch({ type: "NEXT_STAGE" });
  }

  function handleAdvance() {
    if (!canAdvance()) return;

    if (session.stage === "INTAKE") {
      handleIntakeSubmit();
      return;
    }
    if (session.stage === "COUNTER_EVIDENCE") {
      handleCounterEvidenceNext();
      return;
    }
    if (session.stage === "REFRAME") {
      setIsComplete(true);
      return;
    }
    dispatch({ type: "NEXT_STAGE" });
  }

  if (isComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: "var(--primary-light)" }}
          >
            🌿
          </div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--text)", fontFamily: "var(--font-serif, serif)" }}
          >
            오늘 수고하셨어요
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--muted)" }}>
            자신의 마음을 들여다보는 것, 쉽지 않은 일이에요.
            <br />
            오늘 그 용기를 내주셔서 감사해요.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold transition-all hover:scale-105"
            style={{
              background: "var(--primary)",
              color: "var(--text)",
              borderRadius: "var(--radius-button)",
              boxShadow: "0 4px 20px rgba(245, 200, 0, 0.4)",
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-xl mx-auto px-4 py-8">
        <SessionHeader stage={session.stage} />

        {error && (
          <p className="text-sm text-red-500 text-center mb-4 rounded-xl p-3"
            style={{ background: "#fff5f5", border: "1px solid #fed7d7" }}>
            {error}
          </p>
        )}

        <div className="mb-4">
          {session.stage === "INTAKE" && (
            <IntakeStage
              text={session.userInput}
              isStreaming={session.isStreaming}
              onTextChange={(v) => dispatch({ type: "SET_USER_INPUT", payload: v })}
            />
          )}

          {session.stage === "THOUGHT_SUMMARY" && session.llm1Result && (
            <ThoughtSummaryStage
              thoughts={session.llm1Result.thoughts}
              selectedIndex={session.selectedThoughtIndex}
              isAnimating={isThoughtAnimating}
              onSelect={(i) => dispatch({ type: "SET_SELECTED_THOUGHT", payload: i })}
            />
          )}

          {session.stage === "FACT_INTERPRETATION" && session.llm1Result && (
            <FactInterpretationStage
              fact={session.llm1Result.fact}
              interpretation={session.llm1Result.interpretation}
            />
          )}

          {session.stage === "COUNTER_EVIDENCE" && session.llm1Result && (
            <CounterEvidenceStage
              counterHints={session.llm1Result.counter_hints}
              selectedCounters={session.selectedCounters}
              customCounter={session.customCounter}
              onToggle={(hint) => dispatch({ type: "TOGGLE_COUNTER", payload: hint })}
              onCustomChange={(v) => dispatch({ type: "SET_CUSTOM_COUNTER", payload: v })}
            />
          )}

          {session.stage === "CURRENT_ACTIONS" && session.llm1Result && (
            <CurrentActionsStage
              currentActions={session.llm1Result.current_actions}
              selectedActions={session.selectedActions}
              customAction={session.customAction}
              onToggle={(action) => dispatch({ type: "TOGGLE_ACTION", payload: action })}
              onCustomChange={(v) => dispatch({ type: "SET_CUSTOM_ACTION", payload: v })}
            />
          )}

          {session.stage === "REFRAME" && (
            <ReframeStage
              reframedText={reframeStreamDone ? session.reframedText : reframeStreamText}
              isStreaming={!reframeStreamDone}
              onTextChange={(v) => dispatch({ type: "SET_REFRAMED_TEXT", payload: v })}
            />
          )}
        </div>

        <SessionFooter
          stage={session.stage}
          canAdvance={canAdvance()}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}
