"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getSubjectReadiness, guessSubjectSlugFromName } from "@/lib/readiness";

export function SubjectReadinessBadge({
  subjectName,
  className,
}: {
  subjectName: string;
  className?: string;
}) {
  const slug = useMemo(() => guessSubjectSlugFromName(subjectName), [subjectName]);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) {
      setValue(null);
      return;
    }
    const map = getSubjectReadiness();
    setValue(map[slug] ?? 0);
  }, [slug]);

  if (!slug) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        جاهزية: —
      </span>
    );
  }

  const v = value ?? 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground">جاهزية</span>
      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden border border-border">
        <div
          className="h-full bg-gradient-to-l from-[#1B8354] to-[#25935F]"
          style={{ width: `${Math.max(0, Math.min(100, v))}%` }}
        />
      </div>
      <span className="text-xs font-bold text-foreground tabular-nums">
        {v}%
      </span>
    </div>
  );
}

