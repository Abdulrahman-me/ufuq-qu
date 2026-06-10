"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Headphones,
  Layers,
  Zap,
  Youtube,
  ThumbsUp,
  ThumbsDown,
  StickyNote,
  BookOpen,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** ١٣ جزءاً منطقياً (٠–١٢) مجمّعة في ٦ صفوف بصرياً — الانتقال يدوي فقط (لا مؤقت تلقائي) */
const BLOCK_PHASES: number[][] = [
  [0, 1],
  [2, 3],
  [4, 5, 6, 7, 8],
  [9, 10],
  [11],
  [12],
];

const NUM_BLOCKS = BLOCK_PHASES.length;

/** أول مرحلة منطقية داخل كل بطاقة عرض (للقفز بالأسهم) */
const BLOCK_START_PHASES = [0, 2, 4, 9, 11, 12];

type LessonTab = "explanation" | "podcast" | "flash" | "quiz" | "video";

const TAB_ORDER: { id: LessonTab; label: string; Icon: typeof FileText }[] = [
  { id: "explanation", label: "شرح الدرس", Icon: FileText },
  { id: "podcast", label: "صوتي", Icon: Headphones },
  { id: "flash", label: "بطاقات", Icon: Layers },
  { id: "quiz", label: "كويز", Icon: Zap },
  { id: "video", label: "فيديو", Icon: Youtube },
];

const STORIES: { title: string; body: string }[] = [
  {
    title: "هذه هي أفق",
    body: "من الصفحة الرئيسية تبدأ رحلة الطالب: هوية واضحة، ثم انتقال سريع إلى التعلّم الفعلي دون تعقيد.",
  },
  {
    title: "الدخول إلى التعلّم",
    body: "زر واحد يقودك إلى المنصة التعليمية حيث تُعرض موادك وفصولك كما في التطبيق الحقيقي.",
  },
  {
    title: "اختيار المادة",
    body: "تصفّح المواد واختر ما تدرسه الآن.",
  },
  {
    title: "اختيار الفصل",
    body: "بعد المادة تختار فصلاً محدداً — هنا «الفصل 2: الأشجار الثنائية» — لتحميل المحتوى المولَّد والواجهة الكاملة.",
  },
  {
    title: "شرح الدرس",
    body: "يمينا منطقة الشرائح مع نصوص تعليمية ؛ يسارا يبدأ شريط التبويبات من «شرح الدرس».",
  },
  {
    title: "التبويب: صوتي",
    body: "ينتقل التمييز البصري إلى «صوتي» لتجربة الاستماع دون مغادرة .",
  },
  {
    title: "التبويب: بطاقات",
    body: "نفس المنطقة تتحول لمراجعة بطاقات سريعة؛ مثالي للتثبيت قبل الامتحان.",
  },
  {
    title: "التبويب: كويز",
    body: "الكويز يقيّم الفهم لحظياً ويغذي سند والتقارير بسلوك حقيقي أثناء الجلسة.",
  },
  {
    title: "التبويب: فيديو",
    body: "فيديوهات مقترحة تكمّل الشرح النصي والصوتي عندما تحتاج منظوراً بصرياً أغنى.",
  },
  {
    title: "إعجاب وعدم إعجاب",
    body: "تقييمك يُسجَّل بشفافية. زر «عدم الإعجاب» يوجّه المنصة: عند تراكم الإشارات السلبية يعيد الذكاء الاصطناعي صياغة المحتوى بجودة أعلى لنفس الفقرة أو الدرس.",
  },
  {
    title: "الملاحظات",
    body: "تدوين ملاحظاتك داخل الجلسة يحفظ سياقك — مثلاً نقطة تحتاج مراجعة لاحقاً  ",
  },
  {
    title: "تقرير نهاية الجلسة",
    body: "عند «إنهاء الجلسة» يعرض النظام تقريراً أدقّ: مدة الجلسة، التبويبات المستخدمة، التفاعل مع الشرائح والكويز، التقييمات، وملخصاً ذكائياً بتوصيات للخطوة التالية.",
  },
  {
    title: "جرّب المنصة الحقيقية",
    body: "هذا التدفق مبني على منطق واجهة التعلّم الفعلية. ادخل للمنصة واختبره بنفسك.",
  },
];

