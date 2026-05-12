"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlarmClock,
  ArrowLeft,
  BookMarked,
  Brain,
  Code2,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useTypewriter } from "@/components/landing/useTypewriter";
import { cn } from "@/lib/utils";

const TYPEWRITER_EN = [
  "Prove baseline SE knowledge in one focused session.",
  "90 questions · 100 minutes · timer always visible.",
  "Placement-level difficulty — no trick olympiad items.",
];

const SUBJECT_PILLS = [
  { icon: Code2, label: "Programming I & II" },
  { icon: Layers, label: "Discrete Math" },
  { icon: Database, label: "Databases" },
  { icon: Cpu, label: "DS & Algorithms" },
  { icon: BookMarked, label: "Software Engineering" },
];

export function SimulationLandingClient() {
  const typed = useTypewriter(TYPEWRITER_EN, 28, 2400, 22);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_20%,rgba(16,185,129,0.12),transparent),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(139,92,246,0.15),transparent)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed -left-32 top-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none fixed -right-24 bottom-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
        animate={{ y: [0, -24, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8 md:pt-12" dir="rtl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-6 text-center lg:text-start"
          >
            <motion.span
              layout
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-emerald-300/90 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Software Engineering · Simulation
            </motion.span>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
              اختبار المحاكاة
            </h1>
            <p className="text-lg text-slate-400 md:text-xl">
              محاكاة كاملة لاختبار الجاهزية: 90 سؤالاً بالإنجليزية، مستوى تحديد مستوى، مع تحديث نسب الجاهزية لكل
              مادة بعد الانتهاء.
            </p>
            <p
              className="min-h-[1.6em] text-start text-base font-medium text-slate-200/90 md:text-lg ltr"
              dir="ltr"
            >
              <Zap className="mb-0.5 inline h-4 w-4 text-amber-400" /> {typed}
              <span className="animate-pulse text-emerald-400">|</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/simulation/exam"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-base font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">بدء الاختبار</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, -4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </motion.span>
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="/track"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 backdrop-blur transition-colors hover:bg-white/10"
              >
                العودة للمسارات
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/10 blur-2xl" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              {[
                { icon: Timer, v: "100", u: "دقيقة", c: "from-blue-500/30 to-cyan-500/10" },
                { icon: Brain, v: "90", u: "سؤالاً", c: "from-violet-500/30 to-fuchsia-500/10" },
                { icon: AlarmClock, v: "مؤقت", u: "دائم الظهور", c: "from-amber-500/25 to-orange-500/10" },
                { icon: Layers, v: "6", u: "مواد", c: "from-emerald-500/25 to-teal-500/10" },
              ].map((card, i) => (
                <motion.div
                  key={card.u}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={cn(
                    "rounded-2xl border border-white/10 bg-gradient-to-br p-5 shadow-xl backdrop-blur-md",
                    card.c,
                  )}
                >
                  <card.icon className="mb-3 h-8 w-8 text-white/90" />
                  <p className="font-mono text-3xl font-black text-white" dir="ltr">
                    {card.v}
                  </p>
                  <p className="text-sm font-bold text-slate-300">{card.u}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl"
            >
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Topics</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUBJECT_PILLS.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-200"
                  >
                    <Icon className="h-3.5 w-3.5 text-emerald-400" />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl text-center text-xs leading-relaxed text-slate-500"
        >
          بنك الأسئلة مُولَّد لمستوى تحديد المستوى ويمكن ربطه لاحقاً بمحتوى السلايدات الرسمية. الأزرار: السابق، لا
          أعلم، التالي، وإنهاء مبكر — ثم صفحة إحصائيات مفصّلة مع احتساب «لا أعلم» وتحديث الجاهزية لكل مادة.
        </motion.p>
      </main>
    </div>
  );
}
