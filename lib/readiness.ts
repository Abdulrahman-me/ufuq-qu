export type SubjectReadinessMap = Record<string, number>;

export type SubjectSlug =
  | "programming1"
  | "programming2"
  | "discrete_math"
  | "software_engineering"
  | "databases"
  | "ds_algo";

const PLACEMENT_STORAGE_KEY = "ufuq-placement-result-v1";
const READINESS_STORAGE_KEY = "ufuq-subject-readiness-v1";
const SIMULATION_STORAGE_KEY = "ufuq-simulation-result-v1";

export interface PlacementPerSubject {
  subjectSlug: SubjectSlug;
  correct: number;
  total: number;
}

export interface PlacementResult {
  startedAt: number;
  finishedAt: number;
  totalScore: number;
  maxScore: number;
  perSubject: PlacementPerSubject[];
}

export interface SimulationPerSubject {
  subjectSlug: SubjectSlug;
  correct: number;
  wrong: number;
  unknown: number;
  unanswered: number;
  total: number;
}

export interface SimulationResult {
  kind: "simulation";
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  timeRemainingMs: number;
  earlyExit: boolean;
  timedOut: boolean;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  unknownCount: number;
  unansweredCount: number;
  perSubject: SimulationPerSubject[];
}

export function savePlacementResult(result: PlacementResult) {
  if (typeof window === "undefined") return;

  const readiness: SubjectReadinessMap = { ...getSubjectReadiness() };
  result.perSubject.forEach((p) => {
    if (p.total > 0) {
      readiness[p.subjectSlug] = Math.round((p.correct / p.total) * 100);
    }
  });
  localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(readiness));
  localStorage.setItem(PLACEMENT_STORAGE_KEY, JSON.stringify(result));
}

export function saveSimulationResult(result: SimulationResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(result));

  const readiness: SubjectReadinessMap = { ...getSubjectReadiness() };
  result.perSubject.forEach((p) => {
    if (p.total > 0) {
      readiness[p.subjectSlug] = Math.round((p.correct / p.total) * 100);
    }
  });
  localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(readiness));
}

export function getSimulationResult(): SimulationResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SIMULATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as SimulationResult;
    return v?.kind === "simulation" ? v : null;
  } catch {
    return null;
  }
}

export function getPlacementResult(): PlacementResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PLACEMENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlacementResult;
  } catch {
    return null;
  }
}

export function getSubjectReadiness(): SubjectReadinessMap {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(READINESS_STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as SubjectReadinessMap;
  } catch {
    return {};
  }
}

export function setSubjectReadiness(next: SubjectReadinessMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(next));
}

export function bumpSubjectReadiness(subjectSlug: SubjectSlug, delta: number) {
  const current = getSubjectReadiness();
  const prev = current[subjectSlug] ?? 0;
  current[subjectSlug] = Math.max(0, Math.min(100, prev + delta));
  setSubjectReadiness(current);
  return current[subjectSlug];
}

export function guessSubjectSlugFromName(name: string): SubjectSlug | null {
  const n = name.toLowerCase();
  if (n.includes("برمجة 1") || n.includes("برمجة١") || n.includes("برمجة ١") || n.includes("programming1") || n.includes("programming 1")) return "programming1";
  if (n.includes("برمجة 2") || n.includes("برمجة٢") || n.includes("برمجة ٢") || n.includes("programming2") || n.includes("programming 2")) return "programming2";
  if (
    n.includes("متقطعة") ||
    n.includes("discrete") ||
    n.includes("رياضيات متقطعة") ||
    n.includes("discrete math")
  )
    return "discrete_math";
  if (n.includes("هندسة") || n.includes("software engineering") || n.includes("software_engineering")) return "software_engineering";
  if (n.includes("قواعد") || n.includes("database") || n.includes("databases") || n.includes("db")) return "databases";
  if (n.includes("خوارزم") || n.includes("هياكل") || n.includes("data structures") || n.includes("algorithms") || n.includes("ds_algo")) return "ds_algo";
  return null;
}

export const SUBJECT_LABELS_AR: Record<SubjectSlug, string> = {
  programming1: "برمجة 1",
  programming2: "برمجة 2",
  discrete_math: "الرياضيات المتقطعة",
  software_engineering: "أسس هندسة البرمجيات",
  databases: "نظم قواعد البيانات",
  ds_algo: "الخوارزميات وهياكل البيانات",
};
