"use client";

import { useReducer } from "react";
import type { SessionContext, SessionAction, Stage } from "@/types/session";

const STAGE_ORDER: Stage[] = [
  "INTAKE",
  "THOUGHT_SUMMARY",
  "FACT_INTERPRETATION",
  "COUNTER_EVIDENCE",
  "CURRENT_ACTIONS",
  "REFRAME",
];

function createInitialSession(): SessionContext {
  return {
    sessionId: crypto.randomUUID(),
    stage: "INTAKE",
    userInput: "",
    llm1Result: null,
    selectedThoughtIndex: 0,
    selectedCounters: [],
    customCounter: "",
    selectedActions: [],
    customAction: "",
    reframedText: "",
    isStreaming: false,
    createdAt: new Date().toISOString(),
  };
}

function sessionReducer(state: SessionContext, action: SessionAction): SessionContext {
  switch (action.type) {
    case "SET_USER_INPUT":
      return { ...state, userInput: action.payload };

    case "SET_LLM1_RESULT":
      return { ...state, llm1Result: action.payload };

    case "SET_SELECTED_THOUGHT":
      return { ...state, selectedThoughtIndex: action.payload };

    case "TOGGLE_COUNTER": {
      const exists = state.selectedCounters.includes(action.payload);
      return {
        ...state,
        selectedCounters: exists
          ? state.selectedCounters.filter((c) => c !== action.payload)
          : [...state.selectedCounters, action.payload],
      };
    }

    case "SET_CUSTOM_COUNTER":
      return { ...state, customCounter: action.payload };

    case "TOGGLE_ACTION": {
      const exists = state.selectedActions.includes(action.payload);
      return {
        ...state,
        selectedActions: exists
          ? state.selectedActions.filter((a) => a !== action.payload)
          : [...state.selectedActions, action.payload],
      };
    }

    case "SET_CUSTOM_ACTION":
      return { ...state, customAction: action.payload };

    case "SET_REFRAMED_TEXT":
      return { ...state, reframedText: action.payload };

    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };

    case "NEXT_STAGE": {
      const currentIndex = STAGE_ORDER.indexOf(state.stage);
      const nextStage = STAGE_ORDER[currentIndex + 1];
      if (!nextStage) return state;
      return { ...state, stage: nextStage };
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
