import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BlockchainService } from "@/lib/blockchain/BlockchainService";

/**
 * Bridge endpoint: after a success event (e.g. quiz > 80%), issue a skill seal.
 * This is server-side only; private key never goes to the client.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      studentAddress?: string;
      skillName?: string;
      score?: number;
      eventType?: "QUIZ_SUCCESS" | "CHAPTER_MASTERY" | "PLACEMENT_SUCCESS";
    };

    const userId = (body.userId ?? "demo-user").slice(0, 200);
    const studentAddress = (body.studentAddress ?? "").trim();
    const skillName = (body.skillName ?? "").trim().slice(0, 120);
    const score = typeof body.score === "number" ? body.score : Number(body.score);
    const eventType = body.eventType ?? "QUIZ_SUCCESS";

    if (!studentAddress || !skillName || !Number.isFinite(score)) {
      return NextResponse.json({ error: "studentAddress, skillName, score are required" }, { status: 400 });
    }

    // Trigger rule: quiz score > 80% (as requested)
    if (score < 80) {
      return NextResponse.json({ ok: true, issued: false, message: "score_below_threshold" });
    }

    const svc = new BlockchainService();
    const tx = await svc.issueSkillSeal(studentAddress, skillName, Math.round(score), "Sanad");

    await supabaseAdmin.from("skill_seals").insert({
      user_id: userId,
      student_address: studentAddress,
      skill_name: skillName,
      score: Math.round(score),
      issuer: "Sanad",
      issued_at: new Date().toISOString(),
      chain_id: tx.chainId,
      tx_hash: tx.txHash,
      polygonscan_url: tx.polygonScanUrl,
      status: "ISSUED",
      meta: { source: "sanad", eventType },
    });

    return NextResponse.json({
      ok: true,
      issued: true,
      sanad_line:
        "لقد أثبتّ جدارتك في هذا القسم، قمت الآن بتوثيق مهاراتك في جوازك المهاري عبر البلوكشين لضمان مصداقيتك أمام أصحاب العمل.",
      tx,
    });
  } catch (e) {
    console.error("sanad/success-event error", e);
    return NextResponse.json({ error: "success_event_failed" }, { status: 500 });
  }
}

