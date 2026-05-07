export type Stage =
  | "INTAKE"
  | "THOUGHT_SUMMARY"
  | "FACT_INTERPRETATION"
  | "COUNTER_EVIDENCE"
  | "CURRENT_ACTIONS"
  | "REFRAME";

export interface Llm1Result {
  thoughts: string[];
  fact: string;
  interpretation: string;
  counter_hints: string[];
  current_actions: string[];
}

export interface SessionContext {
  sessionId: string;
  stage: Stage;
  userInput: string;
  llm1Result: Llm1Result | null;
  selectedThoughtIndex: number;
  selectedCounters: string[];
  customCounter: string;
  selectedActions: string[];
  customAction: string;
  reframedText: string;
  isStreaming: boolean;
  createdAt: string;
}

export type SessionAction =
  | { type: "SET_USER_INPUT"; payload: string }
  | { type: "SET_LLM1_RESULT"; payload: Llm1Result }
  | { type: "SET_SELECTED_THOUGHT"; payload: number }
  | { type: "TOGGLE_COUNTER"; payload: string }
  | { type: "SET_CUSTOM_COUNTER"; payload: string }
  | { type: "TOGGLE_ACTION"; payload: string }
  | { type: "SET_CUSTOM_ACTION"; payload: string }
  | { type: "SET_REFRAMED_TEXT"; payload: string }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "NEXT_STAGE" }
  | { type: "RESET" };
