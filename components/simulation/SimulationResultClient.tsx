"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  MinusCircle,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { getSimulationResult, getSubjectReadiness, SUBJECT_LABELS_AR, type SubjectSlug } from "@/lib/readiness";
import { SIMULATION_QUESTIONS } from "@/lib/simulationExam/questions.gen";
import { cn } from "@/lib/utils";

const SUBJECT_ORDER: SubjectSlug[] = [
  "programming1",
  "programming2",
  "discrete_math",
  "databases",
  "ds_algo",
  "software_engineering",
];

export function SimulationResultClient() {
  const router = useRouter();
  const result = useMemo(() => getSimulationResult(), []);
  const readiness = useMemo(() => getSubjectReadiness(), []);

  useEffect(() => {
    if (!result) router.replace("/simulation");
  }, [result, router]);

  if (!result) return null;

  const durationSec = Math.max(1, Math.round(result.durationMs / 1000));
  const durationMin = (durationSec / 60).toFixed(1);
  const overallPct = Math.round((result.correctCount / result.totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(16,185,129,0.12),transparent)]"
        aria-hidden
      />

      <main className="relative mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14" dir="rtl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Simulation complete
          </span>
          <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">نتائج اختبار المحاكاة</h1>
          <p className="mt-2 text-sm text-slate-400">
            إحصائيات تفصيلية — صحيح، خطأ، لا أعلم، وغير مجاب — مع تحديث جاهزية كل مادة في المنصة.
          </p>
        </motion.header>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "الإجابات الصحيحة", value: result.correctCount, icon: CheckCircle2, color: "text-emerald-400" },
            { label: "إجابات خاطئة", value: result.wrongCount, icon: XCircle, color: "text-rose-400" },
            { label: "لا أعلم", value: result.unknownCount, icon: HelpCircle, color: "text-amber-400" },
            { label: "غير مجاب", value: result.unansweredCount, icon: MinusCircle, color: "text-slate-400" },
          ].map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
            >
              <c.icon className={cn("mb-2 h-8 w-8", c.color)} />
              <p className="font-mono text-3xl font-black text-white" dir="ltr">
                {c.value}
              </p>
              <p className="text-xs font-bold text-slate-500">{c.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-transparent p-6 md:col-span-1"
          >
            <div className="flex items-center gap-2 text-emerald-300">
              <Target className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">الجاهزية الكلية</span>
            </div>
            <p className="mt-3 font-mono text-5xl font-black text-white" dir="ltr">
              {overallPct}%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              من إجمالي {result.totalQuestions} سؤالاً (الغير مجاب لا يُحسب صحيحاً)
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-bold">الزمن</span>
              </div>
              <p className="mt-2 font-mono text-2xl font-black text-white" dir="ltr">
                {durationMin} min
              </p>
              <p className="text-[11px] text-slate-500">
                متبقٍ عند الإنهاء: {Math.round(result.timeRemainingMs / 1000 / 60)} د تقريباً
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold text-slate-500">وضع الإنهاء</p>
              <p className="mt-2 text-sm font-bold text-white">
                {result.timedOut
                  ? "انتهى الوقت تلقائياً"
                  : result.earlyExit
                    ? "إنهاء مبكر"
                    : "إكمال كامل"}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-black text-white">تفصيل حسب المادة</h2>
          <div className="space-y-4">
            {SUBJECT_ORDER.map((slug, idx) => {
              const p = result.perSubject.find((x) => x.subjectSlug === slug);
              if (!p || p.total === 0) return null;
              const rPct = readiness[slug] ?? 0;
              const parts = [
                { k: "صح", v: p.correct, className: "bg-emerald-500" },
                { k: "خطأ", v: p.wrong, className: "bg-rose-500" },
                { k: "؟", v: p.unknown, className: "bg-amber-500" },
                { k: "—", v: p.unanswered, className: "bg-slate-600" },
              ];
              return (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-white">{SUBJECT_LABELS_AR[slug]}</p>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300" dir="ltr">
                      جاهزية محدثة: {rPct}%
                    </span>
                  </div>
                  <div className="mb-2 flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                    {parts.map((seg) =>
                      seg.v > 0 ? (
                        <motion.div
                          key={seg.k}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(seg.v / p.total) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5 }}
                          className={seg.className}
                          title={`${seg.k}: ${seg.v}`}
                        />
                      ) : null,
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-400">
                    <span className="text-emerald-400">صح: {p.correct}</span>
                    <span className="text-rose-400">خطأ: {p.wrong}</span>
                    <span className="text-amber-400">لا أعلم: {p.unknown}</span>
                    <span>غير مجاب: {p.unanswered}</span>
                    <span className="text-slate-500">من {p.total}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-transparent p-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-black text-white">
            <Sparkles className="h-4 w-4 text-violet-400" />
            ملخص سريع
          </h3>
          <p className="text-sm leading-relaxed text-slate-400">
            تم تحديث نسب الجاهزية لكل مادة بناءً على نسبة الإجابات الصحيحة من أصل أسئلة تلك المادة في المحاكاة (
            {SIMULATION_QUESTIONS.length} سؤالاً). إجابات «لا أعلم» لا تُحسب صحيحة لكنها تُظهر صراحةً في
            الإحصائيات أعلاه.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/simulation"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
            صفحة المحاكاة
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3 text-sm font-black text-slate-950 shadow-lg"
          >
            الانتقال للتعلم
          </Link>
        </div>
      </main>
    </div>
  );
}
