"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  Cpu,
  Shield,
  Zap,
} from "lucide-react";
import { useTypewriter } from "./useTypewriter";

const TYPE_PHRASES = [
  "جاهزية أذكى.",
  "سند يرافقك خطوة بخطوة.",
  "مهاراتك في الجواز المهاري الرقمي موثوقة.",
];

function MorphShowcaseCard() {
  return (
    <motion.div
      className="group relative h-44 overflow-hidden rounded-2xl border border-border bg-card shadow-lg md:h-52"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-sky-500/10 to-transparent p-4 transition-opacity duration-500 group-hover:opacity-0"
      >
        <Cpu className="h-14 w-14 text-primary/80" />
        <p className="mt-2 text-xs font-bold text-muted-foreground">AI + بيانات سلوكية</p>
      </motion.div>
      <motion.div
        className="absolute inset-0 flex flex-col justify-center p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <p className="text-sm font-black text-foreground">من التفاعل إلى القرار</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          نلتقط إشارات الجلسة والكويز والفيديو لتغذية سند والجواز المهاري الرقمي — كما في النسخة المنفّذة اليوم.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function LandingHero() {
  const typed = useTypewriter(TYPE_PHRASES, 38, 2000, 26);

  return (
    <section className="relative px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="landing-grid-bg absolute inset-0 opacity-[0.35] dark:opacity-[0.2]" />
        <motion.div
          className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            منصة عربية للجاهزية والمهارات
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="display-xl font-black leading-[1.25] tracking-tight text-foreground md:display-2xl"
          >
            ارفع{" "}
            <span className="bg-grad-2 bg-clip-text text-transparent">
              جاهزيتك الأكاديمية
            </span>
            <br />
            <span className="mt-1 block min-h-[1.35em] text-3xl md:text-4xl lg:text-[2.75rem]">
              مع{" "}
              <span className="bg-grad-3 bg-clip-text text-transparent">
                {typed}
                <span className="animate-pulse">|</span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            رحلة تعليمية متكاملة تجمع بين المحتوى التكيفي، الإرشاد الذكي، والتوثيق الرقمي لمهاراتك في منصة واحدة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/learn"
              prefetch
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-grad-2 px-7 py-3.5 text-sm font-black text-primary-foreground shadow-xl shadow-primary/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              <GraduationCap className="relative h-4 w-4" />
              <span className="relative">ادخل المنصة التعليمية</span>
            </Link>
            <Link
              href="#platform-demo"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/80 px-6 py-3.5 text-sm font-bold backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <Zap className="h-4 w-4 text-primary" />
              شاهد المحاكاة
            </Link>
            <Link
              href="/sanad"
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              سند
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              مفاتيح آمنة على الخادم
            </span>
            <span className="inline-flex items-center gap-2">
              <Cpu className="h-4 w-4 text-sky-500" />
              Gemini + Supabase
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-sky-500/10 blur-2xl"
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="grid gap-4">
            <MorphShowcaseCard />
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-border bg-card/90 p-4 shadow-md backdrop-blur-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Sanad</p>
                <p className="mt-1 text-xs font-bold text-foreground">طبقات + ذاكرة</p>
                <p className="mt-1 text-[10px] text-muted-foreground">إشارات بشرية عند الخطر</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-border bg-card/90 p-4 shadow-md backdrop-blur-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">الجواز المهاري</p>
                <p className="mt-1 text-xs font-bold text-foreground">رقمي وموثّق</p>
                <p className="mt-1 text-[10px] text-muted-foreground">سجل مهارات يعكس تقدّمك الفعلي</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mx-auto mt-16 flex max-w-6xl justify-center"
      >
        <a
          href="#about"
          className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          انزل للتفاصيل
        </a>
      </motion.div>
    </section>
  );
}
