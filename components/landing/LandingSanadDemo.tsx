"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  CalendarCheck,
  GraduationCap,
  MessageCircle,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BubbleRole = "sanad" | "student";

function ChatBubble({
  role,
  children,
  className,
}: {
  role: BubbleRole;
  children: ReactNode;
  className?: string;
}) {
  const isSanad = role === "sanad";
  return (
    <div
      className={cn(
        "max-w-[95%] rounded-2xl px-2.5 py-2 text-[9px] leading-relaxed md:text-[10px]",
        isSanad
          ? "ms-0 me-auto border border-primary/20 bg-primary/10 text-foreground"
          : "ms-auto me-0 border border-border bg-muted/80 text-foreground",
        isSanad ? "rounded-se-md" : "rounded-ss-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ScenarioMessage =
  | { key: string; type: "bubble"; role: BubbleRole; content: ReactNode; bubbleClassName?: string }
  | { key: string; type: "block"; content: ReactNode };

type CoverConfig = {
  name: string;
  roleLabel: string;
  hint: string;
  accent: "primary" | "amber" | "sky";
  Icon: typeof Sparkles;
};

/** ارتفاع موحّد لكل البطاقات (مساوٍ لأطول محتوى تقريباً)؛ المساحة الفارغة تبقى أسفل فقاعات القصيرة */
const SANAD_CARD_MIN_HEIGHT = "min-h-[34rem] md:min-h-[36rem]";

function SanadScenarioCard({
  cover,
  messages,
  footerHint,
  className,
}: {
  cover: CoverConfig;
  messages: ScenarioMessage[];
  footerHint?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = cover.Icon;

  const accentRing =
    cover.accent === "primary"
      ? "from-white/30 to-white/10 ring-white/40"
      : cover.accent === "amber"
        ? "from-white/30 to-white/10 ring-white/35"
        : "from-white/30 to-white/10 ring-white/35";

  const coverGradient =
    cover.accent === "primary"
      ? "bg-gradient-to-br from-slate-800 via-emerald-950 to-slate-950"
      : cover.accent === "amber"
        ? "bg-gradient-to-br from-stone-800 via-amber-950 to-neutral-950"
        : "bg-gradient-to-br from-slate-800 via-sky-950 to-slate-950";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-md shadow-black/5 backdrop-blur-md",
        SANAD_CARD_MIN_HEIGHT,
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* طبقة الدردشة (خلف الغطاء) */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-muted/35 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-black text-foreground md:text-xs">سند</p>
            <p className="text-[8px] text-muted-foreground md:text-[9px]">محادثة مباشرة</p>
          </div>
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500/90" title="متصل" />
        </div>

        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col justify-start gap-2 overflow-y-auto p-2.5">
          {messages.map((msg, index) => {
            const delay = 0.06 + index * 0.14;
            return (
              <motion.div
                key={msg.key}
                initial={false}
                animate={
                  hovered
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 12, scale: 0.98 }
                }
                transition={{
                  duration: 0.38,
                  delay: hovered ? delay : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {msg.type === "bubble" ? (
                  <ChatBubble role={msg.role} className={msg.bubbleClassName}>
                    {msg.content}
                  </ChatBubble>
                ) : (
                  msg.content
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-border/50 bg-muted/20 px-2.5 py-2">
          <motion.div
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-2 py-1.5"
          >
            <div className="h-6 flex-1 rounded-lg bg-muted/40" />
            <div className="h-6 w-6 shrink-0 rounded-lg bg-primary/20" />
          </motion.div>
          {footerHint ? <p className="mt-1.5 text-center text-[8px] text-muted-foreground">{footerHint}</p> : null}
        </div>
      </div>

      {/* غطاء الطالب */}
      <AnimatePresence>
        {!hovered && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute inset-0 z-20 flex cursor-default flex-col text-white opacity-100 shadow-inner",
              coverGradient,
            )}
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5 text-center">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ring-2 ring-inset",
                  accentRing,
                )}
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-white drop-shadow-sm">{cover.name}</p>
                <p className="text-[11px] font-semibold text-white/85">{cover.roleLabel}</p>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-white/35 bg-white/25 px-3 py-2.5 text-start backdrop-blur-[2px]">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                <p className="text-[10px] leading-relaxed text-white">{cover.hint}</p>
              </div>
              <p className="text-[9px] font-semibold text-white">مرّر المؤشر لبدء المحاكاة</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* عند الـ hover: طبقة شفافة تمنع الوميض إن لمس المستخدم الحافة */}
      {hovered ? (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-1 ring-inset ring-primary/15" />
      ) : null}
    </div>
  );
}

export function LandingSanadDemo() {
  return (
    <section
      id="sanad-demo"
      className="relative scroll-mt-24 border-y border-border/60 bg-gradient-to-b from-background via-muted/15 to-background px-4 py-20 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:text-right"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <MessageCircle className="h-3.5 w-3.5" />
            محاكاة سند
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              ذكاء اصطناعي يدرك اختلافك، ويصيغ استجابته لتناسب نمطك الدراسي..
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mx-0">
            كل بطاقة تعرض ملفاً بسيطاً للطالب؛ عند تمرير المؤشر يختفي الغطاء وتُعرض محادثة سند مع فقاعات تظهر بالتتابع —
            دون تحريك البطاقة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch md:gap-6 lg:gap-8">
          <div className="flex h-full flex-col space-y-2">
            <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              طالب متفوّق
            </div>
            <SanadScenarioCard
              className="flex-1"
              cover={{
                name: "وجود السفياني",
                roleLabel: "طالبة متفوّقة — علوم حاسب",
                hint: "سند يثني على أدائك المستقر ويقترح مشاريع وشهادات احترافية تلائم تخصصك.",
                accent: "primary",
                Icon: Sparkles,
              }}
              footerHint="محاكاة — الفقاعات تظهر تدريجياً بعد إزالة الغطاء"
              messages={[
                {
                  key: "m1",
                  type: "bubble",
                  role: "sanad",
                  content: (
                    <>
                      <span className="mb-1 flex items-center gap-1 font-bold text-primary">
                        <Bot className="h-3 w-3" /> سند
                      </span>
                      أداؤك في تحليل الخوارزميات فوق المتوسط بثبات. أنصحك بمشروع تطبيقي صغير (مثلاً مقارنة هياكل
                      التخزين على بيانات حقيقية) يظهر في سيرتك، أو بشهادة احترافية مثل مسار AWS أو Google Cloud حسب
                      تخصصك — أجهز لك خطة أسبوعين إذا حاب.
                    </>
                  ),
                },
                {
                  key: "m2",
                  type: "bubble",
                  role: "student",
                  content: (
                    <>
                      <span className="mb-1 flex items-center justify-end gap-1 font-bold text-muted-foreground">
                        وجود <UserRound className="h-3 w-3" />
                      </span>
                      يعطيك العافية — أحب فكرة المشروع، وش الخطوة الأولى؟
                    </>
                  ),
                },
                {
                  key: "m3",
                  type: "bubble",
                  role: "sanad",
                  content: (
                    <>
                      ابدأ بمسودة متطلبات (مدخلات/مخرجات وقياس زمن التشغيل)، وأرسلها هنا أراجعها معك قبل التنفيذ.
                    </>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex h-full flex-col space-y-2">
            <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Shield className="h-3.5 w-3.5" />
              طالب متوسط
            </div>
            <SanadScenarioCard
              className="flex-1"
              cover={{
                name: "عمر الشهري",
                roleLabel: "طالب متوسط — يحتاج إيقاعاً أنسب",
                hint: "سند يكيّف واجهة التعلم، يشرح نقاط الضعف، ويستخدم مقارنة بالأقران ووسام الالتزام في الجواز.",
                accent: "amber",
                Icon: Shield,
              }}
              footerHint="أوسمة الالتزام في الجواز تربط التقدم بالحفاظ على الإنجاز"
              messages={[
                {
                  key: "m1",
                  type: "bubble",
                  role: "sanad",
                  content: (
                    <>
                      لاحظت تركيزك أعلى مع الجلسات القصيرة. ضبطت لك واجهة التعلم على جلسات ٢٥ دقيقة مع تذكير خفيف،
                      وشرحت لك نقطة الضعف في آخر كويز بملخص صفحة واحدة — اقرأها لما تكون فاضي.
                    </>
                  ),
                },
                {
                  key: "m2",
                  type: "bubble",
                  role: "sanad",
                  bubbleClassName: "border-amber-500/30 bg-amber-500/5",
                  content: (
                    <>
                      <p className="mb-1 text-[8px] font-black uppercase text-amber-800 dark:text-amber-300">
                        مقارنة بالأقران
                      </p>
                      حوالي ٨٠٪ من زملائك الذين يستهدفون نفس نوع الشركات تجاوزوا فصل تحليل الخوارزميات اليوم. مو لازم
                      تضغط نفسك بذنب — بس هل تختار البقاء في المؤخرة ولا خطوة صغيرة الآن؟
                    </>
                  ),
                },
                {
                  key: "m3",
                  type: "block",
                  content: (
                    <div className="mx-auto max-w-[92%] rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-transparent p-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[8px] font-black text-amber-900 dark:text-amber-200">
                          وسام الالتزام · الجواز المهاري
                        </p>
                        <span className="rounded-full bg-amber-500/25 px-1.5 py-0.5 text-[7px] font-bold text-amber-900 dark:text-amber-100">
                          ٣ أيام
                        </span>
                      </div>
                      <p className="mt-1 text-[8px] leading-relaxed text-muted-foreground">
                        أوشكت تفقد بريق الوسام. مراجعة ٥ دقائق الآن تحمي تقدمك — الخسارة تؤلم أكثر من فرصة ربح جديدة،
                        فخلّينا نحمي ما بنيته.
                      </p>
                      <div className="mt-2 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full",
                              i <= 3 ? "bg-amber-500/70" : "bg-muted-foreground/20",
                            )}
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-[7px] text-muted-foreground">مع الانقطاع يخفت لون الوسام تدريجياً في الجواز.</p>
                    </div>
                  ),
                },
                {
                  key: "m4",
                  type: "bubble",
                  role: "student",
                  content: (
                    <>
                      <span className="mb-1 flex items-center justify-end gap-1 font-bold text-muted-foreground">
                        عمر <UserRound className="h-3 w-3" />
                      </span>
                      واضح… بجرب الجلسة القصيرة اليوم.
                    </>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex h-full flex-col space-y-2">
            <div className="flex items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              <UserRound className="h-3.5 w-3.5" />
              مرحلة مبتدئ
            </div>
            <SanadScenarioCard
              className="flex-1"
              cover={{
                name: "متعب العتيبي",
                roleLabel: "طالب مبتدئ — يحتاج دعماً واضحاً",
                hint: "سند يواسي دون إدانة، يخفف الخطة، ويحجز لك موعداً مع المرشد الأكاديمي البشري.",
                accent: "sky",
                Icon: UserRound,
              }}
              footerHint="سند يرفع المعنويات ويرتّب موعداً مع المرشد الأكاديمي"
              messages={[
                {
                  key: "m1",
                  type: "bubble",
                  role: "student",
                  content: (
                    <>
                      <span className="mb-1 flex items-center justify-end gap-1 font-bold text-muted-foreground">
                        متعب <UserRound className="h-3 w-3" />
                      </span>
                      ما أدري وش أسوي، الحمل ثقيل وما ألحق، وخايف أخسر الترم…
                    </>
                  ),
                },
                {
                  key: "m2",
                  type: "bubble",
                  role: "sanad",
                  content: (
                    <>
                      أسمعك، وما راح أحكم عليك. اللي تحسه صعب حقيقي، وما يعني إنك فاشل — يعني إنك محتاج نفسة وخطة أوضح
                      مو ضغط أكثر.
                    </>
                  ),
                },
                {
                  key: "m3",
                  type: "bubble",
                  role: "sanad",
                  content: (
                    <>
                      خلينا نخفف: اليوم بس اختار أصغر مهمة (نص ساعة)، والباقي نؤجله. أنا رتبت لك موعداً اختيارياً مع
                      المرشد الأكاديمي البشري يوم الخميس ٤ عصراً — تقدر تؤكد أو تغيّر من الرابط.
                    </>
                  ),
                },
                {
                  key: "m4",
                  type: "block",
                  content: (
                    <div className="mx-auto flex max-w-[92%] items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/5 px-2 py-2">
                      <CalendarCheck className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
                      <div>
                        <p className="text-[8px] font-black text-foreground">موعد مرشد أكاديمي</p>
                        <p className="text-[8px] text-muted-foreground">خميس ٤:٠٠ م — تأكيد من سند</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "m5",
                  type: "bubble",
                  role: "student",
                  content: (
                    <>
                      <span className="mb-1 flex items-center justify-end gap-1 font-bold text-muted-foreground">
                        متعب <UserRound className="h-3 w-3" />
                      </span>
                      يعطيك العافية… بجرب أرتب نفسي على خطوتك.
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-12 flex flex-col items-center gap-3 border-t border-border/50 pt-10 text-center md:flex-row md:justify-between md:text-right"
        >
          <p className="max-w-xl text-sm text-muted-foreground">
            التجربة الكاملة مع ذاكرة وسياقك في صفحة سند. الجواز المهاري يعرض أوسمة المهارات وأوسمة الالتزام بحيث يبقى
            الإنجاز مرئياً — والخوف من خسارة التقدم يدفع للمحافظة عليه.
          </p>
          <Link
            href="/sanad"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
          >
            افتح سند
            <MessageCircle className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
