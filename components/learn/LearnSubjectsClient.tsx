"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Cpu,
  Database,
  Layers,
  Code2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { SubjectReadinessBadge } from "@/components/learn/SubjectReadinessBadge";
import { useTypewriter } from "@/components/landing/useTypewriter";

const TYPE_PHRASES = [
  "دروس، شرائح، صوت، كويز.",
  "تعلّم بالوتيرة التي تناسبك.",
  "جاهزيتك ترتفع مع كل جلسة.",
];

const ICONS = [BookOpen, Code2, Cpu, Database, Layers, GraduationCap] as const;

function iconForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % 997;
  return ICONS[h % ICONS.length];
}

type Subject = { id: string; name: string; description: string | null };

export function LearnSubjectsClient({ subjects, error }: { subjects: Subject[]; error?: string | null }) {
  const typed = useTypewriter(TYPE_PHRASES, 36, 2200, 28);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 28 } },
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div className="landing-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-[0.28] dark:opacity-[0.14]" aria-hidden />

      <div className="relative px-4 pb-20 pt-10 md:px-8 md:pt-14">
        <motion.div
          className="pointer-events-none absolute start-[8%] top-32 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute end-[5%] top-60 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10 text-center md:text-right"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              التعلّم التكيفي
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground md:text-5xl">
              المنصة{" "}
              <span className="bg-gradient-to-l from-primary to-emerald-400 bg-clip-text text-transparent">التعليمية</span>
            </h1>
            <p className="mx-auto mt-4 min-h-[1.5em] max-w-xl text-base text-muted-foreground md:mx-0 md:text-lg">
              <span className="text-foreground font-semibold">{typed}</span>
              <span className="animate-pulse text-primary">|</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">اختر مادتك ثم الفصل لبدء جلسة كاملة من الشرائح والأدوات.</p>
          </motion.div>

          {subjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-border bg-card/80 p-10 text-center shadow-lg backdrop-blur-sm"
            >
              <BookOpen className="mx-auto mb-4 h-14 w-14 text-muted-foreground opacity-60" />
              <p className="text-lg font-bold text-foreground">لا توجد مواد متاحة حالياً</p>
              {error && (
                <p className="mt-2 text-xs font-mono text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                  Error: {error}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                شغّل المعالجة المسبقة وأضف المواد في Supabase، ثم أعد تحميل الصفحة.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                <ArrowLeft className="h-4 w-4" />
                لوحة التحكم
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-5 sm:grid-cols-2"
            >
              {subjects.map((s) => {
                const Icon = iconForName(s.name);
                return (
                  <motion.div key={s.id} variants={item}>
                    <Link
                      href={`/learn/${s.id}`}
                      prefetch
                      className="group relative block h-full overflow-hidden rounded-3xl border border-border/80 bg-card/70 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
                    >
                      <motion.div
                        className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                        initial={false}
                      />
                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <motion.div
                            whileHover={{ rotate: [0, -6, 6, 0], scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-sky-500/10 text-primary ring-1 ring-primary/20"
                          >
                            <Icon className="h-7 w-7" />
                          </motion.div>
                          <div className="min-w-0">
                            <h2 className="text-lg font-black text-foreground transition-colors group-hover:text-primary md:text-xl">
                              {s.name}
                            </h2>
                            {s.description ? (
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
                            ) : (
                              <p className="mt-1 text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                                اضغط لعرض الفصول والبدء
                              </p>
                            )}
                          </div>
                        </div>
                        <SubjectReadinessBadge subjectName={s.name} className="shrink-0" />
                      </div>
                      <motion.div
                        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 55%)",
                        }}
                      />
                      <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="text-xs font-bold text-primary">فتح المادة</span>
                        <motion.span
                          className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                          aria-hidden
                        >
                          ←
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
