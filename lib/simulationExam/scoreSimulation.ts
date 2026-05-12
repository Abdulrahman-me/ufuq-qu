import type { SubjectSlug, SimulationPerSubject, SimulationResult } from "@/lib/readiness";
import type { AnswerRecord, SimulationQuestion } from "./types";

const ALL_SUBJECTS: SubjectSlug[] = [
  "programming1",
  "programming2",
  "discrete_math",
  "databases",
  "ds_algo",
  "software_engineering",
];

export function buildSimulationResult(
  questions: SimulationQuestion[],
  answers: AnswerRecord,
  opts: {
    startedAt: number;
    finishedAt: number;
    timeRemainingMs: number;
    earlyExit: boolean;
    timedOut: boolean;
  },
): SimulationResult {
  let correctCount = 0;
  let wrongCount = 0;
  let unknownCount = 0;
  let unansweredCount = 0;

  const perMap: Record<SubjectSlug, SimulationPerSubject> = {} as Record<SubjectSlug, SimulationPerSubject>;
  for (const s of ALL_SUBJECTS) {
    perMap[s] = { subjectSlug: s, correct: 0, wrong: 0, unknown: 0, unanswered: 0, total: 0 };
  }

  for (const q of questions) {
    const per = perMap[q.subject];
    per.total += 1;
    const a = answers[q.id];
    if (a === "unknown") {
      unknownCount += 1;
      per.unknown += 1;
    } else if (a === null || a === undefined) {
      unansweredCount += 1;
      per.unanswered += 1;
    } else if (a === q.correctIndex) {
      correctCount += 1;
      per.correct += 1;
    } else {
      wrongCount += 1;
      per.wrong += 1;
    }
  }

  const answeredCount = correctCount + wrongCount + unknownCount;

  return {
    kind: "simulation",
    startedAt: opts.startedAt,
    finishedAt: opts.finishedAt,
    durationMs: opts.finishedAt - opts.startedAt,
    timeRemainingMs: opts.timeRemainingMs,
    earlyExit: opts.earlyExit,
    timedOut: opts.timedOut,
    totalQuestions: questions.length,
    answeredCount,
    correctCount,
    wrongCount,
    unknownCount,
    unansweredCount,
    perSubject: ALL_SUBJECTS.map((s) => perMap[s]),
  };
}
