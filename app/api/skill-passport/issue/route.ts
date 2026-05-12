import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BlockchainService } from "@/lib/blockchain/BlockchainService";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      studentAddress?: string;
      skillName?: string;
      score?: number;
      issuer?: "Sanad" | "Alumni";
      source?: "dev" | "sanad" | "system";
    };

    const userId = (body.userId ?? "demo-user").slice(0, 200);
    const studentAddress = (body.studentAddress ?? "").trim();
    const skillName = (body.skillName ?? "").trim().slice(0, 120);
    const score = typeof body.score === "number" ? body.score : Number(body.score);
    const issuer = body.issuer ?? "Sanad";
    const source = body.source ?? "system";

    if (!studentAddress || !skillName || !Number.isFinite(score)) {
      return NextResponse.json({ error: "studentAddress, skillName, score are required" }, { status: 400 });
    }

    const svc = new BlockchainService();

    try {
      const issued = await svc.issueSkillSeal(studentAddress, skillName, Math.round(score), issuer);

      const { error } = await supabaseAdmin.from("skill_seals").insert({
        user_id: userId,
        student_address: studentAddress,
        skill_name: skillName,
        score: Math.round(score),
        issuer,
        issued_at: new Date().toISOString(),
        chain_id: issued.chainId,
        tx_hash: issued.txHash,
        polygonscan_url: issued.polygonScanUrl,
        status: "ISSUED",
        meta: { source, from: issued.from },
      });

      if (error) {
        return NextResponse.json({ error: error.message, tx: issued }, { status: 500 });
      }

      return NextResponse.json({ ok: true, tx: issued });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "issue_failed";
      await supabaseAdmin.from("skill_seals").insert({
        user_id: userId,
        student_address: studentAddress || null,
        skill_name: skillName || "unknown",
        score: Number.isFinite(score) ? Math.round(score) : null,
        issuer,
        issued_at: new Date().toISOString(),
        status: "FAILED",
        meta: { source, error: msg },
      });
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  } catch (e) {
    console.error("skill-passport/issue error", e);
    return NextResponse.json({ error: "issue_failed" }, { status: 500 });
  }
}

