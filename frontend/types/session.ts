export type Stage =
  | "INTAKE"
  | "DISTORTION_ANALYSIS"
  | "REFRAME"
  | "CBT_DIALOGUE"
  | "CLOSE";

export interface Distortion {
  name: string;
  quote: string;
  explanation: string;
}

export interface Positive {
  value: string;
  explanation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface EvidenceEntry {
  forEvidence: string;
  againstEvidence: string;
  alternativeThought: string;
}

export interface SessionContext {
  sessionId: string;
  stage: Stage;
  intakeSUD: number;
  closeSUD: number | null;
  intakeText: string;
  distortions: Distortion[];
  positives: Positive[];
  selectedPositives: string[];
  reframeEntries: string[];
  evidenceEntries: EvidenceEntry[];
  chatHistory: ChatMessage[];
  cbtTurn: number;
  createdAt: string;
}

export type SessionAction =
  | { type: "SET_INTAKE_SUD"; payload: number }
  | { type: "SET_INTAKE_TEXT"; payload: string }
  | { type: "SET_DISTORTIONS"; payload: { distortions: Distortion[]; positives: Positive[] } }
  | { type: "SET_SELECTED_POSITIVES"; payload: string[] }
  | { type: "SET_REFRAME_ENTRY"; payload: { index: number; value: string } }
  | { type: "INIT_REFRAME_ENTRIES"; payload: number }
  | { type: "INIT_EVIDENCE_ENTRIES"; payload: number }
  | { type: "SET_EVIDENCE_FIELD"; payload: { index: number; field: keyof EvidenceEntry; value: string } }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "ADVANCE_CBT_TURN" }
  | { type: "SET_CLOSE_SUD"; payload: number }
  | { type: "NEXT_STAGE" }
  | { type: "RESET" };
