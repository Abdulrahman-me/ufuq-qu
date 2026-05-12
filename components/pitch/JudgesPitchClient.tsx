"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Presentation,
  Sparkles,
} from "lucide-react";
import { DECK_SLIDES, type DeckSlide } from "@/lib/pitch/pitchDeckContent";
import { cn } from "@/lib/utils";

const PALETTE: Record<
  DeckSlide["palette"],
  { mesh: string; blobA: string; blobB: string; ring: string }
> = {
  aurora: {
    mesh: "from-cyan-500/[0.15] via-violet-600/[0.12] to-fuchsia-500/[0.08]",
    blobA: "bg-cyan-400/25",
    blobB: "bg-fuchsia-500/20",
    ring: "border-white/10",
  },
  sunset: {
    mesh: "from-rose-500/[0.18] via-orange-500/[0.1] to-amber-500/[0.06]",
    blobA: "bg-rose-500/30",
    blobB: "bg-orange-400/20",
    ring: "border-rose-200/10",
  },
  ocean: {
    mesh: "from-sky-500/[0.14] via-blue-600/[0.1] to-indigo-950/[0.35]",
    blobA: "bg-sky-400/22",
    blobB: "bg-indigo-500/25",
    ring: "border-sky-200/10",
  },
  forest: {
    mesh: "from-emerald-500/[0.12] via-teal-600/[0.1] to-slate-950/[0.4]",
    blobA: "bg-emerald-400/20",
    blobB: "bg-teal-500/18",
    ring: "border-emerald-200/10",
  },
  royal: {
    mesh: "from-indigo-500/[0.16] via-violet-600/[0.12] to-slate-950/[0.38]",
    blobA: "bg-violet-500/25",
    blobB: "bg-indigo-400/18",
    ring: "border-violet-200/10",
  },
  midnight: {
    mesh: "from-slate-900/[0.95] via-slate-950 to-black/90",
    blobA: "bg-primary/20",
    blobB: "bg-violet-600/15",
    ring: "border-white/10",
  },
  dawn: {
    mesh: "from-amber-500/[0.1] via-slate-800/[0.5] to-slate-950/[0.9]",
    blobA: "bg-amber-400/18",
    blobB: "bg-slate-500/15",
    ring: "border-amber-200/10",
  },
};

function SlideChrome({ slide, children }: { slide: DeckSlide; children: React.ReactNode }) {
  const p = PALETTE[slide.palette];
  return (
    <div
      data-pitch-slide
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-[2rem] border shadow-2xl",
        "bg-gradient-to-br",
        p.mesh,
        p.ring,
      )}
    >
      <div
        className={cn("pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl", p.blobA)}
        aria-hidden
      />
      <div
        className={cn("pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full blur-3xl", p.blobB)}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_45%,rgba(0,0,0,0.12)_100%)]"
        aria-hidden
      />
      <div className="relative flex h-full flex-col p-6 sm:p-8 md:p-10 lg:p-12">{children}</div>
    </div>
  );
}

