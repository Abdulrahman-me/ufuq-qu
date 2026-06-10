import { AppShell } from "@/components/ui/AppShell";

export default function DashboardPage() {
  return (
    <AppShell
      title="لوحة الطالب"
      subtitle="نظرة شاملة على جاهزيتك، تقدمك، وتوصيات سند ضمن المنصة التعليمية التكيفية."
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 to-transparent p-6">
            <p className="mb-1 text-xs font-bold text-primary">
              توصية سند الذكي
            </p>
            <p className="text-sm leading-relaxed text-foreground md:text-base">
              أداؤك في مهارة الخوارزميات ممتاز، لكن نتائجك في قواعد البيانات
              متوسطة. أنصحك بمراجعة دروس الفهارس والعلاقات باستخدام كبسولات
              تعلم مدتها 20 دقيقة، مع كويز قصير بعد كل كبسولة.
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">المقررات الموصى بها</h2>
              <button type="button" className="text-xs font-medium text-primary">
                عرض كل المقررات
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <article className="glass-card space-y-2 p-4">
                <p className="text-xs text-muted-foreground">برمجة 1</p>
                <h3 className="text-sm font-bold">هياكل البيانات الأساسية</h3>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-3/5 rounded-full bg-gradient-to-l from-[#1B8354] to-[#25935F]" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  تم إكمال 60% · مقترح من سند لتحسين مهارة التفكير الخوارزمي.
                </p>
              </article>

              <article className="glass-card space-y-2 p-4">
                <p className="text-xs text-muted-foreground">قواعد البيانات</p>
                <h3 className="text-sm font-bold">التطبيع والعلاقات</h3>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/4 rounded-full bg-gradient-to-l from-[#1B8354] to-[#25935F]" />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  تم إكمال 25% · موصى به لرفع جاهزيتك قبل اختبار الجاهزية القادم.
                </p>
              </article>
            </div>
          </div>
        </div>

        <aside className="space-y-6 lg:pl-4">
          <div className="glass-card p-6 text-center">
            <p className="mb-2 text-sm font-medium">معدل الجاهزية العام</p>
            <p className="mb-1 text-4xl font-black text-primary">85%</p>
            <p className="text-[11px] font-semibold text-emerald-500">
              متقدم · تحسن +5% خلال الأسبوع الماضي
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="mb-4 text-sm font-bold">المهارات الأساسية</h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="mb-1 flex justify-between">
                  <span>البرمجة</span>
                  <span className="font-bold text-primary">92%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[92%] bg-gradient-to-l from-[#1B8354] to-[#25935F]" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span>الخوارزميات</span>
                  <span className="font-bold text-primary">86%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[86%] bg-gradient-to-l from-[#1B8354] to-[#25935F]" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span>قواعد البيانات</span>
                  <span className="font-bold text-primary">68%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] bg-gradient-to-l from-[#1B8354] to-[#25935F]" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
