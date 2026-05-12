"use client";

import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Bot,
  Gauge,
  Layers,
  Orbit,
  Repeat2,
  RefreshCw,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS: { n: number; title: string; body: string; Icon: LucideIcon }[] = [
  { n: 1, title: "اختبار تحديد المستوى", body: "نقطة انطلاق موضوعية قبل تخصيص المسار.", Icon: Target },
  { n: 2, title: "تجربة تعلم متعددة الوسائط", body: "شرائح، صوت، بطاقات، كويز، فيديو — داخل الفصل.", Icon: Layers },
  { n: 3, title: "جمع بيانات سلوك التعلم", body: "مدة الجلسات، التكرار، والتفاعل دون إزعاج الطالب.", Icon: Activity },
  { n: 4, title: "تحليل عبر سند (AI Agent)", body: "وكيل يربط الإشارات بالمعنى ضمن المنتج.", Icon: Bot },
  { n: 5, title: "تخصيص التجربة والتوصيات", body: "خطوات عملية وتنبيه المرشد البشري عند الحاجة.", Icon: SlidersHorizontal },
  { n: 6, title: "إثبات المهارات — الجواز المهاري", body: "أثر قابل للتحقق يربط الأداء بالمهارة.", Icon: Award },
  { n: 7, title: "تحديث مستوى الجاهزية", body: "إعادة معايرة بعد الجلسات والمحاكاة.", Icon: Gauge },
  { n: 8, title: "إعادة الدورة باستمرار", body: "حلقة مغلقة تتحسن مع كل أسبوع دراسة.", Icon: Repeat2 },
];

const N = STEPS.length;
const LOOP_DEFAULT_PX = 520;
const LOOP_ASIDE_PX = 380;
/** معرّف ثابت لتجنّب اختلاف useId بين SSR والعميل داخل مراجع url(#…) في SVG. */
const RING_GRADIENT_ID = "sanad-loop-ring-gradient";
/** أعلى طبقة للتلميح فوق البطاقات والـ modals العادية. */
const TOOLTIP_Z = "z-[2147483000]";

export type SanadLoopExplainerVariant = "default" | "aside";

export interface SanadLoopExplainerProps {
  /** `aside`: عمود بجانب نص (مثلاً Hero المرشد) — حلقة أصغر قليلاً بدون تغيير النسب. */
  variant?: SanadLoopExplainerVariant;
  className?: string;
}

