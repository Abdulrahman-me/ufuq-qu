"use client";

import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import { AdvisorDashboard } from "@/components/advisor/AdvisorDashboard";
import { useTypewriter } from "@/components/landing/useTypewriter";

const HERO_PHRASES = [
  "حوّل الإشارات السلوكية إلى مكاسب قابلة للقياس في الجاهزية.",
  "أظهر من يحتاج لمسة بشرية — قبل أن تنزلق الدرجات.",
  "أغلق الحلقة بين سند والمحتوى ومكتب المرشد.",
];

export function AdvisorPageClient() {
  const typed = useTypewriter(HERO_PHRASES, 32, 2200, 24);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(ellipse_80%_50%_at_100%_50%,hsl(260_60%_50%/0.08),transparent)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed start-0 top-40 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ opacity: [0.35, 0.55, 0.35], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed end-0 bottom-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <main dir="rtl" className="relative mx-auto max-w-7xl px-4 pb-24 pt-10 md:px-8 md:pt-14">
        <motion.header
          dir="rtl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:text-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <BarChart3 className="h-3.5 w-3.5" />
            مساحة عمل المرشد
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
            رؤى المرشد الأكاديمي
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground md:text-xl">
            تحليل مدعوم بالذكاء الاصطناعي لجاهزية الطلاب وسلوك التعلم
          </p>
          <p className="mt-4 min-h-[1.5em] max-w-2xl text-base font-medium text-foreground/85 md:text-lg">
            <Sparkles className="mb-0.5 inline h-4 w-4 text-primary" /> {typed}
            <span className="animate-pulse text-primary">|</span>
          </p>
        </motion.header>

        <AdvisorDashboard />
      </main>
    </div>
  );
}
