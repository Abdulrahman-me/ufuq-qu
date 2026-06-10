"use client";

import { useState } from "react";
import { getPassportStudentWallet, PASSPORT_FALLBACK_DEV_ADDRESS } from "@/lib/passport/onchainDemo";

export function DevIssueSealCard({ onIssued }: { onIssued?: () => void }) {
  const [loading, setLoading] = useState(false);

  async function issueTestSeal() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/skill-passport/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demo-user",
          studentAddress: getPassportStudentWallet() || PASSPORT_FALLBACK_DEV_ADDRESS,
          skillName: "وسام تجريبي — قواعد بيانات متقدمة",
          score: 92,
          issuer: "Sanad",
          source: "dev",
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(`Issue failed: ${json?.error ?? res.status}`);
        return;
      }

      const json = await res.json().catch(() => ({}));
      const tx = json?.tx;
      const msg = [
        "تم الإصدار.",
        tx?.chainLabel ? `الشبكة: ${tx.chainLabel}` : "",
        tx?.txHash ? `Tx: ${tx.txHash}` : "",
        tx?.polygonScanUrl ? `المستكشف: ${tx.polygonScanUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      alert(msg);
      onIssued?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-sm dark:bg-card/30">
      <p className="text-sm font-black text-foreground">Developer</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        زر تجريبي لإصدار ختم مهارة للتأكد من الربط بين الواجهة و Supabase و Polygon.
      </p>
      <button
        type="button"
        onClick={issueTestSeal}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "جاري الإصدار…" : "إصدار ختم تجريبي: قواعد بيانات متقدمة"}
      </button>
      <p className="text-[11px] text-muted-foreground">
        ملاحظة: المفتاح الخاص يُستخدم في السيرفر فقط عبر مسار API.
      </p>
    </div>
  );
}

