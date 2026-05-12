"use client";

import { useState } from "react";
import { Activity, Brain, ChevronDown, Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type StudentState = "high" | "fluctuating" | "pressure";

export interface StudentInsight {
  id: string;
  name: string;
  before: number;
  after: number;
  state: StudentState;
  signals: string[];
  recommendation: string;
}

const stateConfig: Record<StudentState, { label: string; className: string; dot: string }> = {
  high: {
    label: "متفوّق",
    className: "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  fluctuating: {
    label: "متوسط",
    className: "border-amber-500/35 bg-amber-500/[0.08] text-amber-900 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  pressure: {
    label: "مبتدئ",
    className: "border-rose-500/35 bg-rose-500/[0.08] text-rose-900 dark:text-rose-200",
    dot: "bg-rose-500",
  },
};

function ChangeBadge({ delta }: { delta: number }) {
  const strongUp = delta >= 5;
  const strongDown = delta <= -2;
  const neutral = !strongUp && !strongDown;
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center justify-center gap-0.5 rounded-lg px-2 py-0.5 font-mono text-sm font-bold tabular-nums",
        strongUp && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        strongDown && "bg-rose-500/15 text-rose-700 dark:text-rose-400",
        neutral && "bg-muted text-muted-foreground",
      )}
    >
      {strongUp ? (
        <TrendingUp className="h-3.5 w-3.5 shrink-0" />
      ) : strongDown ? (
        <TrendingDown className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <Minus className="h-3.5 w-3.5 shrink-0" />
      )}
      {delta > 0 ? "+" : ""}
      {delta}%
    </span>
  );
}

function studentInitial(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const last = parts[parts.length - 1];
  return last?.charAt(0) ?? "؟";
}

function StudentInsightDetailPanel({ student }: { student: StudentInsight }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          إشارات رئيسية
        </div>
        <ul className="space-y-2">
          {student.signals.map((s) => (
            <li key={s} className="flex gap-2 text-sm text-foreground/90">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-violet-500/[0.04] p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Brain className="h-3.5 w-3.5" />
          توصية الذكاء الاصطناعي
        </div>
        <p className="text-sm font-medium leading-relaxed text-foreground">{student.recommendation}</p>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Sparkles className="h-3 w-3 shrink-0 text-primary" />
        <span>مستخرجة من بيانات التعلم التكيفي والجلسات</span>
      </div>
    </div>
  );
}

/** عمود موحّد: اسم + حالة + جاهزية + تغيير + زر — يطابق رأس الجدول */
const ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,6.5rem)_minmax(0,7.5rem)_minmax(0,5.5rem)_2.75rem] md:items-center md:gap-3";

function StudentInsightRow({ student, index }: { student: StudentInsight; index: number }) {
  const [open, setOpen] = useState(false);
  const delta = student.after - student.before;
  const cfg = stateConfig[student.state];
  const toggleId = `student-row-${student.id}`;

  return (
    <div
      className={cn(
        "border-b border-border/60 transition-colors last:border-b-0",
        index % 2 === 1 && "bg-muted/[0.2]",
      )}
    >
      <div className={cn("relative flex flex-col gap-2 px-3 py-2.5 sm:px-4", ROW_GRID, "md:py-2.5")}>
        <div className="relative flex min-w-0 items-center gap-2 md:col-start-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/10 text-xs font-black text-primary">
            {studentInitial(student.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">{student.name}</p>
          </div>
        </div>
        <div className="relative flex shrink-0 md:col-start-2 md:justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold",
              cfg.className,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
          </span>
        </div>
        <div
          dir="ltr"
          className="relative text-center font-mono text-sm font-black tabular-nums text-foreground md:col-start-3"
        >
          <span className="text-muted-foreground md:hidden">الجاهزية: </span>
          {student.before}% <span className="text-muted-foreground">→</span> {student.after}%
        </div>
        <div dir="ltr" className="relative flex justify-start md:col-start-4 md:justify-center">
          <ChangeBadge delta={delta} />
        </div>
        <div className="flex justify-center md:col-start-5">
          <button
            type="button"
            id={toggleId}
            aria-expanded={open}
            aria-controls={`${toggleId}-panel`}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-background/90 text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              open && "border-primary/35 bg-primary/10 text-primary",
            )}
          >
            <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", open && "rotate-180")} />
            <span className="sr-only">{open ? "طي التفاصيل" : "عرض التفاصيل"}</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={`${toggleId}-panel`}
            role="region"
            aria-labelledby={toggleId}
            className="border-t border-border/50 bg-card/90 px-3 py-4 sm:px-5"
          >
            <StudentInsightDetailPanel student={student} />
          </div>
        </div>
      </div>
    </div>
  );
}

const explorerHeaderClass = cn(
  "hidden border-b border-border/70 bg-muted/55 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground sm:px-4",
  ROW_GRID,
);

export function StudentInsightsExplorer({ students }: { students: StudentInsight[] }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border/80 bg-card/40 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
      dir="rtl"
    >
      <div className={explorerHeaderClass}>
        <span className="md:text-start">الطالب</span>
        <span className="text-center">الحالة</span>
        <span dir="ltr" className="text-center tabular-nums">
          الجاهزية
        </span>
        <span dir="ltr" className="text-center">
          التغيير
        </span>
        <span className="text-center" aria-hidden>
          {" "}
        </span>
      </div>
      {students.map((s, i) => (
        <StudentInsightRow key={s.id} student={s} index={i} />
      ))}
    </div>
  );
}

/** @deprecated Use StudentInsightsExplorer for advisor list view */
export function StudentCard({ student, index }: { student: StudentInsight; index: number }) {
  return <StudentInsightRow student={student} index={index} />;
}
