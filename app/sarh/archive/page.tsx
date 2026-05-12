'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Code2,
  FileText,
  Lightbulb,
  LayoutTemplate,
  CheckCircle2,
  Bell,
  Sparkles,
  Brain,
  Users,
  BookOpen,
} from "lucide-react";
import { AnimatedBackground } from "@/components/sarh/AnimatedBackground";

interface ArchiveState {
  project_name?: string;
  solution_hint?: string;
  task_name?: string;
}

const benefits = [
  "اختصار الوقت عبر إعادة استخدام الأكواد والقوالب الجاهزة",
  "التعلّم من الدروس المستفادة وتجنّب الأخطاء الشائعة",
  "الاطلاع على مشاريع مميزة للإلهام والتحفيز",
  "الوصول إلى تقارير توثيق وأفضل الممارسات",
];

const resources = [
  { title: "مشاريع سابقة مميزة", icon: Code2, count: "24 مشروع" },
  { title: "تقارير توثيق", icon: FileText, count: "18 تقرير" },
  { title: "دروس مستفادة", icon: Lightbulb, count: "36 درس" },
  { title: "قوالب جاهزة", icon: LayoutTemplate, count: "12 قالب" },
];

const defaultProjectHighlights = [
  { label: "التخصص", value: "الذكاء الاصطناعي - أنظمة التوصية" },
  { label: "الفريق", value: "3 طلاب" },
  { label: "المدة", value: "4 أشهر" },
  { label: "التقييم", value: "A+" },
  { label: "المواد المرتبطة", value: "التعلم الآلي، الإحصاء، تراكيب البيانات" },
];

const lessonsLearned = [
  "أهمية توفير بيانات تقييم كافية لمعالجة مشكلة البداية الباردة (Cold Start)",
  "استخدام التصفية التعاونية (Collaborative Filtering) يعطي نتائج أكثر دقة للمستخدمين النشطين",
  "الاعتماد على مقاييس مثل RMSE يوفر تقييماً أفضل من مقياس الدقة التقليدي",
];

const defaultCodeSnippet = `import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

class MovieRecommender:
    def __init__(self):
        self.model = SVD()
        
    def train(self, data_path: str):
        df = pd.read_csv(data_path)
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(df[['user_id', 'movie_id', 'rating']], reader)
        
        trainset, testset = train_test_split(data, test_size=0.2)
        self.model.fit(trainset)
        
    def predict_rating(self, user_id: int, movie_id: int) -> float:
        pred = self.model.predict(user_id, movie_id)
        return pred.est`;

const VSCodeCodeBlock = ({ code, fileName = "solution.py" }: { code: string; fileName?: string }) => {
  const lines = code.split("\n");
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#3e3e42] bg-[#1e1e1e] shadow-2xl" dir="ltr">
      <div className="flex items-center justify-between border-b border-[#333333] bg-[#252526] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] font-mono font-medium text-[#858585] uppercase tracking-wider">{fileName}</span>
      </div>

      <div className="flex font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar">
        <div className="flex flex-col bg-[#1e1e1e] border-r border-[#333333] px-3 py-4 text-right select-none text-[#858585] min-w-[40px]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 py-4 px-5 text-left whitespace-pre text-[#d4d4d4]">
          {code}
        </pre>
      </div>
    </div>
  );
};

