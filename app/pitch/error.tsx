"use client";

export default function PitchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center" dir="rtl">
      <h1 className="text-lg font-black text-foreground">تعذّر تحميل صفحة العرض</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        أوقف الخادم، احذف مجلد <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.next</code> داخل المشروع، ثم شغّل{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">npm run dev</code> من جديد.
      </p>
      {process.env.NODE_ENV === "development" ? (
        <pre className="mt-6 max-h-40 overflow-auto rounded-xl border border-border bg-muted/40 p-4 text-start text-xs text-destructive">
          {error.message}
        </pre>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-2xl bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
