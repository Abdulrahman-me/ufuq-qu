"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Binary,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Fingerprint,
  Layers,
  Map,
  Network,
  Sparkles,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { getPlacementResult, getSubjectReadiness, type SubjectSlug } from "@/lib/readiness";
import {
  getPassportReferenceTxHash,
  getPassportReferenceTxUrl,
  getPassportStudentWallet,
  polygonExplorerAddressUrl,
  truncateHash,
} from "@/lib/passport/onchainDemo";
import {
  isLegacyDataStructuresSeal,
  SHOWCASE_BADGES,
  SHOWCASE_ICONS,
  showcaseLedgerSorted,
  showcaseRowToBookletSeal,
  type BookletSeal,
} from "@/lib/passport/showcaseBadges";
import { cn } from "@/lib/utils";
import { DevIssueSealCard } from "@/components/passport/DevIssueSealCard";
import { paletteIndexForSkill, VerifiedSealBadge } from "@/components/passport/VerifiedSealBadge";

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

const SUBJECT_LABELS: Record<SubjectSlug, string> = {
  programming1: "برمجة 1",
  programming2: "برمجة 2",
  discrete_math: "الرياضيات المتقطعة",
  software_engineering: "هندسة البرمجيات",
  databases: "قواعد البيانات",
  ds_algo: "هياكل وخوارزميات",
};

const SUBJECT_ORDER: SubjectSlug[] = [
  "programming1",
  "programming2",
  "discrete_math",
  "ds_algo",
  "databases",
  "software_engineering",
];

const ICONS = [Code2, Database, Cpu, Binary, Layers, Network, Sparkles, BookOpen] as const;

const BOOKLET_SPREAD_COUNT = 4;

function iconForSkill(name: string) {
  return ICONS[paletteIndexForSkill(name) % ICONS.length]!;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}

function PaperPage({
  children,
  className,
  side,
}: {
  children: ReactNode;
  className?: string;
  side: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[min(520px,72vh)] flex-col overflow-hidden border border-stone-300/80 bg-gradient-to-br from-[#fdfcfa] via-[#faf7f0] to-[#f3efe6] p-5 shadow-inner md:p-7 dark:border-border/60 dark:from-card dark:via-card dark:to-muted/30",
        side === "left" ? "rounded-s-2xl rounded-e-sm md:rounded-s-3xl" : "rounded-e-2xl rounded-s-sm md:rounded-e-3xl",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-8 w-px bg-gradient-to-b from-transparent via-stone-300/50 to-transparent dark:via-border/40",
          side === "left" ? "end-0" : "start-0",
        )}
      />
      <div className="relative z-[1] flex-1">{children}</div>
    </div>
  );
}

function RadarChart({ values }: { values: { label: string; value: number }[] }) {
  const n = values.length || 1;
  const cx = 120;
  const cy = 110;
  const maxR = 78;
  const points = values
    .map((_, i) => {
      const a = (-Math.PI / 2 + (i * 2 * Math.PI) / n) % (2 * Math.PI);
      const r = (values[i]!.value / 100) * maxR;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    })
    .join(" ");

  const grid = [0.25, 0.5, 0.75, 1].map((t) => {
    const pts = values
      .map((_, i) => {
        const a = (-Math.PI / 2 + (i * 2 * Math.PI) / n) % (2 * Math.PI);
        const r = maxR * t;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      })
      .join(" ");
    return <polygon key={t} points={pts} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/15" />;
  });

  return (
    <svg viewBox="0 0 240 220" className="mx-auto h-auto w-full max-w-[280px] text-foreground">
      {grid}
      <polygon points={points} fill="hsl(var(--primary) / 0.22)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      {values.map((v, i) => {
        const a = (-Math.PI / 2 + (i * 2 * Math.PI) / n) % (2 * Math.PI);
        const lx = cx + (maxR + 22) * Math.cos(a);
        const ly = cy + (maxR + 22) * Math.sin(a);
        return (
          <text
            key={v.label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[9px] font-bold"
            style={{ fontSize: "9px" }}
          >
            {v.label.length > 10 ? `${v.label.slice(0, 9)}…` : v.label}
          </text>
        );
      })}
      <text x={cx} y={cy + 6} textAnchor="middle" className="fill-primary text-sm font-black">
        جاهزية
      </text>
    </svg>
  );
}

