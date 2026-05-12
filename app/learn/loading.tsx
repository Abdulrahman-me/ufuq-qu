export default function LearnLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="landing-mesh pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="landing-grid-bg pointer-events-none absolute inset-0 opacity-20" aria-hidden />
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-14 md:px-8">
        <div className="mx-auto mb-10 h-8 w-48 rounded-xl bg-muted md:mx-0" />
        <div className="mx-auto mb-4 h-12 w-full max-w-lg rounded-2xl bg-muted md:mx-0" />
        <div className="mx-auto mb-12 h-5 w-72 rounded-lg bg-muted md:mx-0" />
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-3xl border border-border/50 bg-card/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
