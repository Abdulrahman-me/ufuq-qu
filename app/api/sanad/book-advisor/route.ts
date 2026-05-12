import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      reason?: string;
    };

    const userId = body.userId ?? "demo-user";
    const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : null;

    const { data, error } = await supabaseAdmin
      .from("advisor_booking_requests")
      .insert({
        user_id: userId,
        source: "sanad",
        status: "PENDING",
        reason,
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, booking: data });
  } catch (e) {
    console.error("SANAD book-advisor error", e);
    return NextResponse.json({ error: "booking_failed" }, { status: 500 });
  }
}

