"use client";

import type { SessionAction, SessionContext, Stage } from "@/types/session";
import { useReducer } from "react";

const STAGE_ORDER: Stage[] = [
  "INTAKE",
  "DISTORTION_ANALYSIS",
  "REFRAME",
  "CBT_DIALOGUE",
  "CLOSE",
];

function createInitialSession(): SessionContext {
  return {
    sessionId: crypto.randomUUID(),
    stage: "INTAKE",
    intakeSUD: 5,
    closeSUD: null,
    intakeText: "",
    distortions: [],
    positives: [],
    selectedPositives: [],
    reframeEntries: [],
    evidenceEntries: [],
    chatHistory: [],
    cbtTurn: 0,
    createdAt: new Date().toISOString(),
  };
}

function sessionReducer(
  state: SessionContext,
  action: SessionAction
): SessionContext {
  switch (action.type) {
    case "SET_INTAKE_SUD":
      return { ...state, intakeSUD: action.payload };

    case "SET_INTAKE_TEXT":
      return { ...state, intakeText: action.payload };

    case "SET_DISTORTIONS":
      return {
        ...state,
        distortions: action.payload.distortions,
        positives: action.payload.positives,
      };

    case "SET_SELECTED_POSITIVES":
      return { ...state, selectedPositives: action.payload };

    case "INIT_REFRAME_ENTRIES": {
      const entries = Array(action.payload).fill("");
      return { ...state, reframeEntries: entries };
    }

    case "SET_REFRAME_ENTRY": {
      const updated = [...state.reframeEntries];
      updated[action.payload.index] = action.payload.value;
      return { ...state, reframeEntries: updated };
    }

    case "INIT_EVIDENCE_ENTRIES": {
      const entries = Array(action.payload).fill(null).map(() => ({
        forEvidence: "",
        againstEvidence: "",
        alternativeThought: "",
      }));
      return { ...state, evidenceEntries: entries };
    }

    case "SET_EVIDENCE_FIELD": {
      const updated = [...state.evidenceEntries];
      updated[action.payload.index] = {
        ...updated[action.payload.index],
        [action.payload.field]: action.payload.value,
      };
      return { ...state, evidenceEntries: updated };
    }

    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };

    case "ADVANCE_CBT_TURN":
      return { ...state, cbtTurn: state.cbtTurn + 1 };

    case "SET_CLOSE_SUD":
      return { ...state, closeSUD: action.payload };

    case "NEXT_STAGE": {
      const currentIndex = STAGE_ORDER.indexOf(state.stage);
      if (currentIndex === STAGE_ORDER.length - 1) return state;
      return { ...state, stage: STAGE_ORDER[currentIndex + 1] };
    }

    case "RESET":
      return createInitialSession();

    default:
      return state;
  }
}

export function useSessionState() {
  const [session, dispatch] = useReducer(sessionReducer, undefined, createInitialSession);
  return { session, dispatch };
}
