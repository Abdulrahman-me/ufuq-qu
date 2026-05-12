import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userId?: string };
    const userId = (body.userId ?? "demo-user").slice(0, 200);

    const { data, error } = await supabaseAdmin
      .from("skill_seals")
      .select("id, skill_name, score, issuer, issued_at, chain_id, tx_hash, polygonscan_url, status, meta")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ seals: data ?? [] });
  } catch (e) {
    console.error("skill-passport/list error", e);
    return NextResponse.json({ error: "list_failed" }, { status: 500 });
  }
}

