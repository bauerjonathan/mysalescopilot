export type Difficulty = "easy" | "medium" | "hard";
export type TrainingScenario = "cold-call" | "consulting" | "follow-up";
export type TrainingPhase = "setup" | "chat" | "evaluation";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface EvaluationCategory {
  score: number;
  feedback: string;
}

export interface TrainingEvaluation {
  overall_score: number;
  categories: {
    opening: EvaluationCategory;
    needs_analysis: EvaluationCategory;
    argumentation: EvaluationCategory;
    objection_handling: EvaluationCategory;
    closing: EvaluationCategory;
  };
  strengths: string[];
  improvements: string[];
  tip: string;
}