export function PassportBooklet({
  reloadKey = 0,
  onSealIssued,
}: {
  reloadKey?: number;
  onSealIssued?: () => void;
}) {
  const userId = "demo-user";
  const [spread, setSpread] = useState(0);
  const [seals, setSeals] = useState<SkillSeal[]>([]);
  const [loadingSeals, setLoadingSeals] = useState(true);
  const [selectedSeal, setSelectedSeal] = useState<BookletSeal | null>(null);

  const readiness = useMemo(() => getSubjectReadiness(), [reloadKey]);
  const placement = useMemo(() => getPlacementResult(), [reloadKey]);

  const placementSeal = useMemo((): BookletSeal | null => {
    if (!placement?.finishedAt || placement.maxScore < 10) return null;
    return {
      id: "jahiziya-assessment",
      skill_name: "وسام اختبار تحديد المستوى",
      score: placement.totalScore,
      issuer: "Sanad",
      issued_at: new Date(placement.finishedAt).toISOString(),
      chain_id: null,
      tx_hash: null,
      polygonscan_url: null,
      status: "ISSUED",
      ledger_title: "اختبار تحديد المستوى (الجاهزية الأولية)",
      ledger_detail: `أُكمل اختبار تحديد المستوى بدرجة ${placement.totalScore} من ${placement.maxScore}. يُحتسب الختم ضمن الجواز عند إتمام المحاولة بحد أدنى من الأسئلة.`,
    };
  }, [placement]);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        setLoadingSeals(true);
        const res = await fetch("/api/skill-passport/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const json = await res.json();
        if (!c) setSeals(Array.isArray(json.seals) ? json.seals : []);
      } catch {
        if (!c) setSeals([]);
      } finally {
        if (!c) setLoadingSeals(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [userId, reloadKey]);

  const mergedSeals = useMemo((): BookletSeal[] => {
    const showcase = SHOWCASE_BADGES.map(showcaseRowToBookletSeal);
    const api = loadingSeals
      ? []
      : seals
          .filter((s) => !isLegacyDataStructuresSeal(s.skill_name))
          .map((s): BookletSeal => ({ ...s }));
    const head: BookletSeal[] = [];
    if (placementSeal) head.push(placementSeal);
    return [...head, ...showcase, ...api];
  }, [seals, placementSeal, loadingSeals]);

  const ledgerRows = useMemo(() => showcaseLedgerSorted(), []);

  const radarValues = useMemo(
    () =>
      SUBJECT_ORDER.map((slug) => ({
        label: SUBJECT_LABELS[slug],
        value: readiness[slug] ?? 0,
      })),
    [readiness],
  );

  const avgReadiness = useMemo(() => {
    const vals = SUBJECT_ORDER.map((s) => readiness[s] ?? 0);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [readiness]);

  const lastSession = useMemo(() => {
    try {
      const raw = localStorage.getItem("ufuq:lastSessionSummary");
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }, [reloadKey]);

  const go = useCallback((next: number) => {
    setSpread(Math.max(0, Math.min(BOOKLET_SPREAD_COUNT - 1, next)));
  }, []);

  useEffect(() => {
    if (!selectedSeal) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSeal(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [selectedSeal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(spread - 1);
      if (e.key === "ArrowRight") go(spread + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, spread]);

  const studentWallet = useMemo(() => getPassportStudentWallet(), []);

  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        className="relative mx-auto overflow-visible rounded-3xl"
        style={{ perspective: "1600px" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={spread}
            initial={{ rotateY: -18, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 14, opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
            className="grid grid-cols-1 gap-0 shadow-2xl shadow-black/20 md:grid-cols-2"
          >
            {spread === 0 && (
              <>
                <PaperPage side="left">
                  <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="rounded-full border-2 border-primary/30 bg-primary/10 p-6"
                    >
                      <Fingerprint className="h-14 w-14 text-primary" />
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">أفق</p>
                      <h2 className="mt-2 text-2xl font-black text-foreground md:text-3xl">الجواز المهاري الرقمي</h2>
                      <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
                        كتيب تفاعلي لإثبات مهاراتك وجاهزيتك — اقلب الصفحات واستكشف الأقسام.
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">استخدم الأسهم أو مفاتيح لوحة المفاتيح ← →</p>
                  </div>
                </PaperPage>
                <PaperPage side="right">
                  <div className="flex h-full flex-col justify-center gap-4">
                    <h3 className="text-lg font-black text-foreground">فهرس الكتيب</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {[
                        "١ — هويتك وإحصائيات سريعة",
                        "٢ — رادار الجاهزية والمواد",
                        "٣ — خريطة المهارات والأوسمة الموثقة",
                        "٤ — سجل عملي والتحقق من الأوسمة",
                      ].map((t, i) => (
                        <li
                          key={t}
                          role="button"
                          tabIndex={0}
                          onClick={() => go(i + 1)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              go(i + 1);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition-colors hover:border-primary/25 hover:bg-primary/[0.03]",
                            spread === i + 1 ? "border-primary/40 bg-primary/5" : "border-transparent",
                          )}
                        >
                          <span className="font-bold text-primary">{i + 1}</span>
                          {t.replace(/^\d+ — /, "")}
                        </li>
                      ))}
                    </ul>
                  </div>
                </PaperPage>
              </>
            )}

            {spread === 1 && (
              <>
                <PaperPage side="left">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <UserRound className="h-5 w-5" />
                    <h3 className="text-lg font-black">الطالب والملخص</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="rounded-2xl border border-border/60 bg-white/60 p-4 dark:bg-card/50">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">المعرّف</p>
                      <p className="mt-1 font-mono text-xs font-bold">{userId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-border/60 bg-white/60 p-3 text-center dark:bg-card/50">
                        <p className="text-[10px] text-muted-foreground">متوسط الجاهزية</p>
                        <p className="text-2xl font-black text-primary">{avgReadiness}%</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-white/60 p-3 text-center dark:bg-card/50">
                        <p className="text-[10px] text-muted-foreground">أوسمة مسجّلة</p>
                        <p className="text-2xl font-black text-foreground">{mergedSeals.length}</p>
                      </div>
                    </div>
                    {placement && (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-xs font-bold text-foreground">اختبار تحديد المستوى</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          النتيجة: {placement.totalScore} / {placement.maxScore} —{" "}
                          {placement.finishedAt ? "مكتمل" : "غير مكتمل"}
                        </p>
                      </div>
                    )}
                  </div>
                </PaperPage>
                <PaperPage side="right">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="text-lg font-black">رادار الجاهزية (جاهزية)</h3>
                  </div>
                  <RadarChart values={radarValues} />
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                    {radarValues.map((v) => (
                      <div key={v.label} className="flex justify-between rounded-lg bg-muted/40 px-2 py-1 font-bold">
                        <span className="truncate text-muted-foreground">{v.label}</span>
                        <span className="text-primary">{v.value}%</span>
                      </div>
                    ))}
                  </div>
                </PaperPage>
              </>
            )}

            {spread === 2 && (
              <>
                <PaperPage side="left">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <Map className="h-5 w-5" />
                    <h3 className="text-lg font-black">خريطة المهارات</h3>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">
                    تقدّم تقديري لكل مسار — يتحدّث مع نشاطك في المنصة واختبارات الجاهزية.
                  </p>
                  <div className="flex flex-col gap-3">
                    {SUBJECT_ORDER.map((slug) => {
                      const pct = readiness[slug] ?? 0;
                      return (
                        <div key={slug} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>{SUBJECT_LABELS[slug]}</span>
                            <span className="text-primary">{pct}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-l from-primary to-emerald-500"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </PaperPage>
                <PaperPage side="right">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <Fingerprint className="h-5 w-5" />
                    <h3 className="text-lg font-black">الأوسمة الموثقة</h3>
                  </div>
                  {loadingSeals ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted/50" />
                      ))}
                    </div>
                  ) : mergedSeals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">لا توجد أوسمة بعد. أكمل إنجازاتك في المنصة ليظهر الختم هنا.</p>
                  ) : (
                    <div className="custom-scrollbar grid max-h-[min(420px,55vh)] grid-cols-2 gap-x-2 gap-y-6 overflow-y-auto pr-1 sm:grid-cols-2">
                      {mergedSeals.map((s) => {
                        const verified = Boolean(s.tx_hash && s.polygonscan_url) && s.status === "ISSUED";
                        const sc = s.showcase;
                        const Icon = sc ? SHOWCASE_ICONS[sc.iconKey] : iconForSkill(s.skill_name);
                        const vi = sc?.variant ?? paletteIndexForSkill(s.skill_name);
                        const subtitleParts = [
                          typeof s.score === "number" ? `${Math.round(s.score)}٪` : null,
                          s.issuer?.trim() ? s.issuer : null,
                          formatDate(s.issued_at),
                        ].filter(Boolean);
                        return (
                          <div key={s.id} className="flex flex-col items-center">
                            <VerifiedSealBadge
                              title={s.skill_name.length > 22 ? `${s.skill_name.slice(0, 20)}…` : s.skill_name}
                              subtitle={subtitleParts.join(" · ")}
                              Icon={Icon}
                              variant={vi}
                              verified={verified}
                              dimmed={Boolean(sc?.faded)}
                              commitmentYellow={Boolean(sc?.commitmentYellow)}
                              compact
                              onClick={() => setSelectedSeal(s)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </PaperPage>
              </>
            )}

            {spread === 3 && (
              <>
                <PaperPage side="left">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="text-lg font-black">السجل العملي</h3>
                  </div>
                  <p className="mb-4 text-xs text-muted-foreground">
                    تفاصيل مرتبطة بالأوسمة المعروضة، مع آخر جلسة تعلّم إن وُجدت.
                  </p>
                  <div className="custom-scrollbar max-h-[min(480px,58vh)] space-y-3 overflow-y-auto pr-1">
                    {placementSeal?.ledger_title && placementSeal.ledger_detail ? (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-4 text-xs dark:bg-card/50"
                      >
                        <p className="font-black text-foreground">{placementSeal.ledger_title}</p>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{placementSeal.ledger_detail}</p>
                        <p className="mt-2 text-[10px] font-bold text-primary">
                          {formatDate(placementSeal.issued_at)} · {placementSeal.issuer}
                        </p>
                      </motion.div>
                    ) : null}
                    {ledgerRows.map((row, idx) => (
                      <motion.div
                        key={row.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * idx }}
                        className={cn(
                          "rounded-2xl border border-border/60 bg-white/70 p-4 text-xs dark:bg-card/50",
                          row.faded && "border-dashed opacity-[0.72] saturate-[0.85]",
                        )}
                      >
                        <p className="font-black text-foreground">{row.ledger_title}</p>
                        <p className="mt-2 leading-relaxed text-muted-foreground">{row.ledger_detail}</p>
                        <p className="mt-2 text-[10px] font-bold text-primary">
                          {formatDate(row.issued_at)} · {row.issuer}
                        </p>
                      </motion.div>
                    ))}
                    {lastSession ? (
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-2xl border border-border/60 bg-white/70 p-4 text-xs dark:bg-card/50"
                      >
                        <p className="font-black text-foreground">آخر جلسة تعلّم</p>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {typeof lastSession.chapterTitle === "string" && (
                            <li>الفصل: {lastSession.chapterTitle as string}</li>
                          )}
                          {typeof lastSession.sessionDuration === "number" && (
                            <li>مدة الجلسة (ثانية): {String(lastSession.sessionDuration)}</li>
                          )}
                          {typeof lastSession.preferredLearningMethod === "string" && (
                            <li>الوسيلة المفضلة: {lastSession.preferredLearningMethod as string}</li>
                          )}
                        </ul>
                      </motion.div>
                    ) : (
                      <p className="rounded-2xl border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
                        لا يوجد سجل جلسة محفوظ بعد. أنهِ جلسة من المنصة التعليمية ليُعرض ملخصها هنا.
                      </p>
                    )}
                    <div className="rounded-2xl border border-border/40 bg-muted/30 p-3 text-[11px] text-muted-foreground">
                      السجل الكامل يتوسّع مع ربط قاعدة البيانات بجلسات الطالب لاحقاً.
                    </div>
                  </div>
                </PaperPage>
                <PaperPage side="right">
                  <div className="mx-auto w-full max-w-[26rem]">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <ExternalLink className="h-5 w-5" />
                    <h3 className="text-lg font-black">التحقق من الأوسمة</h3>
                  </div>
                  <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                    رابط المعاملة يُبنى من متغيّرات البيئة (قاعدة المستكشف + المعاملة). عند تعيين عنوان محفظة صالح (42 حرفاً) يظهر رابط التحقق من الحساب أيضاً.
                  </p>
                  <a
                    href={getPassportReferenceTxUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="mb-3 flex w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-violet-500/35 bg-violet-500/[0.08] px-3 py-2.5 text-[11px] font-bold text-violet-900 transition-colors hover:bg-violet-500/15 dark:text-violet-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span>عرض المعاملة على المستكشف</span>
                    <span className="font-mono text-[10px] opacity-90">{truncateHash(getPassportReferenceTxHash(), 10, 8)}</span>
                  </a>
                  {studentWallet ? (
                    <a
                      href={polygonExplorerAddressUrl(studentWallet)}
                      target="_blank"
                      rel="noreferrer"
                      className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/[0.08] px-3 py-2.5 text-[11px] font-bold text-emerald-800 transition-colors hover:bg-emerald-500/15 dark:text-emerald-200"
                    >
                      <Wallet className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono">{truncateHash(studentWallet, 10, 8)}</span>
                      <span className="text-[10px] font-black">المستكشف</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-80" />
                    </a>
                  ) : null}
                  <div className="flex flex-col gap-3">
                    <Link
                      href="#passport-badges-anchor"
                      onClick={(e) => {
                        e.preventDefault();
                        go(2);
                      }}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-4 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                    >
                      عرض الأوسمة في الكتيب
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-6 border-t border-border/50 pt-4">
                    <p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">تطوير</p>
                    <DevIssueSealCard onIssued={onSealIssued} />
                  </div>
                  </div>
                </PaperPage>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div id="passport-badges-anchor" className="sr-only" aria-hidden />

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(spread - 1)}
            disabled={spread <= 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-md disabled:opacity-40"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
          <div className="flex gap-1.5">
            {Array.from({ length: BOOKLET_SPREAD_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === spread ? "w-8 bg-gradient-to-l from-[#1B8354] to-[#25935F]" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
                aria-label={`انتقل للفتحة ${i + 1}`}
              />
            ))}
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => go(spread + 1)}
            disabled={spread >= BOOKLET_SPREAD_COUNT - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-md disabled:opacity-40"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          الفتحة {spread + 1} من {BOOKLET_SPREAD_COUNT}
        </p>
      </div>

      <AnimatePresence>
        {selectedSeal ? (
          <motion.div
            key="seal-detail"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-3 backdrop-blur-[2px] sm:items-center"
            onClick={() => setSelectedSeal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="seal-detail-title"
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="custom-scrollbar relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedSeal(null)}
                className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
              <h4 id="seal-detail-title" className="pe-10 text-lg font-black leading-tight text-foreground">
                {selectedSeal.skill_name}
              </h4>
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedSeal.issuer} · {formatDate(selectedSeal.issued_at)}
                {typeof selectedSeal.score === "number" ? ` · ${Math.round(selectedSeal.score)}٪` : ""}
              </p>
              {selectedSeal.ledger_title && selectedSeal.ledger_detail ? (
                <div className="mt-4 rounded-xl border border-border/60 bg-muted/25 p-3 text-start">
                  <p className="text-xs font-black text-foreground">{selectedSeal.ledger_title}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{selectedSeal.ledger_detail}</p>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
