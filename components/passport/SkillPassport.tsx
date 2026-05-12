"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getPlacementResult } from "@/lib/readiness";

type SkillSeal = {
  id: string;
  skill_name: string;
  score: number | null;
  issuer: string;
  issued_at: string;
  chain_id: number | null;
  tx_hash: string | null;
  polygonscan_url: string | null;
  status: "ISSUED" | "FAILED";
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}

function sealLabel(skillName: string) {
  return skillName.length > 18 ? `${skillName.slice(0, 18)}…` : skillName;
}

export function SkillPassport({
  userId,
  className,
  reloadKey = 0,
}: {
  userId?: string;
  className?: string;
  /** Increment after issuing a seal so the list refetches. */
  reloadKey?: number;
}) {
  const effectiveUserId = userId ?? "demo-user";
  const [seals, setSeals] = useState<SkillSeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const placementSeal = useMemo(() => {
    const placement = getPlacementResult();
    if (!placement) return null;
    // Requirement: show automatically if student completed the first 10-question quiz.
    const finished = Boolean(placement.finishedAt);
    const isTenQuestions = placement.maxScore >= 10;
    if (!finished || !isTenQuestions) return null;
    return {
      id: "jahiziya-assessment",
      skill_name: "وسام اختبار تحديد المستوى",
      score: placement.totalScore,
      issuer: "Sanad",
      issued_at: new Date(placement.finishedAt).toISOString(),
      chain_id: null,
      tx_hash: null,
      polygonscan_url: null,
      status: "ISSUED" as const,
    } satisfies SkillSeal;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/skill-passport/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: effectiveUserId }),
        });
        const json = await res.json();
        if (!cancelled) setSeals(Array.isArray(json.seals) ? json.seals : []);
      } catch {
        if (!cancelled) setSeals([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [effectiveUserId, reloadKey]);

  const allSeals = useMemo(() => {
    const list = [...seals];
    if (placementSeal) list.unshift(placementSeal);
    return list;
  }, [seals, placementSeal]);

  return (
    <div className={cn("rounded-2xl border border-slate-300 bg-white p-6", className)}>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-black text-slate-900">الجواز المهاري</h2>
          <p className="text-xs text-slate-600">
            أوسمة موثقة تظهر إنجازاتك. كل ختم يوضح تاريخ الإصدار وحالة التحقق.
          </p>
        </div>
        <div className="text-[11px] text-slate-500">Issuer: Sanad</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-slate-200 bg-slate-50" />
          ))}
        </div>
      ) : allSeals.length === 0 ? (
        <p className="text-sm text-slate-600">ما عندك أوسمة حالياً. أول إنجاز قوي وبيطلع هنا.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allSeals.map((s) => {
            const hovered = hoveredId === s.id;
            const verified = Boolean(s.tx_hash && s.polygonscan_url) && s.status === "ISSUED";
            return (
              <div
                key={s.id}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId((v) => (v === s.id ? null : v))}
                className={cn(
                  "relative rounded-xl border p-3 transition-colors",
                  "border-slate-300 bg-white",
                  hovered && "border-slate-900",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900">{sealLabel(s.skill_name)}</div>
                  <div
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                      verified
                        ? "border-slate-900 text-slate-900"
                        : "border-slate-300 text-slate-500",
                    )}
                  >
                    {verified ? "Verified" : s.status === "FAILED" ? "Failed" : "Pending"}
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="text-[11px] text-slate-600">Seal</div>
                  {typeof s.score === "number" && (
                    <div className="text-sm font-black text-slate-900">{Math.round(s.score)}%</div>
                  )}
                </div>

                {hovered && (
                  <div className="absolute inset-x-3 top-[54px] z-10 rounded-lg border border-slate-900 bg-white p-3 text-[11px] text-slate-800">
                    <div className="grid gap-1">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">تاريخ الإصدار</span>
                        <span className="font-bold">{formatDate(s.issued_at)}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">المُصدر</span>
                        <span className="font-bold">{s.issuer || "Sanad"}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">التحقق</span>
                        <span className="font-bold">{verified ? "موثق على Polygon" : "غير موثق"}</span>
                      </div>
                      {s.polygonscan_url && (
                        <a
                          href={s.polygonscan_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex w-full justify-center rounded-md border border-slate-900 px-2 py-1 text-[11px] font-bold text-slate-900 hover:bg-slate-50"
                        >
                          PolygonScan
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

