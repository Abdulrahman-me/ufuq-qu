"use client";

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlidesViewerProps {
  slidePath: string | null;
  chapterTitle: string;
  className?: string;
}

export function SlidesViewer({ slidePath, chapterTitle, className }: SlidesViewerProps) {
  const isPdf = slidePath?.toLowerCase().endsWith(".pdf");
  const url = slidePath?.startsWith("http")
    ? slidePath
    : slidePath
      ? `/api/slides/${slidePath.split("/").map((s) => encodeURIComponent(s)).join("/")}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-2xl shadow-black/10 backdrop-blur-xl ring-1 ring-primary/10",
        className,
      )}
    >
      <div className="pointer-events-none absolute -end-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between gap-2 border-b border-border/60 bg-gradient-to-l from-muted/50 to-muted/20 px-4 py-3 backdrop-blur-sm">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">عرض الشرائح</p>
            <p className="truncate text-sm font-black text-foreground">{chapterTitle}</p>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-[360px] flex-1 items-center justify-center bg-gradient-to-b from-muted/40 to-muted/60">
        {url ? (
          isPdf ? (
            <iframe src={url} title={chapterTitle} className="h-full min-h-[400px] w-full border-0" />
          ) : (
            <iframe src={url} title={chapterTitle} className="h-full min-h-[400px] w-full border-0" />
          )
        ) : (
          <div className="p-8 text-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-primary/35 bg-primary/5 text-primary"
            >
              <Layers className="h-7 w-7 opacity-70" />
            </motion.div>
            <p className="text-sm font-bold text-foreground">لا يوجد ملف شرائح مربوط بعد</p>
            <p className="mt-2 text-xs text-muted-foreground">
              بعد تشغيل المعالجة المسبقة وربط المسار في Supabase ستظهر الشرائح هنا.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
