import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { userId } = (await request.json()) as { userId?: string };
    const effectiveUserId = (userId ?? "demo-user").slice(0, 200);

    const { data, error } = await supabaseAdmin
      .from("sanad_student_memory")
      .select("memory_summary, memory_json, updated_at")
      .eq("user_id", effectiveUserId)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ memory: data ?? null });
  } catch (e) {
    console.error("SANAD memory/get error", e);
    return NextResponse.json({ error: "memory_get_failed" }, { status: 500 });
  }
}