function stepToBlockSub(globalPhase: number): { block: number; sub: number } {
  if (globalPhase <= 1) return { block: 0, sub: globalPhase };
  if (globalPhase <= 3) return { block: 1, sub: globalPhase - 2 };
  if (globalPhase <= 8) return { block: 2, sub: globalPhase - 4 };
  if (globalPhase <= 10) return { block: 3, sub: globalPhase - 9 };
  if (globalPhase === 11) return { block: 4, sub: 0 };
  return { block: 5, sub: 0 };
}

/** كل بطاقة تعرض دائماً واجهة حقيقية: مكتملة = آخر مرحلة في البطاقة، لم تُعرض بعد = أول مرحلة فيها */
function getPhaseForBlock(blockIdx: number, globalPhase: number): number {
  const { block, sub } = stepToBlockSub(globalPhase);
  const arr = BLOCK_PHASES[blockIdx]!;
  if (blockIdx < block) return arr[arr.length - 1]!;
  if (blockIdx > block) return BLOCK_START_PHASES[blockIdx]!;
  return arr[sub]!;
}

function phaseToActiveTab(phase: number): LessonTab | null {
  if (phase >= 4 && phase <= 8) return TAB_ORDER[phase - 4]!.id;
  if (phase >= 9 && phase <= 10) return "video";
  return null;
}

function SlidePlaceholder() {
  return (
    <div className="flex h-full min-h-[128px] flex-col gap-2 rounded-lg border border-zinc-200/90 bg-white p-3 text-[9px] leading-relaxed text-zinc-700 shadow-inner dark:border-zinc-300/80 dark:bg-zinc-50 dark:text-zinc-800">
      <div className="space-y-1.5">
        <div className="h-2 w-[72%] animate-pulse rounded bg-zinc-200/90 dark:bg-zinc-200" />
        <div className="h-2 w-full rounded bg-zinc-100 dark:bg-zinc-100/90" />
        <div className="h-2 w-[88%] rounded bg-zinc-100 dark:bg-zinc-100/90" />
        <div className="h-2 w-[64%] rounded bg-zinc-100 dark:bg-zinc-100/90" />
      </div>
      <p className="mt-1 font-semibold text-zinc-800 dark:text-zinc-900">
        مقدمة: الشجرة الثنائية (Binary Tree)
      </p>
      <p className="text-[8.5px] text-zinc-600 dark:text-zinc-700">
        كل عقدة تمتلك على الأكثر فرعاً أيمن وأيسر. الارتفاع يقاس من الجذر إلى أبعد ورقة…
      </p>
      <p className="mt-auto text-[8px] font-medium text-zinc-400">جاري مزامنة الشرائح…</p>
    </div>
  );
}

function ScreenChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="rounded-[1.25rem] border border-border/80 bg-gradient-to-b from-zinc-800 to-zinc-950 p-2 shadow-2xl shadow-black/40 md:rounded-[1.75rem] md:p-3 dark:from-zinc-900 dark:to-black">
        <div className="mb-2 flex items-center gap-1.5 px-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
          <span className="mr-auto text-[10px] font-medium text-zinc-500">afaq.app / learn</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/5 bg-background md:rounded-xl">
          {children}
        </div>
      </div>
      <div className="mx-auto mt-2 h-2 w-[55%] rounded-b-xl bg-zinc-800/90 dark:bg-zinc-900" />
    </div>
  );
}

function TabBar({ activeTab }: { activeTab: LessonTab }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-muted/30 p-1.5">
      {TAB_ORDER.map((t) => {
        const active = t.id === activeTab;
        return (
          <span
            key={t.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-all duration-500 ease-out",
              active
                ? "border border-primary/45 bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                : "border border-transparent bg-transparent text-muted-foreground",
            )}
          >
            <t.Icon className="h-3 w-3 shrink-0" />
            {t.label}
          </span>
        );
      })}
    </div>
  );
}

