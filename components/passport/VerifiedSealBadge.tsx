"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const PALETTES = [
  { outer: "#0ea5e9", inner: "#0c4a6e", ring: "#38bdf8" },
  { outer: "#8b5cf6", inner: "#3b0764", ring: "#a78bfa" },
  { outer: "#10b981", inner: "#064e3b", ring: "#34d399" },
  { outer: "#f59e0b", inner: "#78350f", ring: "#fbbf24" },
  { outer: "#ec4899", inner: "#831843", ring: "#f472b6" },
  { outer: "#6366f1", inner: "#312e81", ring: "#818cf8" },
  { outer: "#14b8a6", inner: "#134e4a", ring: "#2dd4bf" },
  { outer: "#ef4444", inner: "#7f1d1d", ring: "#f87171" },
] as const;

/** وسام الالتزام: أصفر أوضح مع بهتان أخف */
const COMMITMENT_YELLOW = { outer: "#ca8a04", inner: "#422006", ring: "#fde047" } as const;

function scallopedPath(cx: number, cy: number, rOuter: number, rInner: number, teeth: number): string {
  const steps = teeth * 2;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")} Z`;
}

function smallStar(cx: number, cy: number, r: number): string {
  const p: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    p.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
  }
  return `M ${p[0]} L ${p.slice(1).join(" L ")} Z`;
}

export function paletteIndexForSkill(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i) * (i + 1)) % 997;
  return h % PALETTES.length;
}

export function VerifiedSealBadge({
  title,
  subtitle,
  Icon,
  variant,
  verified,
  compact = false,
  dimmed = false,
  commitmentYellow = false,
  onClick,
  className,
}: {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  variant: number;
  verified: boolean;
  compact?: boolean;
  /** تباين أقل (مثلاً غياب نشاط حديث كالدخول اليومي). */
  dimmed?: boolean;
  /** وسام الالتزام: لوحة أصفر وأقل بهتاناً من dimmed العادي */
  commitmentYellow?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const gid = useId().replace(/:/g, "");
  const p = commitmentYellow ? COMMITMENT_YELLOW : PALETTES[variant % PALETTES.length]!;
  const outer = scallopedPath(50, 50, 48, 40, 16);
  const mid = scallopedPath(50, 50, 38, 32, 16);
  const scale = compact ? 0.88 : 1;
  const gradId = `sg-${gid}-${variant}`;

  const dimClass = commitmentYellow
    ? dimmed && "opacity-[0.78] saturate-[0.95]"
    : dimmed && "opacity-[0.42] saturate-[0.55] grayscale-[0.35]";

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={dimmed && !commitmentYellow ? undefined : onClick ? { scale: 1.02 } : { y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={cn(
        "relative flex flex-col items-center outline-none",
        onClick && "cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-primary",
        dimClass,
        className,
      )}
      style={{ width: `${9.25 * scale}rem` }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div
        className="relative w-full drop-shadow-xl"
        style={{ filter: verified ? undefined : "saturate(0.88) opacity(0.9)" }}
      >
        <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.ring} />
              <stop offset="100%" stopColor={p.outer} />
            </linearGradient>
          </defs>
          <path d={outer} fill={`url(#${gradId})`} opacity={0.96} />
          <path d={mid} fill={p.inner} opacity={0.98} />
          <circle cx="50" cy="50" r="24" fill={p.inner} stroke={p.ring} strokeWidth="0.75" opacity={0.95} />
          <path d={smallStar(21, 50, 5)} fill="white" opacity={0.92} />
          <path d={smallStar(79, 50, 5)} fill="white" opacity={0.92} />
          <text
            x="50"
            y="13.5"
            textAnchor="middle"
            fill="white"
            fontSize="4.8"
            fontWeight="800"
            fontFamily="system-ui, Tajawal, sans-serif"
            letterSpacing="0.08em"
          >
            VERIFIED
          </text>
          <text
            x="50"
            y="91"
            textAnchor="middle"
            fill="white"
            fontSize="4.4"
            fontWeight="800"
            fontFamily="system-ui, Tajawal, sans-serif"
            letterSpacing="0.06em"
          >
            SKILL
          </text>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-0.5">
          <Icon className="h-7 w-7 text-white drop-shadow-md" strokeWidth={2.2} />
        </div>
        {verified ? (
          <div className="absolute -bottom-0.5 end-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md">
            <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
        ) : null}
      </div>
      <figcaption className="mt-3 max-w-[10rem] text-center">
        <p className="text-xs font-black leading-tight text-foreground">{title}</p>
        {subtitle ? <p className="mt-0.5 text-[10px] text-muted-foreground">{subtitle}</p> : null}
        <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-primary">
          {verified ? "موثّق على السلسلة" : "في انتظار التوثيق"}
        </p>
      </figcaption>
    </motion.figure>
  );
}
