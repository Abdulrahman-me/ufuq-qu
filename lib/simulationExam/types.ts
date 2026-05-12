import type { SubjectSlug } from "@/lib/readiness";

export interface SimulationQuestion {
  id: string;
  subject: SubjectSlug;
  question: string;
  choices: string[];
  correctIndex: number;
}

/** choice index, explicit unknown, or not answered yet */
export type AnswerRecord = Record<string, number | "unknown" | null>;

export { type SimulationResult, type SimulationPerSubject } from "@/lib/readiness";