function LessonRightPanel({
  activeTab,
  phase,
  noteText,
}: {
  activeTab: LessonTab;
  phase: number;
  noteText: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <TabBar activeTab={activeTab} />
      <div className="flex-1 overflow-auto p-2">
        {activeTab === "explanation" && (
          <p className="text-[10px] leading-relaxed text-foreground md:text-[11px]">
            ملخص الدرس: مفاهيم الشجرة الثنائية، الإدراج، والمرور In-order مع أمثلة قصيرة.
          </p>
        )}
        {activeTab === "podcast" && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-foreground">بودكاست الفصل</p>
            <div className="flex h-12 items-end gap-1">
              {[10, 22, 14, 28, 18, 32, 12, 24].map((base, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-t bg-primary/55"
                  initial={{ height: base }}
                  animate={{ height: [base, base + 14, base + 4, base + 18, base] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground">استمع إلى تلخيص صوتي — مثال داخل المحاكاة.</p>
          </div>
        )}
        {activeTab === "flash" && (
          <div className="rounded-lg border border-border bg-muted/20 p-2 text-center">
            <p className="text-[9px] font-bold text-muted-foreground">بطاقة ٣ / ١٢</p>
            <p className="mt-2 text-xs font-black text-foreground">ما هو عمق الشجرة؟</p>
            <p className="mt-1 text-[9px] text-muted-foreground">اضغط للكشف عن الجواب في المنصة الحقيقية</p>
          </div>
        )}
        {activeTab === "quiz" && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-foreground">سؤال ٢ من ٧</p>
            <p className="text-[10px] text-foreground">في شجرة ممتلئة ارتفاعها h، أقصى عدد عقد عند المستوى الأخير؟</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {["٢^هـ", "هـ", "هـ−١", "٢هـ"].map((x) => (
                <span
                  key={x}
                  className="rounded-md border border-border bg-card px-2 py-1 text-[9px] font-bold text-muted-foreground"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        )}
        {activeTab === "video" && (
          <div className="aspect-video rounded-lg border border-border bg-zinc-900/90 p-2">
            <div className="flex h-full items-center justify-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-300">
              معاينة فيديو مقترح
            </div>
          </div>
        )}

        {phase >= 9 && phase <= 10 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("mt-3 space-y-2", phase === 10 && "rounded-lg border border-primary/25 bg-primary/5 p-2")}
          >
            {phase >= 9 && (
              <div className="rounded-lg border border-border bg-muted/40 p-2">
                <p className="mb-2 text-[9px] font-bold text-foreground">تقييم هذا الجزء من الدرس</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ThumbsUp className="h-3 w-3" />
                    إعجاب
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-700 dark:text-rose-400">
                    <ThumbsDown className="h-3 w-3" />
                    عدم إعجاب
                  </span>
                </div>
                <p className="mt-2 text-[8px] leading-relaxed text-muted-foreground">
                  عند ازدياد «عدم الإعجاب» على نفس المقطع، يُعاد توليد المحتوى تلقائياً بصياغة أوضح وأقرب لأسلوبك
                  — دون مشاركة هويتك في التقييم.
                </p>
              </div>
            )}
            {phase >= 10 && (
              <div className="rounded-lg border border-border p-2">
                <div className="mb-1 flex items-center gap-1 text-[10px] font-bold text-foreground">
                  <StickyNote className="h-3 w-3" />
                  ملاحظات
                </div>
                <div className="min-h-[3.25rem] rounded border border-border/80 bg-white p-2 font-mono text-[10px] text-foreground dark:bg-zinc-950">
                  {noteText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DemoScreen({ phase, noteText }: { phase: number; noteText: string }) {
  const activeTab = phaseToActiveTab(phase);

  return (
    <AnimatePresence mode="wait">
      {phase === 0 && (
        <motion.div
          key="p0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-background to-muted/30 p-6 text-center"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-primary/30 bg-primary/10 px-8 py-3 text-sm font-black text-primary"
          >
            أفق
          </motion.div>
          <p className="max-w-xs text-xs text-muted-foreground">شاهد كيف تتحول الصفحة الرئيسية إلى جلسة تعلم متكاملة.</p>
        </motion.div>
      )}

      {phase === 1 && (
        <motion.div
          key="p1"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex h-full flex-col items-center justify-center gap-6 bg-background p-6"
        >
          <p className="text-sm font-bold text-foreground">مرحباً بك في أفق</p>
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-8 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/30"
          >
            انتقل للمنصة التعليمية
          </motion.div>
        </motion.div>
      )}

      {(phase === 2 || phase === 3) && (
        <motion.div
          key="subjects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full overflow-auto bg-background p-4"
        >
          <p className="mb-3 text-xs font-bold text-muted-foreground">المواد</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {["برمجة 1", "هياكل البيانات", "قواعد البيانات", "هندسة البرمجيات"].map((n) => (
              <div
                key={n}
                className={cn(
                  "rounded-xl border p-3 text-sm font-bold transition-all duration-500",
                  phase === 3 && n === "هياكل البيانات"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : phase === 2 && n === "هياكل البيانات"
                      ? "border-primary/50 bg-muted/50"
                      : "border-border bg-card",
                )}
              >
                {n}
                {n === "هياكل البيانات" && phase === 3 && (
                  <p className="mt-1 text-[10px] font-normal text-muted-foreground">الفصل 2 — الأشجار الثنائية</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {phase >= 4 && phase <= 10 && activeTab && (
        <motion.div
          key="lesson"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative flex h-full flex-col text-[10px] md:text-[11px]"
        >
          <div className="flex border-b border-border bg-muted/40 px-2 py-1.5">
            <span className="truncate font-bold text-foreground">هياكل البيانات · الفصل 2</span>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1.12fr_1fr]">
            <div className="border-b border-border bg-muted/20 p-2 md:border-b-0 md:border-e">
              <p className="mb-1 font-bold text-muted-foreground">السلايدات</p>
              <SlidePlaceholder />
            </div>
            <LessonRightPanel activeTab={activeTab} phase={phase} noteText={noteText} />
          </div>
          {phase >= 4 && phase < 11 && (
            <div className="absolute end-2 top-8 z-10 md:top-2">
              <span className="rounded-lg bg-destructive/90 px-2 py-1 text-[9px] font-bold text-destructive-foreground shadow">
                إنهاء الجلسة
              </span>
            </div>
          )}
        </motion.div>
      )}

      {phase === 11 && (
        <motion.div
          key="report"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full flex-col bg-muted/30"
        >
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl">
              <p className="text-sm font-black text-foreground">تقرير الجلسة</p>
              <p className="mt-1 text-[10px] text-muted-foreground">بعد إنهاء الجلسة — ملخص دقيق كما يظهر للطالب</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-3 text-[10px] leading-relaxed text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">المدة:</span> حوالي ٢٤ دقيقة (من بدء الفصل حتى الإنهاء)
                </li>
                <li>
                  <span className="font-bold text-foreground">الشرائح:</span> عُرض ٨ من ١٢ شريحة؛ توقف أطول عند شرائح
                  «الإدراج» و«الارتفاع»
                </li>
                <li>
                  <span className="font-bold text-foreground">التبويبات:</span> شرح نصي، صوتي، بطاقات (تمرير ٤ بطاقات)،
                  كويز (٧ أسئلة، ٥ إجابات صحيحة)، فيديو (معاينة ٢ دقيقة)
                </li>
                <li>
                  <span className="font-bold text-foreground">التقييم:</span> إعجاب على الشرح النصي؛ لا إشارات «عدم
                  إعجاب» في هذه الجلسة
                </li>
                <li>
                  <span className="font-bold text-foreground">الملاحظات:</span> تم حفظ ملاحظة واحدة مرتبطة بالفصل
                </li>
                <li>
                  <span className="font-bold text-foreground">ملخص ذكي:</span> التركيز على «الأشجار الثنائية» و«الكومة
                  الثنائية»؛ يُنصح بمراجعة التمرين ٣ قبل الجلسة القادمة
                </li>
              </ul>
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-gradient-to-l from-[#1B8354] to-[#25935F] py-2.5 text-xs font-bold text-primary-foreground"
              >
                حفظ التقرير وإغلاق
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {phase === 12 && (
        <motion.div
          key="p12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 via-background to-sky-500/5 p-6"
        >
          <p className="text-center text-sm font-bold text-foreground">نفس التدفق في المنصة الحقيقية</p>
          <Link
            href="/learn"
            className="rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25"
          >
            ادخل المنصة التعليمية
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DemoBlockRow({
  blockIndex,
  globalPhase,
  noteText,
  onPrevPhase,
  onNextPhase,
  canGoPrev,
  canGoNext,
}: {
  blockIndex: number;
  globalPhase: number;
  noteText: string;
  onPrevPhase: () => void;
  onNextPhase: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}) {
  const displayPhase = getPhaseForBlock(blockIndex, globalPhase);
  const { block } = stepToBlockSub(globalPhase);
  const isActive = block === blockIndex;
  const story = STORIES[displayPhase]!;
  const visualFirst = blockIndex % 2 === 0;

  const blockLabel =
    blockIndex === 0
      ? "المرحلة ١ — البداية والدخول"
      : blockIndex === 1
        ? "المرحلة ٢ — المادة والفصل"
        : blockIndex === 2
          ? "المرحلة ٣ — جولة التبويبات"
          : blockIndex === 3
            ? "المرحلة ٤ — التقييم والملاحظات"
            : blockIndex === 4
              ? "المرحلة ٥ — التقرير"
              : "المرحلة ٦ — الختام";

  return (
    <motion.div
      layout
      id={`platform-demo-block-${blockIndex}`}
      className={cn(
        "relative scroll-mt-28 rounded-3xl border border-border/60 bg-card/25 p-6 shadow-sm backdrop-blur-md transition-[box-shadow] duration-500 md:p-10",
        isActive && "ring-2 ring-primary/25 shadow-lg shadow-primary/5",
      )}
    >
      {isActive ? (
        <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-2" dir="ltr">
          <motion.button
            type="button"
            whileHover={{ scale: canGoPrev ? 1.06 : 1 }}
            whileTap={{ scale: canGoPrev ? 0.94 : 1 }}
            onClick={onPrevPhase}
            disabled={!canGoPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-35"
            aria-label="الجزء السابق في الجولة (١٣ جزءاً)"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: canGoNext ? 1.06 : 1 }}
            whileTap={{ scale: canGoNext ? 0.94 : 1 }}
            onClick={onNextPhase}
            disabled={!canGoNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-lg backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:pointer-events-none disabled:opacity-35"
            aria-label="الجزء التالي في الجولة (١٣ جزءاً)"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        </div>
      ) : null}

      <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-wider text-primary md:text-right">
        {blockLabel}
      </p>
      <div
        className={cn(
          "grid items-center gap-8 pb-14 lg:grid-cols-2 lg:gap-12 lg:pb-10",
        )}
      >
        <div className={cn("min-w-0", !visualFirst && "lg:order-2")}>
          <ScreenChrome>
            <DemoScreen phase={displayPhase} noteText={noteText} />
          </ScreenChrome>
        </div>
        <div className={cn("flex flex-col justify-center", !visualFirst && "lg:order-1")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={displayPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm backdrop-blur-sm md:p-8"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                جزء {displayPhase + 1} من ١٣
              </p>
              <h3 className="mt-2 text-xl font-black text-foreground md:text-2xl">{story.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{story.body}</p>
            </motion.div>
          </AnimatePresence>
          <Link
            href="/learn"
            className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-bold text-primary underline-offset-4 hover:underline"
          >
            افتح المنصة التعليمية
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const TOTAL_DEMO_PARTS = 13;
const LAST_PART_INDEX = TOTAL_DEMO_PARTS - 1;

export function LandingProductDemo() {
  const [phase, setPhase] = useState(0);
  const [noteText, setNoteText] = useState("");
  const skipScrollOnMount = useRef(true);

  const goPrevPhase = () => setPhase((p) => Math.max(0, p - 1));
  const goNextPhase = () => setPhase((p) => Math.min(LAST_PART_INDEX, p + 1));
  const canGoPrev = phase > 0;
  const canGoNext = phase < LAST_PART_INDEX;

  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    const { block } = stepToBlockSub(phase);
    const el = document.getElementById(`platform-demo-block-${block}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  }, [phase]);

  useEffect(() => {
    if (phase !== 10) {
      setNoteText("");
      return;
    }
    const full = "ملاحظة: فقرة الكومة الثنائية تحتاج مراجعة غداً — أراجع التمرين ٣.";
    let i = 0;
    const id = setInterval(() => {
      i++;
      setNoteText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <section
      id="platform-demo"
      className="relative scroll-mt-24 border-y border-border/60 bg-muted/20 px-4 py-20 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--primary)/0.04),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center md:text-right"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            جولة داخل المنتج
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            المنصة التعليمية 
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mx-0">
تعرف على رحلة الطالب داخل المنصة عبر محطات محاكاة واقعية، تغطي كافة مراحل التعلم من اختيار المادة وحتى استلام التقرير النهائي.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-20">
          {Array.from({ length: NUM_BLOCKS }, (_, blockIndex) => (
            <DemoBlockRow
              key={blockIndex}
              blockIndex={blockIndex}
              globalPhase={phase}
              noteText={noteText}
              onPrevPhase={goPrevPhase}
              onNextPhase={goNextPhase}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
