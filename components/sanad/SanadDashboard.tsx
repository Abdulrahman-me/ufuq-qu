"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SanadAnalysis } from "@/lib/sanad/analysis";

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function SanadDashboard() {
  const [data, setData] = useState<SanadAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/sanad/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "demo-user" }),
        });
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-border/40 bg-muted/30" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center backdrop-blur-sm"
      >
        <p className="text-sm text-muted-foreground">
          تعذر تحميل تحليل سند حالياً. سيتم عرض التحليل هنا عند توفر البيانات.
        </p>
      </motion.div>
    );
  }

  const openFlags = Array.isArray(data.human_flags) ? data.human_flags : [];

  const stateLabel =
    data.student_state === "HIGH"
      ? "طالب متقدّم"
      : data.student_state === "UNSTABLE"
        ? "طالب غير مستقر"
        : "طالب معرض للخطر";

  const riskLabel =
    data.risk_level === "LOW" ? "منخفض" : data.risk_level === "MEDIUM" ? "متوسط" : "عالٍ";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/45 p-5 shadow-xl backdrop-blur-xl ring-1 ring-primary/10 md:p-6">
      <div className="pointer-events-none absolute -end-16 -top-12 h-40 w-40 rounded-full bg-primary/8 blur-2xl" />

      <div className="relative space-y-5">
        {data.memory_summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 to-transparent p-4 backdrop-blur-sm"
          >
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              ذاكرة سند عنك
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{data.memory_summary}</p>
          </motion.div>
        )}

        {openFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-sm"
          >
            <p className="flex items-center gap-2 text-sm font-black text-foreground">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              تنبيهات للمراجعة البشرية
            </p>
            <ul className="mt-2 list-disc space-y-1 pr-5 text-xs text-muted-foreground">
              {openFlags.slice(0, 3).map((f) => (
                <li key={f.id}>{f.reason ? f.reason : "تم رصد حالة تستدعي تدخل بشري."}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Brain className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">حالة الطالب</p>
            <p className="mt-1 text-base font-black text-foreground">{stateLabel}</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">الجاهزية</p>
            <p className="mt-1 text-2xl font-black text-primary">{data.readiness_score}%</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.15 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">التركيز التقريبي</p>
            <p className="mt-1 text-base font-black text-foreground">{data.focus_duration} دقيقة</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm transition-shadow hover:border-primary/25 hover:shadow-md"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">مستوى الخطورة</p>
            <p
              className={cn(
                "mt-1 text-base font-black",
                data.risk_level === "LOW"
                  ? "text-emerald-600"
                  : data.risk_level === "MEDIUM"
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {riskLabel}
            </p>
          </motion.div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-muted/15 p-4 backdrop-blur-sm"
          >
            <p className="text-sm font-black text-foreground">إجراءات موصى بها</p>
            {data.recommended_actions.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">لا توجد توصيات حالياً.</p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pr-5 text-xs leading-relaxed text-foreground">
                {data.recommended_actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-muted/15 p-4 backdrop-blur-sm"
          >
            <p className="text-sm font-black text-foreground">العناصر الضعيفة</p>
            {data.weak_topics.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                سيقوم سند بتحديد الموضوعات الضعيفة عندما تتوفر بيانات أكثر.
              </p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pr-5 text-xs text-foreground">
                {data.weak_topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              اتساق التعلم:{" "}
              {data.learning_consistency === "HIGH"
                ? "عالٍ"
                : data.learning_consistency === "MEDIUM"
                  ? "متوسط"
                  : "منخفض"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
