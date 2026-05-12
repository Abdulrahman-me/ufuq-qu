"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Clock, HelpCircle, LogOut } from "lucide-react";
import { saveSimulationResult } from "@/lib/readiness";
import { SIMULATION_QUESTIONS } from "@/lib/simulationExam/questions.gen";
import { buildSimulationResult } from "@/lib/simulationExam/scoreSimulation";
import type { AnswerRecord } from "@/lib/simulationExam/types";
import { cn } from "@/lib/utils";

const TOTAL_MS = 100 * 60 * 1000;

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function SimulationExamClient() {
  const router = useRouter();
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>(() => {
    const init: AnswerRecord = {};
    SIMULATION_QUESTIONS.forEach((q) => {
      init[q.id] = null;
    });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, TOTAL_MS - (now - startedAt));
  const q = SIMULATION_QUESTIONS[currentIndex]!;

  const progressAnswered = useMemo(() => {
    return SIMULATION_QUESTIONS.filter((x) => answers[x.id] !== null).length;
  }, [answers]);

  const finalize = useCallback(
    (opts: { earlyExit: boolean; timedOut: boolean }) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      const finishedAt = Date.now();
      const result = buildSimulationResult(SIMULATION_QUESTIONS, answers, {
        startedAt,
        finishedAt,
        timeRemainingMs: Math.max(0, TOTAL_MS - (finishedAt - startedAt)),
        earlyExit: opts.earlyExit,
        timedOut: opts.timedOut,
      });
      saveSimulationResult(result);
      setAnalyzing(true);
      setTimeout(() => {
        router.push("/simulation/result");
      }, 1400);
    },
    [answers, router, startedAt],
  );

  useEffect(() => {
    if (remainingMs > 0 || submittedRef.current || analyzing) return;
    finalize({ earlyExit: false, timedOut: true });
  }, [remainingMs, analyzing, finalize]);

  function setChoice(choiceIndex: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: choiceIndex }));
  }

  function setUnknown() {
    setAnswers((prev) => ({ ...prev, [q.id]: "unknown" }));
  }

  const pct = Math.round((progressAnswered / SIMULATION_QUESTIONS.length) * 100);

  /** must pick a choice or «I don't know» before next / finish */
  const currentResponded = answers[q.id] !== null;

  if (analyzing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
        >
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="text-lg font-bold text-white">جاري حساب النتائج وتحديث الجاهزية…</p>
          <p className="text-sm text-slate-400">لحظات فقط ثم صفحة الإحصائيات التفصيلية.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 font-black text-slate-950 shadow-lg">
              أف
            </div>
            <div className="text-end">
              <p className="text-xs font-bold text-slate-500">Simulation Exam</p>
              <p className="text-sm font-black text-white">اختبار المحاكاة</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-mono text-lg font-black tabular-nums text-amber-300"
              dir="ltr"
            >
              <Clock className="h-5 w-5 shrink-0" />
              {formatMs(remainingMs)}
            </div>
            <button
              type="button"
              onClick={() => setShowEndModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-200 transition-colors hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              إنهاء الاختبار
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 md:py-10" dir="rtl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
          <span>
            سؤال <span dir="ltr">{currentIndex + 1}</span> من{" "}
            <span dir="ltr">{SIMULATION_QUESTIONS.length}</span>
          </span>
          <span dir="ltr" className="tabular-nums">
            {pct}% محاولة إجابة
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6 shadow-2xl md:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/90">English</p>
            <h2 className="mb-6 text-lg font-bold leading-relaxed text-white ltr md:text-xl" dir="ltr">
              {q.question}
            </h2>
            <div className="space-y-2.5 ltr" dir="ltr">
              {q.choices.map((choice, i) => {
                const sel = answers[q.id] === i;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setChoice(i)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all",
                      sel
                        ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-50 shadow-lg shadow-emerald-500/10"
                        : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-white/20 hover:bg-white/[0.06]",
                    )}
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-xs font-black">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {choice}
                  </motion.button>
                );
              })}
            </div>

            {answers[q.id] === "unknown" ? (
              <p className="mt-4 text-center text-xs font-bold text-amber-300">Marked: I don&apos;t know</p>
            ) : null}
            {!currentResponded ? (
              <p className="mt-4 text-center text-xs text-slate-500">اختر إجابة أو «لا أعلم» للانتقال إلى السؤال التالي.</p>
            ) : null}
          </motion.article>
        </AnimatePresence>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={setUnknown}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-200 transition-colors hover:bg-amber-500/20"
            >
              <HelpCircle className="h-4 w-4" />
              لا أعلم
            </button>
            {currentIndex < SIMULATION_QUESTIONS.length - 1 ? (
              <button
                type="button"
                disabled={!currentResponded}
                onClick={() => setCurrentIndex((i) => Math.min(SIMULATION_QUESTIONS.length - 1, i + 1))}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting || !currentResponded}
                onClick={() => finalize({ earlyExit: false, timedOut: false })}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              >
                إنهاء وتصحيح
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      {showEndModal ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEndModal(false)}
            aria-label="إغلاق"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-white">إنهاء الاختبار المحاكي؟</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              سيتم تصحيح الأسئلة التي أجبت عنها (بما فيها «لا أعلم») وتحديث الجاهزية. الأسئلة غير المجاب عنها تُحسب
              كغير مجاب عنها.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/5"
              >
                متابعة الاختبار
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndModal(false);
                  finalize({ earlyExit: true, timedOut: false });
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700"
              >
                إنهاء الآن
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
