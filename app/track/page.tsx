import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Gauge,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-black text-foreground md:text-4xl">
            اختر مسار رحلتك مع أفق
          </h1>
          <p className="text-sm text-muted-foreground">
            اختر الطريقة الأنسب لك للانطلاق، سواء عبر بناء جاهزيتك السريعة أو عبر مسار أكاديمي متكامل قريباً.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/readiness/placement"
            className="group relative overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(1000px_320px_at_top_right,rgba(59,130,246,0.22),transparent),radial-gradient(900px_260px_at_bottom_left,rgba(16,185,129,0.10),transparent)] p-7 flex flex-col min-h-[520px] hover:border-primary hover:shadow-2xl transition-all"
          >
            <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/25">
                <Target className="h-7 w-7" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-black text-foreground">مسار الجاهزية</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  رحلة قصيرة تضعك على الطريق الصحيح وتكشف نقاط قوتك وضعفك بسرعة.
                </p>
              </div>
            </div>

            <div className="relative mt-7 flex-1">
              <div className="relative pr-3">
                <div className="absolute right-1 top-2 bottom-2 w-px bg-primary/30" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">1) ابدأ اختبار تحديد المستوى</p>
                      <p className="text-xs text-muted-foreground mt-1">يغطي أهم مفاهيم التخصص بشكل مباشر.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">2) احصل على نسبة جاهزية</p>
                      <p className="text-xs text-muted-foreground mt-1">مع ترتيب تقريبي يساعدك على التخطيط.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">3) توصية فورية</p>
                      <p className="text-xs text-muted-foreground mt-1">ابدأ بالمادة الأضعف لديك لتسريع التحسن.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">4) تعلم مع سند</p>
                      <p className="text-xs text-muted-foreground mt-1">تتبّع جاهزيتك خطوة بخطوة داخل منصة التعلم.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-6 flex items-center justify-between">
              <span className="text-sm font-bold text-primary group-hover:underline">
                ابدأ اختبار تحديد المستوى
              </span>
              <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <div className="group relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(1000px_340px_at_top_right,rgba(148,163,184,0.20),transparent),radial-gradient(900px_260px_at_bottom_left,rgba(59,130,246,0.08),transparent)] p-7 flex flex-col min-h-[520px] opacity-95">
            <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-muted/70 blur-2xl" />
            <div className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 border border-border text-muted-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div className="text-right flex-1">
                <h2 className="text-xl font-black text-foreground/80">المسار الأكاديمي</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  رحلة أعمق بالمقررات مع مشاريع وتتبّع ذكي للأداء داخل سند.
                </p>
              </div>
            </div>

            <div className="relative mt-7 flex-1">
              <div className="relative pr-3">
                <div className="absolute right-1 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground/80">1) وحدات تفصيلية</p>
                      <p className="text-xs text-muted-foreground mt-1">كل موضوع بالتسلسل مع أمثلة تطبيقية.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground/80">2) مشاريع عملية</p>
                      <p className="text-xs text-muted-foreground mt-1">تعزز فهمك وتحوّل الدرس إلى مهارة قابلة للعرض.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-8 w-8 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground/80">3) تكامل عميق مع سند</p>
                      <p className="text-xs text-muted-foreground mt-1">تحليل سلوكك على المدى الطويل واقتراح خطة واضحة.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className="mt-6 text-sm font-semibold text-muted-foreground">
              سيظهر قريباً داخل أفق.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

