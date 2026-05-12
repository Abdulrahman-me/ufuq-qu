import { NextRequest, NextResponse } from "next/server";
import { analyzeStudentMock } from "@/lib/sanad/analysis";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { userId } = (await req.json()) as { userId?: string };

    // في الـ MVP، إن لم يرسل userId نستخدم قيمة ثابتة
    const effectiveUserId = userId ?? "demo-user";

    const analysis = await analyzeStudentMock(effectiveUserId);

    const { data: flags } = await supabaseAdmin
      .from("sanad_human_flags")
      .select("id, risk_level, student_tier, reason, created_at, resolved")
      .eq("user_id", effectiveUserId)
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: memory } = await supabaseAdmin
      .from("sanad_student_memory")
      .select("memory_summary, updated_at")
      .eq("user_id", effectiveUserId)
      .maybeSingle();

    return NextResponse.json({ ...analysis, human_flags: flags ?? [], memory_summary: memory?.memory_summary ?? null });
  } catch (e) {
    console.error("SANAD analyze error", e);
    return NextResponse.json({ error: "SANAD analysis error" }, { status: 500 });
  }
}

