"use client";

import SessionFooter from "@/components/session/SessionFooter";
import SessionHeader from "@/components/session/SessionHeader";
import CloseStage from "@/components/session/stages/CloseStage";
import DistortionStage from "@/components/session/stages/DistortionStage";
import EvidenceStage from "@/components/session/stages/EvidenceStage";
import IntakeStage from "@/components/session/stages/IntakeStage";
import ReframeStage from "@/components/session/stages/ReframeStage";
import { analyzeDistortions } from "@/lib/llm";
import { useSessionState } from "@/hooks/useSessionState";
import type { EvidenceEntry } from "@/types/session";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TherapySession() {
  const { session, dispatch } = useSessionState();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reframeSubmitted, setReframeSubmitted] = useState(false);

  // DISTORTION_ANALYSIS 진입 시 백엔드 LLM 분석 호출
  useEffect(() => {
    if (session.stage !== "DISTORTION_ANALYSIS" || session.distortions.length > 0) return;
    setIsLoading(true);
    setError(null);
    analyzeDistortions(session.sessionId, session.intakeSUD, session.intakeText)
      .then((result) => dispatch({ type: "SET_DISTORTIONS", payload: result }))
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [session.stage, session.distortions.length, dispatch, session.sessionId, session.intakeSUD, session.intakeText]);

  // REFRAME 진입 시 entries 초기화
  useEffect(() => {
    if (
      session.stage === "REFRAME" &&
      session.distortions.length > 0 &&
      session.reframeEntries.length === 0
    ) {
      dispatch({ type: "INIT_REFRAME_ENTRIES", payload: session.distortions.length });
    }
  }, [session.stage, session.distortions.length, session.reframeEntries.length, dispatch]);

  // CBT_DIALOGUE(증거 조사) 진입 시 entries 초기화
  useEffect(() => {
    if (
      session.stage === "CBT_DIALOGUE" &&
      session.distortions.length > 0 &&
      session.evidenceEntries.length === 0
    ) {
      dispatch({ type: "INIT_EVIDENCE_ENTRIES", payload: session.distortions.length });
    }
  }, [session.stage, session.distortions.length, session.evidenceEntries.length, dispatch]);

  function canAdvance(): boolean {
    switch (session.stage) {
      case "INTAKE":
        return session.intakeText.trim().length > 0;
      case "DISTORTION_ANALYSIS":
        return session.distortions.length > 0 && !isLoading;
      case "REFRAME":
        return session.reframeEntries.some((e) => e.trim().length > 0);
      case "CBT_DIALOGUE":
        return session.evidenceEntries.some((e) => e.alternativeThought.trim().length > 0);
      case "CLOSE":
        return true;
    }
  }

  function handleAdvance() {
    if (!canAdvance()) return;
    if (session.stage === "CLOSE") {
      setIsComplete(true);
      return;
    }
    if (session.stage === "REFRAME") {
      setReframeSubmitted(false);
    }
    dispatch({ type: "NEXT_STAGE" });
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #ffffff 0%, #FFEDD5 25%, #FFDAB9 50%, #FFB6C1 70%, #E0BBE4 85%, #F3E5F5 100%)",
          }}
        />
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🎉</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            오늘 수고하셨어요
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            자신의 마음을 들여다보는 것, 쉽지 않은 일이에요.
            <br />
            오늘 그 용기를 내주셔서 감사해요.
          </p>
          <div
            className="inline-block rounded-[14px] p-0.5"
            style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)" }}
          >
            <Link
              href="/"
              className="block rounded-xl px-8 py-2.5 text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #ffffff 0%, #FFEDD5 25%, #FFDAB9 50%, #FFB6C1 70%, #E0BBE4 85%, #F3E5F5 100%)",
        }}
      />

      <div className="max-w-xl mx-auto px-4 py-8">
        <SessionHeader stage={session.stage} />

        <div className="mb-4">
          {session.stage === "INTAKE" && (
            <IntakeStage
              sud={session.intakeSUD}
              text={session.intakeText}
              onSUDChange={(v) => dispatch({ type: "SET_INTAKE_SUD", payload: v })}
              onTextChange={(v) => dispatch({ type: "SET_INTAKE_TEXT", payload: v })}
            />
          )}

          {session.stage === "DISTORTION_ANALYSIS" && (
            <>
              {error && (
                <p className="text-sm text-red-500 text-center mb-4">{error}</p>
              )}
              <DistortionStage
                distortions={session.distortions}
                isLoading={isLoading}
              />
            </>
          )}

          {session.stage === "REFRAME" && (
            <ReframeStage
              distortions={session.distortions}
              reframeEntries={session.reframeEntries}
              onEntryChange={(index, value) =>
                dispatch({ type: "SET_REFRAME_ENTRY", payload: { index, value } })
              }
              submitted={reframeSubmitted}
              onSubmit={() => setReframeSubmitted(true)}
            />
          )}

          {session.stage === "CBT_DIALOGUE" && (
            <EvidenceStage
              distortions={session.distortions}
              evidenceEntries={session.evidenceEntries}
              onFieldChange={(index, field, value) =>
                dispatch({
                  type: "SET_EVIDENCE_FIELD",
                  payload: { index, field: field as keyof EvidenceEntry, value },
                })
              }
            />
          )}

          {session.stage === "CLOSE" && (
            <CloseStage
              session={session}
              onCloseSUDChange={(v) =>
                dispatch({ type: "SET_CLOSE_SUD", payload: v })
              }
            />
          )}
        </div>

        {!(session.stage === "REFRAME" && !reframeSubmitted) && (
          <SessionFooter
            stage={session.stage}
            canAdvance={canAdvance()}
            onAdvance={handleAdvance}
          />
        )}
      </div>
    </div>
  );
}
