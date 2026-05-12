"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Bot,
  Building2,
  Code2,
  Database,
  Fingerprint,
  Link2,
  Shield,
  Sparkles,
} from "lucide-react";
import { SHOWCASE_BADGES, SHOWCASE_ICONS } from "@/lib/passport/showcaseBadges";
import { paletteIndexForSkill, VerifiedSealBadge } from "@/components/passport/VerifiedSealBadge";

const floatSlow = {
  y: [0, -10, 0],
  rotate: [0, 1.5, 0],
};

export function LandingPassportDemo() {
  const demo1 = SHOWCASE_BADGES[0]!;
  const demo1Icon = SHOWCASE_ICONS[demo1.iconKey];
  const v1 = demo1.variant;
  const v2 = paletteIndexForSkill("Software Engineering");
  const v3 = paletteIndexForSkill("Databases");

  return (
    <section
      id="passport-demo"
      className="relative scroll-mt-24 overflow-hidden border-y border-border/50 bg-gradient-to-b from-violet-950/[0.03] via-background to-background px-4 py-24 md:px-8"
    >
      <div
        className="pointer-events-none absolute -start-24 top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -end-16 bottom-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center md:text-right"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">
            <Fingerprint className="h-3.5 w-3.5" />
            الجواز المهاري الرقمي
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
            إثبات مهاراتك — لا قائمة طويلة من المزاعم
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mx-0">
            محاكاة بصرية مختلفة: عناصر عائمة، أختام، وربط بالسلسلة — بأسلوب يميز هذا القسم عن جولة المنصة ومحاكاة سند.
          </p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* نصوص */}
          <div className="space-y-5">
            {[
              {
                icon: Bot,
                title: "توثيق حقيقي للمهارات",
                body:
                  "الجواز يجمع بين تحليل أدائك في المنصة، ومساهمات يمكن أن يدعمها الخريجون والمؤسسات الموثوقة، مع مساعدة الذكاء الاصطناعي في ربط الأدلة بالمهارة — لمعالجة تضخم السير الذاتية وقوائم المهارات غير القابلة للتحقق.",
              },
              {
                icon: Shield,
                title: "أختام على السلسلة",
                body:
                  "الأوسمة تُسجَّل على البلوكتشين (مثل Polygon) لمنح مصداقية قابلة للتحقق علناً، وتقليل تزوير المهارات أو تعديلها يدوياً بعد الإصدار.",
              },
              {
                icon: Link2,
                title: "تحقق للجهات",
                body:
                  "صاحب العمل أو المنصة يمكنه التحقق من المعاملة أو العقد عبر مستكشف الشبكة دون الاعتماد على ملفات PDF قابلة للتلاعب.",
              },
              {
                icon: Sparkles,
                title: "متصل بمسارك في أفق",
                body:
                  "الجاهزية في المواد، جلسات سند، والالتزام بالتعلم يغذّي صورة موحّدة لمهاراتك — بما في ذلك أوسمة الالتزام التي تعكس استمرارك وليس مجرد لقطة لحظة.",
              },
              {
                icon: Building2,
                title: "سيرة رقمية محمولة",
                body:
                  "بدلاً من نسخ متعددة من السيرة، يبقى الجواز مرجعاً واحداً يمكن مشاركته مع رابط أو إثبات على السلسلة يثبت المطابقة بين الهوية والإنجاز.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="group relative rounded-2xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md md:p-5"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* عائم: أختام + بطاقات */}
          <div className="relative mx-auto flex min-h-[420px] w-full max-w-md flex-col items-center justify-center lg:max-w-none">
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-[2rem] border border-dashed border-violet-500/20 bg-gradient-to-br from-violet-500/[0.04] to-transparent"
              animate={{ opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute start-[8%] top-[6%] z-10 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-[10px] font-bold shadow-lg backdrop-blur-md md:text-[11px]"
              animate={floatSlow}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-emerald-600 dark:text-emerald-400">●</span> Polygon · موثّق
            </motion.div>

            <motion.div
              className="absolute end-[4%] top-[22%] z-10 rounded-xl border border-border/50 bg-card/90 px-2.5 py-1.5 text-[9px] font-mono text-muted-foreground shadow-md backdrop-blur-sm"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              0x71…3a9 ✓
            </motion.div>

            <div className="relative z-[1] flex flex-wrap items-center justify-center gap-8 py-8">
              <motion.div
                animate={floatSlow}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <VerifiedSealBadge
                  title={demo1.skill_name.length > 20 ? `${demo1.skill_name.slice(0, 18)}…` : demo1.skill_name}
                  subtitle={`موثّق · ${demo1.issuer}`}
                  Icon={demo1Icon}
                  variant={v1}
                  verified
                  compact
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              >
                <VerifiedSealBadge
                  title="هندسة برمجيات"
                  subtitle="صادر · Sanad"
                  Icon={Code2}
                  variant={v2}
                  verified
                  compact
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <VerifiedSealBadge
                  title="قواعد بيانات"
                  subtitle="قيد التحقق"
                  Icon={Database}
                  variant={v3}
                  verified={false}
                  compact
                />
              </motion.div>
            </div>

            <motion.div
              className="relative z-[1] mt-4 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/passport"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
              >
                <Award className="h-4 w-4" />
                افتح جوازك المهاري
              </Link>
              <a
                href="https://polygonscan.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-bold text-muted-foreground transition-colors hover:border-violet-500/40 hover:text-foreground"
              >
                مستكشف Polygon
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
