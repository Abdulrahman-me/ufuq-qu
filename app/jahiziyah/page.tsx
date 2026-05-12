export default function JahiziyahPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark px-4 py-8 md:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-black">محاكاة اختبار الجاهزية</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            تجربة اختبار كاملة لمدة ٩٠ دقيقة مع ٩٠ سؤال اختيار من متعدد، مع
            تقرير أداء تفصيلي بعد الانتهاء.
          </p>
        </header>

        <div className="rounded-2xl border border-primary/20 bg-white dark:bg-slate-900 p-6 space-y-4">
          <p className="text-sm">
            هذه الصفحة حالياً عبارة عن نموذج أولي لواجهة الاختبار. لاحقاً سيتم
            ربطها بجداول{" "}
            <code className="bg-slate-100 dark:bg-slate-800 rounded px-1">
              quizzes
            </code>{" "}
            و{" "}
            <code className="bg-slate-100 dark:bg-slate-800 rounded px-1">
              questions
            </code>{" "}
            و{" "}
            <code className="bg-slate-100 dark:bg-slate-800 rounded px-1">
              quiz_attempts
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