function SlideBody({ slide }: { slide: DeckSlide }) {
  switch (slide.kind) {
    case "cover":
    case "closing":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/50 sm:text-xs">Afaq Pitch</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {slide.headline}
          </h1>
          {slide.subline ? (
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/85 sm:text-lg md:text-xl">
              {slide.subline}
            </p>
          ) : null}
          {slide.bullets?.length ? (
            <ul className="mt-8 space-y-2 text-sm text-white/70 sm:text-base">
              {slide.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      );
    case "statement":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45 sm:text-xs">{slide.label}</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">{slide.headline}</h2>
          {slide.subline ? (
            <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-white/88 sm:text-lg">{slide.subline}</p>
          ) : null}
          <ul className="mt-8 space-y-4">
            {slide.bullets?.map((b) => (
              <li
                key={b}
                className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/85 backdrop-blur-sm sm:text-base"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                {b}
              </li>
            ))}
          </ul>
        </>
      );
    case "pillars":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45 sm:text-xs">{slide.label}</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">{slide.headline}</h2>
          {slide.subline ? <p className="mt-3 max-w-3xl text-base text-white/80 sm:text-lg">{slide.subline}</p> : null}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {slide.pillars?.map((pillar, i) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center shadow-lg backdrop-blur-md sm:p-5"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/80 to-emerald-600/80 text-sm font-black text-white">
                  {i + 1}
                </div>
                <p className="text-lg font-black text-white">{pillar.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/75 sm:text-sm">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </>
      );
    case "split":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45 sm:text-xs">{slide.label}</p>
          <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl md:text-[2.15rem]">{slide.headline}</h2>
          <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur-md sm:p-8">
            <p className="text-base leading-[1.85] text-white/88 sm:text-lg md:text-xl">{slide.subline}</p>
          </div>
        </>
      );
    case "products":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45 sm:text-xs">{slide.label}</p>
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl md:text-4xl">{slide.headline}</h2>
          {slide.subline ? <p className="mt-2 text-sm text-white/70 sm:text-base">{slide.subline}</p> : null}
          <div className="mt-4 grid grid-cols-1 gap-1.5 sm:mt-5 sm:grid-cols-2 sm:gap-2 md:gap-2.5">
            {slide.products?.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-black leading-snug text-white sm:text-sm">{p.title}</p>
                  {p.href ? (
                    <Link
                      href={p.href}
                      className="shrink-0 text-[10px] font-bold text-primary hover:underline sm:text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      زيارة
                    </Link>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] leading-snug text-white/75 sm:text-[11px] md:text-xs">{p.line}</p>
              </div>
            ))}
          </div>
        </>
      );
    case "chips":
      return (
        <>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45 sm:text-xs">{slide.label}</p>
          <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">{slide.headline}</h2>
          <div className="mt-8 flex flex-wrap content-start gap-2 sm:gap-3">
            {slide.tech?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 font-mono text-[11px] font-bold text-white/90 shadow-md backdrop-blur-sm sm:text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </>
      );
    default:
      return null;
  }
}

function JudgesPitchClient() {
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState<"pdf" | "pptx" | null>(null);
  const [exportErr, setExportErr] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const total = DECK_SLIDES.length;
  const slide = DECK_SLIDES[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const n = i + delta;
        if (n < 0) return total - 1;
        if (n >= total) return 0;
        return n;
      });
    },
    [total],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPdf = async () => {
    setExportErr(null);
    setBusy("pdf");
    try {
      const { downloadPitchPdf } = await import("@/lib/pitch/exportPitchPdf");
      await downloadPitchPdf("afaq-pitch.pdf");
    } catch (e) {
      setExportErr(e instanceof Error ? e.message : "تعذّر إنشاء PDF");
    } finally {
      setBusy(null);
    }
  };

  const onPptx = async () => {
    setExportErr(null);
    setBusy("pptx");
    try {
      const { downloadPitchPptx } = await import("@/lib/pitch/exportPitchPptx");
      await downloadPitchPptx("afaq-pitch.pptx");
    } catch (e) {
      setExportErr(e instanceof Error ? e.message : "تعذّر إنشاء PowerPoint");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(ellipse_90%_50%_at_100%_30%,hsl(260_55%_45%/0.1),transparent),radial-gradient(ellipse_70%_50%_at_0%_90%,hsl(160_45%_35%/0.08),transparent)]"
        aria-hidden
      />

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/70 bg-background/80 shadow-md backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
            : "border-transparent bg-background/35 backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.06, rotate: -4 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-600 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25"
            >
              أف
            </motion.div>
            <span className="text-base font-black text-foreground transition-colors group-hover:text-primary">أفق</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {exportErr ? (
              <p className="max-w-[min(100%,14rem)] text-[10px] text-destructive sm:max-w-xs sm:text-xs" title={exportErr}>
                {exportErr}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onPdf}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2 text-xs font-bold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-muted disabled:opacity-50 sm:text-sm"
            >
              {busy === "pdf" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <FileImage className="h-4 w-4 text-primary" />
              )}
              PDF
            </button>
            <button
              type="button"
              onClick={onPptx}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 px-3 py-2 text-xs font-black text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50 sm:text-sm"
            >
              {busy === "pptx" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Presentation className="h-4 w-4" />
              )}
              PPTX
            </button>
            <Link
              href="/"
              className="hidden rounded-xl border border-border/80 bg-card/80 px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:inline-flex sm:text-sm"
            >
              الرئيسية
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 md:px-8 md:pt-12" dir="rtl">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          عرض شرائح · استخدم الأسهم أو النقاط — تنزيل PDF أو PowerPoint أعلاه
        </p>

        <div className="relative mx-auto max-w-[min(100%,1280px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SlideChrome slide={slide}>
                <SlideBody slide={slide} />
                <div className="pointer-events-none mt-auto flex items-end justify-between pt-6 text-[10px] font-bold text-white/35 sm:text-xs">
                  <span>{slide.label}</span>
                  <span>
                    {index + 1} / {total}
                  </span>
                </div>
              </SlideChrome>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="الشريحة السابقة"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/90 text-foreground shadow-md transition hover:bg-muted"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="flex max-w-[min(100%,280px)] flex-wrap justify-center gap-1.5">
              {DECK_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={s.label}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/55",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="الشريحة التالية"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/90 text-foreground shadow-md transition hover:bg-muted"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <ArrowRight className="inline h-3 w-3 -scale-x-100" /> يمين / يسار للتنقل · <Download className="inline h-3 w-3" /> تصدير من الأعلى
          </p>
        </div>

        <footer className="mx-auto mt-16 max-w-2xl rounded-3xl border border-dashed border-primary/25 bg-muted/15 p-6 text-center">
          <p className="text-sm font-bold text-foreground">أفق — عرض للمحكّمين</p>
          <p className="mt-2 text-xs text-muted-foreground">شرائح ١٦:٩ · جاهزة للطباعة والعرض</p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground"
          >
            العودة للرئيسية
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default JudgesPitchClient;
export { JudgesPitchClient };
