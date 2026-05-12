"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  delay = 0,
  accent = "default",
}: {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  delay?: number;
  accent?: "default" | "emerald" | "amber" | "rose" | "violet";
}) {
  const ring =
    accent === "emerald"
      ? "ring-emerald-500/15 hover:ring-emerald-500/25"
      : accent === "amber"
        ? "ring-amber-500/15 hover:ring-amber-500/25"
        : accent === "rose"
          ? "ring-rose-500/15 hover:ring-rose-500/25"
          : accent === "violet"
            ? "ring-violet-500/15 hover:ring-violet-500/25"
            : "ring-primary/10 hover:ring-primary/20";

  const iconBg =
    accent === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : accent === "amber"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : accent === "rose"
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : accent === "violet"
            ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
            : "bg-primary/10 text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm ring-1 transition-shadow hover:shadow-lg",
        ring,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 font-mono text-3xl font-black tracking-tight text-foreground md:text-4xl">
            <span dir="ltr" className="tabular-nums inline-block">
              {value}
            </span>
          </p>
          {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        </div>
        {Icon ? (
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
