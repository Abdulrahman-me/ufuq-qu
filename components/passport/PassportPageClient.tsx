"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Sparkles } from "lucide-react";
import { useTypewriter } from "@/components/landing/useTypewriter";
import { PassportBooklet } from "@/components/passport/PassportBooklet";

const HERO_PHRASES = [
  "أوسمة موثقة على السلسلة — شفافية أمام أصحاب العمل.",
  "كتيب تفاعلي لجاهزيتك ومهاراتك.",
  "اقلب الصفحات بين الرادار والأوسمة والسجل العملي.",
];

export function PassportPageClient() {
  const [sealReloadKey, setSealReloadKey] = useState(0);
  const onSealIssued = useCallback(() => {
    setSealReloadKey((k) => k + 1);
  }, []);
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
        className="pointer-events-none absolute end-0 bottom-32 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-8 md:pt-10">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center md:text-right"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
            <Fingerprint className="h-3.5 w-3.5" />
            جواز مهاري رقمي
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
            إثبات{" "}
            <span className="bg-gradient-to-l from-primary via-emerald-500 to-sky-400 bg-clip-text text-transparent">
              مهاراتك
            </span>
          </h1>
          <p className="mx-auto mt-4 min-h-[1.45em] max-w-2xl text-base text-muted-foreground md:mx-0 md:text-lg">
            <Sparkles className="mb-0.5 inline h-4 w-4 text-primary" />{" "}
            <span className="font-semibold text-foreground/90">{typed}</span>
            <span className="animate-pulse text-primary">|</span>
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:mx-0">
            كتيب بتأثير تقليب صفحات، رادار جاهزية، خريطة مهارات، أوسمة على شكل أختام، وسجل عملي مع روابط التحقق عبر
            PolygonScan.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5 }}
        >
          <PassportBooklet reloadKey={sealReloadKey} onSealIssued={onSealIssued} />
        </motion.div>
      </div>
    </div>
  );
}
