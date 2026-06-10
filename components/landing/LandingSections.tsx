"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Eye,
  Zap,
  BarChart3,
  Video,
  Quote,
  ArrowLeft,
  Cpu,
  ShieldCheck,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function LandingSections() {
  return (
    <>
      {/* About & Vision */}
      <section id="about" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center md:text-right"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              عن المنصة
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              أفق — جاهزية أكاديمية تقيس نفسها بنفسها
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">
              تجمع أفق بين التعلّم داخل الفصل (شرائح، صوت، بطاقات، كويز، فيديو)، وسند كمرشد ذكي يقرأ أداءك وذاكرتك،
              والجواز المهاري لإثبات المهارة رقماً. الهدف ليس «مشاهدة دروس» فقط، بل مسار واضح من التفاعل إلى
              الجاهزية للاختبار الوطني وإلى سيرة يصدقها صاحب العمل.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-10 md:grid-cols-3"
          >
            <motion.div variants={item} className="rounded-2xl border border-border/80 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-foreground">كيف تعمل؟</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                كل جلسة تولّد إشارات: ما قرأته، ما أجبت عنه، ومدة تركيزك. تُلخص هذه الإشارات لتخصيص المحتوى ولتغذية
                سند ولتكوين صورة مهارية في جوازك — دون فصل بين «درست» و«أثبت».
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border border-border/80 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-foreground">الرؤية</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                أن نكون المرجع العربي للتعلم التكيفي في التخصصات التقنية: تجربة واحدة تجمع المادة، الإرشاد، والإثبات
                الرقمي — بشفافية تقنية يمكن للطالب والمرشد والجهة الخارجية الاعتماد عليها.
              </p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border border-border/80 bg-card/40 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-foreground">الهدف</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                رفع جاهزيتك لاختبار الجاهزية الوطني وتقليل التذبذب: مسار دراسة يتكيف مع ضعفك، تدخلات سند في الوقت
                المناسب، ومحاكاة كاملة (٩٠ سؤالاً) تقربك من يوم الاختبار.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/25 bg-primary/[0.04] px-6 py-5 text-center md:justify-start md:text-right"
          >
            <ShieldCheck className="hidden h-8 w-8 text-primary md:block" />
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              بياناتك تُستخدم لتحسين تجربتك ولتقاريرك وللمرشد عند الحاجة؛ مفاتيح الذكاء الاصطناعي على الخادم، ويمكن
              توثيق الإنجاز القوي على السلسلة عبر الجواز المهاري.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-muted/30 px-6 py-10 lg:px-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          <div className="flex items-center gap-3 text-center">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-black text-foreground">90</p>
              <p className="text-xs text-muted-foreground">سؤال محاكاة الجاهزية</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center">
            <Zap className="h-8 w-8 text-sky-500" />
            <div>
              <p className="text-2xl font-black text-foreground">6</p>
              <p className="text-xs text-muted-foreground">محاور مهارية</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-center">
            <Video className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-black text-foreground">24/7</p>
              <p className="text-xs text-muted-foreground">وصول لسند والمواد</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 lg:px-20">
        <div className="mx-auto max-w-6xl space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-2 text-center"
          >
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-primary">آراء الطلاب</h2>
            <p className="text-2xl font-black text-foreground md:text-3xl">تجارب حقيقية من الجامعات</p>
          </motion.header>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {[
              {
                quote:
                  "بعد شهر مع أفق ارتفع معدل جاهزيتي من 62% إلى 84%. كبسولات سند كانت الأفضل.",
                by: "طالبة هندسة برمجيات",
              },
              {
                quote: "الجواز المهاري ساعدني أشرح مهاراتي لشركة التدريب الصيفي.",
                by: "طالب علوم حاسب",
              },
              {
                quote:
                  "محاكاة التسعين سؤالاً خلّتني أعرف وين ضعفي في الوقت الحقيقي؛ مو بس درجات، بل توزيع الوقت والمحور. يوم الاختبار الوطني حسيت إني جرّبت الموقف قبل.",
                by: "طالبة ذكاء اصطناعي",
              },
            ].map((t, i) => (
              <motion.article key={i} variants={item} className="glass-card flex flex-col p-5">
                <Quote className="mb-2 h-8 w-8 text-primary/40" />
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">&quot;{t.quote}&quot;</p>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">{t.by}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-primary/5 p-8 dark:from-primary/20 dark:to-primary/10 md:flex-row md:p-12"
        >
          <div className="space-y-2 text-center md:text-right">
            <h2 className="text-2xl font-black text-foreground md:text-3xl">جاهز تبدأ؟</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              أنشئ حسابك، اربط بريدك الجامعي، ودع سند يحدد أول مسار تعلم لك.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              ادخل المنصة التعليمية
            </Link>
            <Link
              href="/simulation"
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              جرّب محاكاة الجاهزية
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
