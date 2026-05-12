import { NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/gemini/client";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SessionSummary = {
  sessionDuration?: number;
  focusDuration?: number;
  playPauseCount?: number;
  replayCount?: number;
  readinessScore?: number;
  preferredLearningMethod?: string;
  chapterId?: string;
  chapterTitle?: string;
};

type MemorySaveResult = {
  memory_summary: string;
  student_profile: {
    tier: "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK";
    risk_level: "LOW" | "MEDIUM" | "HIGH";
    notes: string[];
    follow_up_question: string;
    check_in_line: string;
  };
};

function fallbackMemoryFromSession(
  sessionSummary: SessionSummary | null,
  excerpt: { sender: "student" | "sanad"; content: string }[],
): MemorySaveResult {
  const chapter =
    typeof sessionSummary?.chapterTitle === "string" ? sessionSummary.chapterTitle.slice(0, 80) : "جلسة تعلّم";
  const method =
    typeof sessionSummary?.preferredLearningMethod === "string"
      ? sessionSummary.preferredLearningMethod
      : "غير محدد";
  const lastLine = excerpt.length ? excerpt[excerpt.length - 1]!.content.slice(0, 120) : "";
  return {
    memory_summary: `جلسة على «${chapter}». أسلوب التعلّم المفضّل: ${method}. آخر تفاعل مختصر في المحادثة: ${lastLine || "—"}. (تم الحفظ بدون نموذج لغوي بسبب تعذّر الخدمة.)`,
    student_profile: {
      tier: "FLUCTUATING",
      risk_level: "MEDIUM",
      notes: ["ملخص تلقائي مؤقت — يُنصح بإعادة المحاولة عند توفر الذكاء الاصطناعي."],
      follow_up_question: "كيف كانت تجربتك في آخر فصل دراسي؟",
      check_in_line: "نراك قريباً — نتابع تقدمك في المنصة.",
    },
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      sessionSummary?: SessionSummary | null;
      lastChatExcerpt?: { sender: "student" | "sanad"; content: string }[];
    };

    const userId = (body.userId ?? "demo-user").slice(0, 200);
    const sessionSummary = body.sessionSummary ?? null;
    const excerpt = Array.isArray(body.lastChatExcerpt) ? body.lastChatExcerpt.slice(-12) : [];

    const prompt = `You are SANAD, an AI Academic Advisor for Ufuq (Saudi-friendly dialect, no emojis).

Task: summarize the student's latest learning session into long-term memory and classify their tier for Jahiziya exam readiness.

Inputs:
Session Summary JSON (do NOT repeat raw numbers in output):
${JSON.stringify(sessionSummary)}

Recent chat excerpt (if any):
${excerpt.map((m) => `${m.sender === "student" ? "Student" : "SANAD"}: ${m.content}`).join("\n") || "(none)"}

OUTPUT JSON ONLY with:
{
  "memory_summary": "2-5 short Arabic sentences capturing durable memory (habits, struggles, strengths, current topic). No numbers.",
  "student_profile": {
    "tier": "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK",
    "risk_level": "LOW" | "MEDIUM" | "HIGH",
    "notes": ["short bullet-like notes", "..."],
    "follow_up_question": "one short Arabic question SANAD should ask next time",
    "check_in_line": "one short Arabic check-in line for next session"
  }
}

Rules:
- Arabic, Saudi white dialect, professional and warm.
- No emojis.
- Keep technical terms in English.
- Do not include any API/system/meta info.`;

    let result: MemorySaveResult;
    let usedFallback = false;
    try {
      result = await callGeminiJson<MemorySaveResult>(prompt, "احفظ ذاكرة الجلسة");
    } catch (geminiErr) {
      console.warn("SANAD session/close: Gemini unavailable, using fallback summary", geminiErr);
      result = fallbackMemoryFromSession(sessionSummary, excerpt);
      usedFallback = true;
    }

    const memory_summary = (result.memory_summary ?? "").toString().slice(0, 1200);
    const memory_json = {
      ...result,
      source: usedFallback ? "session_close_fallback" : "session_close",
      saved_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("sanad_student_memory").upsert(
      {
        user_id: userId,
        memory_summary,
        memory_json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      ok: true,
      memory_summary,
      student_profile: result.student_profile,
      usedFallback,
    });
  } catch (e) {
    console.error("SANAD session/close error", e);
    return NextResponse.json(
      { ok: false, error: "session_close_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    );
  }
}

