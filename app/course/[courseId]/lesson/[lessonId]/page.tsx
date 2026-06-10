interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = params;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-72 flex-col border-s border-border overflow-y-auto bg-card/50">
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                مسار الدرس
              </h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                  <span>الجملة الاسمية</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground text-sm font-medium">
                  <span>كان وأخواتها</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                أدوات مساعدة
              </h3>
              <div className="space-y-1 text-sm">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground">
                  <span>البطاقات التعليمية</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground">
                  <span>المكتبة الصوتية</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground">
                  <span>الاختبارات القصيرة</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Breadcrumbs & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-primary text-sm mb-2">
                  <span>اللغة العربية الفصحى</span>
                  <span>أساسيات النحو</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground">
                  الجملة الاسمية والخبر
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg text-sm font-bold">
                  <span>مشاركة</span>
                </button>
                <button className="flex items-center gap-2 bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg shadow-primary/20">
                  <span>تدوين ملاحظة</span>
                </button>
              </div>
            </div>

            {/* Video */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="h-20 w-20 rounded-full bg-primary/90 text-white text-4xl flex items-center justify-center shadow-xl">
                  ▶
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-xs text-white">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-l from-[#1B8354] to-[#25935F] w-1/3 rounded-full" />
                  </div>
                  <span className="font-medium">08:45 / 24:00</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                {/* Podcast */}
                <section className="bg-slate-100 dark:bg-primary/5 rounded-2xl border border-primary/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">شرح صوتي مكمل</h2>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      بودكاست أفق
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-xl bg-slate-800 flex-shrink-0 relative overflow-hidden" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        أسرار المبتدأ والخبر في لغة العرب
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        يستعرض هذا التسجيل الحالات النادرة لتقدم الخبر على المبتدأ
                        وكيفية تمييزها في الاختبارات.
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full">
                          <div className="h-full bg-gradient-to-l from-[#1B8354] to-[#25935F] w-1/4 rounded-full" />
                        </div>
                        <span className="text-xs text-muted-foreground">03:20</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Quiz */}
                <section className="bg-card rounded-2xl border border-primary/10 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold">تحدي سريع</h2>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg text-foreground">
                      عين الخبر في الجملة التالية:{" "}
                      <span className="text-primary font-bold">
                        "العلمُ نافعٌ لأهلهِ"
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <button className="w-full p-4 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all text-right flex items-center justify-between">
                        <span>العلمُ</span>
                        <span className="h-5 w-5 rounded-full border border-primary/40" />
                      </button>
                      <button className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 text-right flex items-center justify-between">
                        <span className="font-bold">نافعٌ</span>
                        <span className="text-primary">✔</span>
                      </button>
                      <button className="w-full p-4 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all text-right flex items-center justify-between">
                        <span>لأهلهِ</span>
                        <span className="h-5 w-5 rounded-full border border-primary/40" />
                      </button>
                      <button className="w-full p-4 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all text-right flex items-center justify-between">
                        <span>مستتر</span>
                        <span className="h-5 w-5 rounded-full border border-primary/40" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gradient-to-l from-[#1B8354] to-[#25935F] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                  <h3 className="text-white text-2xl font-black mb-4 tracking-tight">
                    قاعدة المبتدأ
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    هو الاسم الذي تبدأ به الجملة الاسمية ويكون دائماً مرفوعاً،
                    ويحتاج إلى خبر يتمم معناه.
                  </p>
                  <button className="mt-8 px-6 py-2 bg-white text-primary rounded-full text-xs font-bold tracking-wider">
                    اقلب البطاقة
                  </button>
                </div>

                <div className="bg-card rounded-2xl border border-primary/10 p-6 text-sm">
                  <h3 className="font-bold mb-4">المرفقات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-background border border-primary/10">
                      <div className="flex items-center gap-3">
                        <span className="text-red-500">PDF</span>
                        <span className="text-sm font-medium">ملخص الدرس.pdf</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-background border border-primary/10">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-500">DOCX</span>
                        <span className="text-sm font-medium">تمارين منزلية.docx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
