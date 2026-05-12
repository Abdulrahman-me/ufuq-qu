export default function SubjectLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="landing-mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="landing-grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="mx-auto max-w-3xl animate-pulse px-4 py-14 md:px-8">
        <div className="mb-8 h-9 w-40 rounded-lg bg-muted" />
        <div className="mb-4 h-12 w-3/4 rounded-2xl bg-muted" />
        <div className="mb-10 h-5 w-64 rounded-lg bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl border border-border/50 bg-card/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
