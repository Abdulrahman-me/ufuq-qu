import { SANAD_SYSTEM_PROMPT } from "@/prompts/sanad/systemPrompt";
import { callGeminiJson } from "@/lib/gemini/client";

export type SessionSummary = {
  sessionDuration?: number; // seconds
  focusDuration?: number; // seconds
  playPauseCount?: number;
  replayCount?: number;
  readinessScore?: number; // 0-100
  preferredLearningMethod?: string;
  chapterTitle?: string;
  chapterId?: string;
};

export type SanadChatResult = {
  reply: string;
  recommendations: { title: string; detail: string }[];
  report: {
    analysis: string[];
    strengths: string[];
    improvements: string[];
    actions: string[];
  } | null;
  /** يحدده النموذج؛ الخادم ينشئ طلب مرشد تلقائياً عند الحاجة */
  auto_book_advisor: boolean;
  advisor_scheduling_note: string | null;
  student_tier: "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK";
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  needs_human_review: boolean;
  human_review_reason: string | null;
};

export async function runSanadChat(args: {
  message: string;
  history?: { sender: "student" | "sanad"; content: string }[];
  sessionSummary?: SessionSummary | null;
  longTermMemory?: { memory_summary?: string | null; memory_json?: any } | null;
}): Promise<SanadChatResult> {
  const { message, history = [], sessionSummary = null, longTermMemory = null } = args;

  const historyText = history
    .slice(-10)
    .map((m) => `${m.sender === "student" ? "Student" : "SANAD"}: ${m.content}`)
    .join("\n");

  const behaviorContext = sessionSummary
    ? `Session Summary (do NOT repeat raw numbers):
${JSON.stringify(sessionSummary)}`
    : `Session Summary: not available`;

  const memoryContext =
    longTermMemory?.memory_summary || longTermMemory?.memory_json
      ? `Long-term memory (use naturally, do not quote):
${JSON.stringify(longTermMemory)}`
      : `Long-term memory: not available`;

  const fullPrompt = `${SANAD_SYSTEM_PROMPT}

${behaviorContext}

${memoryContext}

Conversation (recent):
${historyText || "(no prior messages)"}

OUTPUT FORMAT (JSON ONLY):
Return a valid JSON object with:
{
  "reply": "Arabic reply to the student, following Observation/Interpretation/Action. No raw numbers.",
  "recommendations": [{"title":"...","detail":"..."}, ...]  // 2-4 items (shown only in UI when student opens \"تقرير الجلسة\")
  "report": {
    "analysis": ["...", "..."],
    "strengths": ["..."],
    "improvements": ["..."],
    "actions": ["..."]
  } | null,
  "auto_book_advisor": true|false,
  "advisor_scheduling_note": "short Arabic internal note for advisors" | null,
  "student_tier": "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "needs_human_review": true|false,
  "human_review_reason": "short Arabic reason for human advisor dashboard" | null
}
Rules:
- reply must be friendly, Saudi-white dialect, smart, supportive; not formal; not robotic.
- do NOT list metrics; convert to insights.
- NO EMOJIS.
- NEVER ask the student to book or click anything for a human advisor. When at-risk or needs_human_review: set auto_book_advisor=true and advisor_scheduling_note briefly (system books slots 08:00–15:00 automatically).
- Tiering & nudges:
  - Top Performer: challenge + cert/project suggestion.
  - Fluctuating: use loss aversion + social proof nudge.
  - At-risk: emotional support + check-in; auto_book_advisor=true when escalation applies.
- Human-in-loop: if At-risk OR strong negative sentiment OR repeated confusion: needs_human_review=true with reason and auto_book_advisor=true.
`;

  type Raw = SanadChatResult & { suggest_booking?: boolean; booking_reason?: string | null };
  const result = await callGeminiJson<Raw>(fullPrompt, message);
  const autoBook =
    Boolean((result as Raw).auto_book_advisor) ||
    Boolean((result as Raw).suggest_booking) ||
    (Boolean((result as Raw).needs_human_review) && (result as Raw).student_tier === "AT_RISK");
  return {
    reply: result.reply || "تمام، خلّني أساعدك بطريقة أوضح.",
    recommendations: Array.isArray(result.recommendations) ? result.recommendations.slice(0, 4) : [],
    report: result.report ?? null,
    auto_book_advisor: autoBook,
    advisor_scheduling_note:
      (result as Raw).advisor_scheduling_note ??
      (result as Raw).booking_reason ??
      (result as Raw).human_review_reason ??
      null,
    student_tier: result.student_tier ?? "FLUCTUATING",
    risk_level: result.risk_level ?? "MEDIUM",
    needs_human_review: Boolean(result.needs_human_review),
    human_review_reason: result.human_review_reason ?? null,
  };
}