export default function ArchivePage() {
  const [archiveState, setArchiveState] = useState<ArchiveState | null>(null);
  const assistantRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const raw = localStorage.getItem("sarh_archive_state");
        if (raw) {
            const state = JSON.parse(raw);
            setArchiveState(state);
            // Clear it after reading so it doesn't persist across refreshes if not intended
            // localStorage.removeItem("sarh_archive_state");
        }
    }
  }, []);

  const hasSolution = !!archiveState?.solution_hint;
  const taskName = archiveState?.task_name || "";

  useEffect(() => {
    if (archiveState && assistantRef.current) {
      setTimeout(() => {
        assistantRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [archiveState]);

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30" dir="rtl">
      <AnimatedBackground />

      <div className="relative mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground">أرشيف الخبرات</h1>
          </div>
          <p className="text-primary font-medium">
            استفد من خبرات ومشاريع الزملاء السابقين لتسريع رحلة تعلّمك
          </p>
        </header>

        {/* Info Section */}
        <section className="mb-8 glass-card p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">ما هو أرشيف الخبرات؟</h2>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            أرشيف الخبرات هو مستودع ذكي يجمع المشاريع والتجارب التعليمية الناجحة من طلاب سابقين
            في مختلف التخصصات. يهدف الأرشيف إلى تمكينك من البناء على ما أنجزه الآخرون بدلاً من
            البدء من الصفر مما يوفر عليك الوقت والجهد ويرتقي بجودة مشاريعك.
          </p>

          <h3 className="mb-4 text-lg font-bold text-foreground">كيف يفيدك أرشيف الخبرات؟</h3>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-foreground">{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-foreground">ماذا يتضمن الأرشيف؟</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {resources.map((r, i) => (
              <div
                key={i}
                className="glass-card flex flex-col items-center gap-2 p-4 text-center"
              >
                <r.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Project Preview - Archive Example (STATIC) */}
        <section id="archive-example" className="mb-8 glass-card p-6">
          <h3 className="mb-6 text-lg font-bold text-foreground">
            نموذج من الأرشيف
          </h3>

          <div className="rounded-xl border border-border bg-muted/50 p-4">
            {/* Project Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                  <Brain className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">تطبيق التوصية السينمائي</h4>
                  <p className="text-xs text-muted-foreground">مشروع تخرج — الفصل الأول 2025</p>
                </div>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                مشروع تخرج
              </span>
            </div>

            {/* Description */}
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              تطبيق ذكي يقدم توصيات مخصصة للأفلام بناءً على تاريخ مشاهدات المستخدم وتقييماته.
              يعتمد النظام على خوارزمية التصفية التعاونية (Collaborative Filtering) باستخدام SVD،
              مما يوفر اقتراحات دقيقة للغاية تتكيف مع تفضيلات كل مستخدم.
            </p>

            {/* Project Details Grid */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {defaultProjectHighlights.map((h, i) => (
                <div key={i} className="rounded-lg bg-background p-3">
                  <p className="text-xs text-muted-foreground">{h.label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{h.value}</p>
                </div>
              ))}
            </div>

            {/* Code Preview - VS Code Theme */}
            <div className="mb-6 lowercase">
              <VSCodeCodeBlock code={defaultCodeSnippet} fileName="movie_recommender.py" />
            </div>

            {/* Lessons Learned */}
            <div className="mb-4">
              <h5 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                الدروس المستفادة
              </h5>
              <div className="space-y-2">
                {lessonsLearned.map((lesson, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {lesson}
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">الذكاء الاصطناعي</span>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">الإحصاء</span>
              <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">تراكيب البيانات</span>
              <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">برمجة 1</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass-card flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">+150</p>
              <p className="text-sm text-muted-foreground">طالب ساهم في الأرشيف</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">90+</p>
              <p className="text-sm text-muted-foreground">مشروع موثق ومتاح</p>
            </div>
          </div>
          <div className="glass-card flex items-center gap-3 p-4">
            <Code2 className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">12K+</p>
              <p className="text-sm text-muted-foreground">سطر كود مُشارك</p>
            </div>
          </div>
        </section>

        {/* Smart Assistant */}
        <section ref={assistantRef} id="archive-assistant" className="mb-8 glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-foreground">مساعد الأرشيف</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                ستصلك إشعارات ذكية تقترح عليك حلولاً برمجية من الأرشيف أثناء عملك على
                مشاريعك. المساعد يحلل سياق عملك ويقدم لك الموارد الأكثر صلة تلقائياً.
              </p>
            </div>
          </div>

          {/* Dynamic solution from workspace notification */}
          {hasSolution && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">حل مقترح لمهمتك</h4>
              </div>
              {taskName && (
                <p className="mb-3 text-sm text-foreground">
                  <span className="font-bold">المهمة:</span> {taskName}
                </p>
              )}
              <p className="mb-3 text-xs text-muted-foreground">
                من مشروع: <span className="font-medium text-foreground">{archiveState?.project_name}</span>
              </p>
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">كود الحل المقتبس:</p>
                <VSCodeCodeBlock code={archiveState?.solution_hint || ""} fileName="shared_solution.py" />
              </div>
            </div>
          )}
        </section>

        {/* Coming Soon */}
        <section className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-2 text-lg font-bold text-foreground">قريباً: استعراض الأرشيف الكامل</h3>
          <p className="text-sm text-muted-foreground">
            نعمل على إضافة واجهة تفاعلية لتصفح مشاريع وخبرات الزملاء السابقين مباشرة من هذه الصفحة
          </p>
        </section>
      </div>
    </div>
  );
}
