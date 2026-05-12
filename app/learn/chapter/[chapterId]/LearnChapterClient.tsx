"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Headphones,
  Layers,
  Zap,
  Youtube,
  Share2,
  StickyNote,
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Presentation,
} from "lucide-react";
import { SlidesViewer } from "@/components/learn/SlidesViewer";
import { PodcastPlayer } from "@/components/learn/PodcastPlayer";
import { Flashcards } from "@/components/learn/Flashcards";
import { Quiz } from "@/components/learn/Quiz";
import { RecommendedVideos } from "@/components/learn/RecommendedVideos";
import { LearnAskAI } from "@/components/learn/LearnAskAI";
import { NotesSection } from "@/components/learn/NotesPanel";
import { useTypewriter } from "@/components/landing/useTypewriter";
import { cn } from "@/lib/utils";
import { bumpSubjectReadiness, guessSubjectSlugFromName } from "@/lib/readiness";

const TABS = [
  { id: "explanation", label: "شرح الدرس", icon: FileText },
  { id: "podcast", label: "شرح صوتي", icon: Headphones },
  { id: "flashcards", label: "البطاقات", icon: Layers },
  { id: "quiz", label: "تحدي سريع", icon: Zap },
  { id: "videos", label: "فيديوهات موصى بها", icon: Youtube },
] as const;

type TabId = (typeof TABS)[number]["id"];

const HERO_TYPE_PHRASES = [
  "سلايدات، صوت، بطاقات، وكويز في تجربة واحدة.",
  "تفاعلك يغذي ملخص الجلسة وسند.",
  "ركّز على الفصل — الباقي نرتّبه لك.",
];

interface LearnChapterClientProps {
  chapterId: string;
  subjectName: string;
  initialChapter: { id: string; title: string; subject_id: string; slide_path: string | null };
  initialContent: {
    summary_text: string | null;
    podcast_script: string | null;
    podcast_audio_url: string | null;
    youtube_queries: string[];
    flashcards_json: { question: string; answer: string }[];
    quiz_json: { question: string; choices: string[]; correct_answer: string }[];
  } | null;
}

