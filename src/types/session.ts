export type CallType = "cold-call" | "consulting" | "follow-up";

export interface CustomerContext {
  name: string;
  company: string;
  industry: string;
  callType: CallType;
  product: string;
  notes: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: "user" | "customer";
  text: string;
  timestamp: number;
  isPartial?: boolean;
}

export interface AiSuggestion {
  id: string;
  text: string;
  type: "response" | "objection";
  timestamp: number;
  isStreaming?: boolean;
}

export type SessionPhase = "preparation" | "live" | "summary";
