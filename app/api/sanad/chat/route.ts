import { NextResponse } from "next/server";
import { runSanadChat } from "@/lib/sanad/engine";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function createAutoAdvisorBooking(userId: string, note: string | null): Promise<boolean> {
  try {
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: pending } = await supabaseAdmin
      .from("advisor_booking_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "PENDING")
      .gte("created_at", sinceIso)
      .limit(1)
      .maybeSingle();

    if (pending) return false;

    const reason = ["جدولة تلقائية من سند — نافذة المرشد 08:00–15:00.", note?.trim()]
      .filter(Boolean)
      .join(" ")
      .slice(0, 500);

    const { error } = await supabaseAdmin.from("advisor_booking_requests").insert({
      user_id: userId,
      source: "sanad",
      status: "PENDING",
      reason,
    });

    return !error;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { message, history, sessionSummary, userId, includeLongTermMemory } = (await request.json()) as {
      message?: string;
      history?: { sender: "student" | "sanad"; content: string }[];
      sessionSummary?: unknown;
      userId?: string;
      /** false = لا تُمرَّر ذاكرة طويلة للنموذج (البداية طبيعية) */
      includeLongTermMemory?: boolean;
    };

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const effectiveUserId = (userId ?? "demo-user").slice(0, 200);

    const useMemory = includeLongTermMemory === true;

    const { data: memory } = useMemory
      ? await supabaseAdmin
          .from("sanad_student_memory")
          .select("memory_summary, memory_json, updated_at")
          .eq("user_id", effectiveUserId)
          .maybeSingle()
      : { data: null as null };

    const result = await runSanadChat({
      message,
      history,
      sessionSummary: sessionSummary ?? null,
      longTermMemory: useMemory ? memory ?? null : null,
    });

    let autoBookingCreated = false;
    if (result.auto_book_advisor) {
      autoBookingCreated = await createAutoAdvisorBooking(
        effectiveUserId,
        result.advisor_scheduling_note ?? result.human_review_reason,
      );
    }

    if (result.needs_human_review) {
      await supabaseAdmin.from("sanad_human_flags").insert({
        user_id: effectiveUserId,
        risk_level: result.risk_level,
        student_tier: result.student_tier,
        reason:
          (result.human_review_reason ?? result.advisor_scheduling_note ?? "").slice(0, 500) || null,
        resolved: false,
      });
    }

    return NextResponse.json({
      ...result,
      auto_booking_created: autoBookingCreated,
    });
  } catch (error) {
    console.error("SANAD chat error", error);
    return NextResponse.json({ error: "SANAD engine error" }, { status: 500 });
  }
}