export function SanadLoopExplainer({ variant = "default", className }: SanadLoopExplainerProps) {
  const isAside = variant === "aside";
  const loopPx = isAside ? LOOP_ASIDE_PX : LOOP_DEFAULT_PX;

  const boxStyle = {
    width: `min(92vw, ${loopPx}px)`,
    height: `min(92vw, ${loopPx}px)`,
    ["--arm" as string]: `calc(min(92vw, ${loopPx}px) * 0.36)`,
  } as CSSProperties;

  return (
    <section
      className={cn(
        "overflow-visible rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card/80 to-sky-500/[0.04] p-2.5 shadow-lg backdrop-blur-md md:p-3.5",
        isAside ? "mb-0 w-full max-w-none" : "mx-auto mb-8 max-w-[min(100%,38rem)] md:mb-10",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.04 }}
        className={cn("mb-3 flex flex-wrap items-center gap-2 md:gap-2.5", isAside && "mb-2")}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25",
            isAside ? "h-9 w-9" : "h-11 w-11",
          )}
        >
          <Orbit className={isAside ? "h-5 w-5" : "h-6 w-6"} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary md:text-xs">
            Closed Learning Intelligence Loop
          </p>
          <h2 className={cn("font-black text-foreground", isAside ? "text-lg md:text-xl" : "text-xl md:text-2xl")}>
            سند داخل حلقة تعلّم مغلقة
          </h2>
        </div>
      </motion.div>
      <p
        className={cn(
          "mb-4 max-w-2xl leading-relaxed text-muted-foreground",
          isAside ? "text-xs md:text-sm" : "text-sm md:text-base",
        )}
      >
        سند يُعرَض هنا كـ <span className="font-bold text-foreground">وكيل ذكاء (AI Agent)</span> مرتبط ببيانات المنصة:
        يقرأ ما يحدث في التعلّم، يفسّر، يقترح، ويُغذّي الجواز والجاهزية — وليس مجرد نافذة دردشة معزولة عن بقية أفق.
      </p>

      <div className="relative md:hidden">
        <div
          className="pointer-events-none absolute end-5 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/25 to-primary/50"
          aria-hidden
        />
        <ol className="relative space-y-3 pe-11">
          {STEPS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.03 * i }}
                className="relative"
              >
                <span className="absolute end-[1.125rem] top-2.5 flex h-7 w-7 translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background text-[10px] font-black text-primary shadow-sm">
                  {s.n}
                </span>
                <div className="rounded-xl border border-border/70 bg-background/70 p-3 text-start shadow-sm">
                  <p className="flex items-center gap-2 text-[13px] font-black text-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {s.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* دائرة: عُقد على المسار — section عادي + SVG بدون motion لتفادي أخطاء الترطيب */}
      <div className="relative mx-auto mb-0 hidden overflow-visible md:block" style={boxStyle}>
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/45"
          aria-hidden
        />

        <svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full text-primary/25"
          aria-hidden
        >
          <defs>
            <linearGradient id={RING_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke={`url(#${RING_GRADIENT_ID})`}
            strokeWidth="0.35"
            strokeDasharray="1.1 1.8"
          />
        </svg>

        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <motion.div
            className="flex h-0 w-0 items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            aria-hidden
          >
            <div
              className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300/90 shadow-[0_0_18px_7px_rgba(16,185,129,0.55)]"
              style={{ transform: "translateY(calc(-1 * var(--arm)))" }}
            />
          </motion.div>
        </div>

        {STEPS.map((s, i) => {
          const angleDeg = -90 + (i * 360) / N;
          const Icon = s.Icon;
          const transform = `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * var(--arm))) rotate(${-angleDeg}deg)`;

          return (
            <div
              key={s.n}
              className="absolute left-1/2 top-1/2 z-[5] flex h-[3.25rem] w-[3.25rem] items-center justify-center"
              style={{ transform }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * i, type: "spring", stiffness: 320, damping: 22 }}
                className="group relative"
              >
                <button
                  type="button"
                  aria-describedby={`loop-tip-${s.n}`}
                  aria-label={`${s.title}. ${s.body}`}
                  className={cn(
                    "relative flex h-[3.25rem] w-[3.25rem] flex-col items-center justify-center rounded-full",
                    "border-2 border-primary/55 bg-gradient-to-b from-card to-card/90 shadow-md ring-2 ring-primary/10",
                    "transition-[box-shadow,transform,border-color] hover:z-10 hover:scale-110 hover:border-primary hover:shadow-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  )}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem] text-primary" strokeWidth={2.25} />
                  <span className="mt-0.5 font-mono text-[9px] font-black leading-none text-foreground">{s.n}</span>
                </button>
                <div
                  id={`loop-tip-${s.n}`}
                  className={cn(
                    TOOLTIP_Z,
                    "pointer-events-none absolute bottom-full left-1/2 mb-2 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border/90 bg-card/98 px-2.5 py-2 text-start text-[10px] shadow-2xl backdrop-blur-md",
                    "invisible translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out",
                    "group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100",
                    "group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                  )}
                  role="tooltip"
                >
                  <p className="font-black text-foreground">{s.title}</p>
                  <p className="mt-1 leading-snug text-muted-foreground">{s.body}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className={cn("mt-4 flex items-center gap-2 text-muted-foreground md:mt-5", isAside ? "text-[10px]" : "text-[11px]")}>
        <RefreshCw className={cn("shrink-0 text-primary", isAside ? "h-3 w-3" : "h-3.5 w-3.5")} />
        الحلقة تعود من جديد مع كل دورة جاهزية — سند هو طبقة التفسير والقرار داخلها.
      </p>
    </section>
  );
}
