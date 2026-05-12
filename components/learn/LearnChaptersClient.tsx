"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, ChevronLeft, BookMarked, Sparkles } from "lucide-react";
import { useTypewriter } from "@/components/landing/useTypewriter";

const TYPE_PHRASES = ["اختر فصلاً وابدأ الجلسة.", "شرائح، صوت، كويز، وفيديو في مكان واحد.", "تقدمك يُحفظ تلقائياً."];

type Chapter = { id: string; title: string };

export function LearnChaptersClient({
  subjectName,
  chapters,
}: {
  subjectName: string;
  chapters: Chapter[];
}) {
  const typed = useTypewriter(TYPE_PHRASES, 34, 2100, 26);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div className="landing-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-[0.28] dark:opacity-[0.14]" aria-hidden />

      <div className="relative px-4 pb-20 pt-10 md:px-8 md:pt-14">
        <motion.div
          className="pointer-events-none absolute start-1/4 top-40 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="mx-auto max-w-3xl">
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1.5 font-bold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
              كل المواد
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold text-foreground">{subjectName}</span>
          </motion.nav>

          <motion.header
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10 text-center md:text-right"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <BookMarked className="h-3.5 w-3.5" />
              {subjectName}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              اختر{" "}
              <span className="bg-gradient-to-l from-primary to-sky-400 bg-clip-text text-transparent">الفصل</span>
            </h1>
            <p className="mx-auto mt-4 min-h-[1.4em] max-w-lg text-muted-foreground md:mx-0">
              <Sparkles className="mb-1 inline h-4 w-4 text-primary" />{" "}
              <span className="font-medium text-foreground/90">{typed}</span>
              <span className="animate-pulse text-primary">|</span>
            </p>
          </motion.header>

          <div className="space-y-3">
            {chapters.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground backdrop-blur-sm"
              >
                لا توجد فصول مضافة بعد لهذه المادة.
              </motion.div>
            ) : (
              chapters.map((ch, i) => (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 28 }}
                >
                  <Link
                    href={`/learn/chapter/${ch.id}`}
                    prefetch
                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 md:p-5"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 text-primary ring-1 ring-primary/20"
                    >
                      <span className="text-sm font-black">{i + 1}</span>
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-foreground transition-colors group-hover:text-primary md:text-lg">
                        {ch.title}
                      </p>
                      <p className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 md:text-sm">
                        ابدأ الجلسة — سلايدات، أدوات، وتقرير
                      </p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <PlayCircle className="h-9 w-9 shrink-0 text-primary opacity-80 transition-transform group-hover:scale-110 group-hover:opacity-100" />
                    </motion.div>
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-l from-primary/8 via-transparent to-transparent" />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center md:text-right"
          >
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              العودة لقائمة المواد
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