function FeedbackBar({ label }: { label: string }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex items-center justify-between rounded-2xl border border-border/80 bg-gradient-to-l from-muted/50 to-muted/20 px-4 py-3 text-[11px] shadow-inner backdrop-blur-sm"
    >
      <span className="text-muted-foreground">كيف تقيم هذا {label}؟</span>
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLikes((v) => v + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/45 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-400"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{likes}</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDislikes((v) => v + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-500/15 dark:text-rose-400"
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span>{dislikes}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

const tabMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

export function LearnChapterClient({
  chapterId,
  subjectName,
  initialChapter,
  initialContent,
}: LearnChapterClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("explanation");
  const [sessionStartedAt] = useState(() => Date.now());
  const [videoPlays, setVideoPlays] = useState(0);
  const [videoPauses, setVideoPauses] = useState(0);
  const [videoReplays, setVideoReplays] = useState(0);
  const [focusSpanSec, setFocusSpanSec] = useState<number>(0);
  const [maxFocusSpanSec, setMaxFocusSpanSec] = useState<number>(0);
  const [lastVideoTime, setLastVideoTime] = useState<number | null>(null);
  const [lastPlayAt, setLastPlayAt] = useState<number | null>(null);
  const lastVideoTimeRef = useRef<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [preferred, setPreferred] = useState<"text" | "podcast" | "flashcards" | "videos">("text");
  const [readinessDelta, setReadinessDelta] = useState<number>(0);
  const [newReadinessValue, setNewReadinessValue] = useState<number | null>(null);
  const [showPreferredPicker, setShowPreferredPicker] = useState(false);

  const typed = useTypewriter(HERO_TYPE_PHRASES, 34, 2200, 26);

  const summary = initialContent?.summary_text ?? "";
  const flashcards = initialContent?.flashcards_json ?? [];
  const quiz = initialContent?.quiz_json ?? [];
  const youtubeQueries = initialContent?.youtube_queries ?? [];
  const [videosSectionMounted, setVideosSectionMounted] = useState(false);
  useEffect(() => {
    if (activeTab === "videos") setVideosSectionMounted(true);
  }, [activeTab]);

  const onVideoEvent = useCallback((ev: "play" | "pause" | "replay", payload?: { currentTime?: number }) => {
    const now = Date.now();
    if (ev === "play") {
      setVideoPlays((v) => v + 1);
      setLastPlayAt(now);
      if (typeof payload?.currentTime === "number") {
        if (lastVideoTimeRef.current !== null && payload.currentTime < lastVideoTimeRef.current - 5) {
          setVideoReplays((v) => v + 1);
        }
        setLastVideoTime(payload.currentTime);
        lastVideoTimeRef.current = payload.currentTime;
      }
    } else if (ev === "pause") {
      setVideoPauses((v) => v + 1);
      setLastPlayAt((prev) => {
        if (prev) {
          const span = Math.round((now - prev) / 1000);
          setFocusSpanSec((m) => m + span);
          setMaxFocusSpanSec((m) => Math.max(m, span));
        }
        return null;
      });
      if (typeof payload?.currentTime === "number") {
        setLastVideoTime(payload.currentTime);
        lastVideoTimeRef.current = payload.currentTime;
      }
    } else {
      if (
        typeof payload?.currentTime === "number" &&
        lastVideoTimeRef.current !== null &&
        payload.currentTime < lastVideoTimeRef.current - 5
      ) {
        setVideoReplays((v) => v + 1);
      }
      if (typeof payload?.currentTime === "number") {
        setLastVideoTime(payload.currentTime);
        lastVideoTimeRef.current = payload.currentTime;
      }
    }
  }, []);

  function endSession() {
    const now = Date.now();
    if (lastPlayAt) {
      const span = Math.round((now - lastPlayAt) / 1000);
      setFocusSpanSec((m) => m + span);
      setMaxFocusSpanSec((m) => Math.max(m, span));
      setLastPlayAt(null);
    }

    const preferredMethod: typeof preferred =
      videoPlays + videoReplays > 0
        ? "videos"
        : flashcards.length > 0
          ? "flashcards"
          : initialContent?.podcast_script
            ? "podcast"
            : "text";
    setPreferred(preferredMethod);

    const subjectSlug =
      guessSubjectSlugFromName(initialChapter.subject_id) ?? guessSubjectSlugFromName(initialChapter.title);
    let readinessAfter: number | undefined;
    if (subjectSlug) {
      const after = bumpSubjectReadiness(subjectSlug, 5);
      readinessAfter = after;
      setReadinessDelta(5);
      setNewReadinessValue(after);
    }

    setShowSummary(true);

    try {
      const totalSec = Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000));
      const summaryForSanad = {
        sessionDuration: totalSec,
        focusDuration: maxFocusSpanSec || focusSpanSec || 0,
        playPauseCount: videoPlays + videoPauses,
        replayCount: videoReplays,
        readinessScore: readinessAfter,
        preferredLearningMethod: preferredMethod,
        chapterId,
        chapterTitle: initialChapter.title,
      };
      localStorage.setItem("ufuq:lastSessionSummary", JSON.stringify(summaryForSanad));
    } catch {
      // ignore
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-foreground">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <div
        className="landing-grid-bg pointer-events-none fixed inset-0 -z-10 opacity-[0.26] dark:opacity-[0.14]"
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute -start-24 top-32 h-72 w-72 rounded-full bg-primary/12 blur-3xl"
        animate={{ x: [0, 12, 0], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -end-16 bottom-40 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative flex-1 px-4 pb-12 pt-6 md:px-8 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/learn"
              className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/70 px-3 py-1.5 font-bold text-muted-foreground backdrop-blur-sm transition-colors hover:border-primary/35 hover:text-primary"
            >
              المواد
            </Link>
            <span className="text-muted-foreground">/</span>
            {subjectName ? (
              <>
                <Link
                  href={`/learn/${initialChapter.subject_id}`}
                  className="font-bold text-foreground transition-colors hover:text-primary"
                >
                  {subjectName}
                </Link>
                <span className="text-muted-foreground">/</span>
              </>
            ) : null}
            <span className="max-w-[min(100%,12rem)] truncate font-black text-foreground md:max-w-none">
              {initialChapter.title}
            </span>
          </motion.nav>

          <motion.header
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm">
                <Presentation className="h-3.5 w-3.5" />
                جلسة تعلّم
              </span>
              <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-foreground md:text-4xl lg:text-[2.35rem]">
                <span className="bg-gradient-to-l from-primary via-emerald-500 to-sky-400 bg-clip-text text-transparent">
                  {initialChapter.title}
                </span>
              </h1>
              <p className="mt-3 min-h-[1.45em] text-base text-muted-foreground md:text-lg">
                <Sparkles className="mb-0.5 inline h-4 w-4 text-primary" />{" "}
                <span className="font-semibold text-foreground/90">{typed}</span>
                <span className="animate-pulse text-primary">|</span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/80 px-5 py-2.5 text-sm font-bold shadow-sm backdrop-blur-sm transition-colors hover:border-primary/35"
              >
                <Share2 className="h-4 w-4 text-primary" />
                مشاركة
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={endSession}
                className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/30"
              >
                <StickyNote className="h-4 w-4" />
                إنهاء الجلسة
              </motion.button>
            </div>
          </motion.header>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.45 }}
              className="flex min-h-0 flex-1 flex-col gap-4 lg:w-[55%] xl:w-[58%]"
            >
              <SlidesViewer
                slidePath={initialChapter.slide_path}
                chapterTitle={initialChapter.title}
                className="min-h-[320px] flex-1"
              />
              <LearnAskAI chapterSummary={summary} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/55 shadow-2xl backdrop-blur-xl ring-1 ring-primary/10 lg:w-[45%] xl:w-[42%]"
            >
              <div className="relative flex flex-wrap gap-1 border-b border-border/60 bg-muted/25 p-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative z-10 flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors md:text-sm",
                      activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {activeTab === tab.id && (
                      <motion.span
                        layoutId="learnChapterTab"
                        className="absolute inset-0 -z-10 rounded-xl border border-primary/35 bg-primary/12 shadow-sm"
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}
                    <tab.icon className="h-4 w-4 shrink-0 opacity-90" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="custom-scrollbar min-h-[min(50vh,420px)] flex-1 overflow-y-auto p-4 md:min-h-[320px] md:p-5">
                <AnimatePresence mode="wait">
                  {activeTab === "explanation" && (
                    <motion.div key="explanation" {...tabMotion} className="space-y-2">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {summary ? (
                          <>
                            <p className="whitespace-pre-wrap leading-relaxed text-foreground">{summary}</p>
                            <FeedbackBar label="الشرح النصي" />
                          </>
                        ) : (
                          <p className="text-muted-foreground">لم يُضف شرح لهذا الفصل بعد.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  {activeTab === "podcast" && (
                    <motion.div key="podcast" {...tabMotion} className="space-y-2">
                      <PodcastPlayer
                        audioUrl={initialContent?.podcast_audio_url ?? null}
                        title="شرح صوتي مكمل للدرس"
                      />
                      <FeedbackBar label="الشرح الصوتي" />
                    </motion.div>
                  )}
                  {activeTab === "flashcards" && (
                    <motion.div key="flashcards" {...tabMotion} className="space-y-2">
                      <Flashcards cards={flashcards} />
                      <FeedbackBar label="البطاقات التعليمية" />
                    </motion.div>
                  )}
                  {activeTab === "quiz" && (
                    <motion.div key="quiz" {...tabMotion} className="space-y-2">
                      <Quiz questions={quiz} />
                      <FeedbackBar label="التحدي السريع" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {videosSectionMounted && (
                  <div
                    className={cn(activeTab !== "videos" && "hidden")}
                    aria-hidden={activeTab !== "videos"}
                  >
                    <RecommendedVideos queries={youtubeQueries} onVideoEvent={onVideoEvent} />
                  </div>
                )}
                {activeTab === "videos" && <FeedbackBar label="الفيديوهات الموصى بها" />}
              </div>

              <div className="border-t border-border/60 bg-gradient-to-b from-transparent to-muted/20 px-3 pb-4 pt-3 md:px-4">
                <NotesSection chapterId={chapterId} chapterTitle={initialChapter.title} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-10"
          >
            <Link
              href={`/learn/${initialChapter.subject_id}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              العودة لفصول المادة
            </Link>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-xl custom-scrollbar md:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-foreground">ملخص الجلسة</h3>
                  <p className="mt-1 text-xs text-muted-foreground">نظرة سريعة قبل الانتقال إلى سند أو للراحة.</p>
                </div>
                <motion.span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-2xl"
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-muted-foreground">مدة الجلسة</p>
                  <p className="mt-1 text-sm font-black text-foreground">
                    {(() => {
                      const totalSec = Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000));
                      const minutes = Math.floor(totalSec / 60);
                      const hours = Math.floor(minutes / 60);
                      if (hours > 0) {
                        const remMin = minutes % 60;
                        return remMin > 0 ? `${hours} ساعة و ${remMin} دقيقة` : `${hours} ساعة`;
                      }
                      return `${minutes || 1} دقيقة`;
                    })()}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-muted-foreground">مدة التركيز على الفيديو (تقديري)</p>
                  <p className="mt-1 text-sm font-black text-foreground">
                    {maxFocusSpanSec
                      ? `${maxFocusSpanSec} ثانية متواصلة (إجمالي: ${focusSpanSec} ثانية)`
                      : "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-muted-foreground">تشغيل / إيقاف</p>
                  <p className="mt-1 text-sm font-black text-foreground">
                    {videoPlays} / {videoPauses}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/25 p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-muted-foreground">تكرار المقطع</p>
                  <p className="mt-1 text-sm font-black text-foreground">{videoReplays}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-2xl border border-border/60 bg-gradient-to-br from-muted/30 to-transparent p-5">
                <p className="text-sm font-black text-foreground">الجاهزية ووسيلة التعلّم</p>
                {newReadinessValue !== null ? (
                  <p className="text-sm leading-relaxed text-foreground">
                    تم رفع جاهزيتك بمقدار <b>{readinessDelta}%</b> (الحالية: <b>{newReadinessValue}%</b>).
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    سيتم تحديث نسبة الجاهزية عند ربط المادة بنظام الجاهزية.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  يبدو من تفاعلك أنك تميل أكثر إلى{" "}
                  <b className="text-foreground">
                    {preferred === "videos"
                      ? "مقاطع اليوتيوب"
                      : preferred === "flashcards"
                        ? "البطاقات التعليمية"
                        : preferred === "podcast"
                          ? "الشرح الصوتي"
                          : "الشرح النصي"}
                  </b>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setShowPreferredPicker((v) => !v)}
                  className="text-xs font-bold text-primary underline underline-offset-2"
                >
                  تعديل وسيلتي المفضلة يدوياً
                </button>
                <AnimatePresence>
                  {showPreferredPicker && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-wrap gap-2 overflow-hidden pt-1 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setPreferred("podcast")}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-bold transition-colors",
                          preferred === "podcast"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-foreground hover:bg-muted",
                        )}
                      >
                        🎧 أفضل أن أسمع
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferred("text")}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-bold transition-colors",
                          preferred === "text"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-foreground hover:bg-muted",
                        )}
                      >
                        📖 أفضل أن أقرأ
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferred("videos")}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-bold transition-colors",
                          preferred === "videos"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-foreground hover:bg-muted",
                        )}
                      >
                        📹 أفضل أن أشاهد
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferred("flashcards")}
                        className={cn(
                          "rounded-full border px-3 py-1.5 font-bold transition-colors",
                          preferred === "flashcards"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-foreground hover:bg-muted",
                        )}
                      >
                        🧠 أفضل البطاقات
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 rounded-2xl border border-primary/25 bg-gradient-to-l from-primary/10 to-primary/5 p-5">
                <p className="text-sm font-black text-foreground">
                  محادثة يومية مع سند تفتح لك آفاقاً جديدة وتجعلك أكثر جاهزية
                </p>
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSummary(false)}
                    className="rounded-xl border border-border bg-background/80 px-4 py-2.5 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-muted"
                  >
                    إغلاق
                  </button>
                  <Link
                    href="/sanad"
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                  >
                    الانتقال إلى سند
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
