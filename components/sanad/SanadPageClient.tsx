"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { useTypewriter } from "@/components/landing/useTypewriter";
import SanadChat from "@/components/sanad/SanadChat";
import { SanadLoopExplainer } from "@/components/sanad/SanadLoopExplainer";
import { SanadDashboard } from "@/components/sanad/SanadDashboard";

const HERO_PHRASES = [
  "وكيل يربط الجلسة بالجاهزية والجواز — ضمن حلقة مغلقة.",
  "تحليل مبني على السلوك، بدون أرقام جافة في وجهك.",
  "خطوة تلو الخطوة: ملاحظة، تفسير، إجراء.",
];

export default function SanadPageClient() {
  const typed = useTypewriter(HERO_PHRASES, 34, 2100, 26);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div
        className="landing-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-[0.26] dark:opacity-[0.14]"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute start-0 top-28 h-72 w-72 rounded-full bg-primary/12 blur-3xl"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 11, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute end-0 bottom-32 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-8 md:pt-10">
        <div
          dir="rtl"
          className="mb-10 grid grid-cols-1 gap-8 lg:mb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]"
        >
          <motion.header
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center md:text-right"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
              <MessageCircle className="h-3.5 w-3.5" />
              سند — وكيل التعلّم
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              مرشدك{" "}
              <span className="bg-gradient-to-l from-primary via-emerald-500 to-sky-400 bg-clip-text text-transparent">
                الأكاديمي
              </span>
            </h1>
            <p className="mx-auto mt-4 min-h-[1.45em] max-w-2xl text-base text-muted-foreground md:mx-0 md:text-lg">
              <Sparkles className="mb-0.5 inline h-4 w-4 text-primary" />{" "}
              <span className="font-semibold text-foreground/90">{typed}</span>
              <span className="animate-pulse text-primary">|</span>
            </p>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:mx-0">
              يعمل كـ AI Agent داخل منظومة أفق: يقرأ إشارات التعلّم، يضيف التفسير والتوصية، ويغذّي الجاهزية والجواز.
              المحادثة تبدأ بشكل طبيعي؛ تُستخدم ذاكرة الجلسات الطويلة لاحقاً عندما يصبح للسياق معنى حقيقي في الرد. عند
              الحاجة يرتّب النظام متابعة مع المرشد البشري — دون حجز يدوي منك.
            </p>
          </motion.header>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <SanadLoopExplainer variant="aside" className="lg:sticky lg:top-20" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.95fr)] lg:items-start">
          <SanadChat />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
              <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">لوحة التحليلات</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            </div>
            <SanadDashboard />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
