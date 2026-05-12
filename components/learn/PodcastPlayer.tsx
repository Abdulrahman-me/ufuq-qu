"use client";

import { useEffect, useRef, useState } from "react";
import {
  Headphones,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PodcastPlayerProps {
  audioUrl: string | null;
  title: string;
  className?: string;
}

const SPEEDS = [1, 1.25, 1.5, 2] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PodcastPlayer({ audioUrl, title, className }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const volumeBeforeMuteRef = useRef(1);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState<(typeof SPEEDS)[number]>(1);
  const isDraggingProgressRef = useRef(false);
  const isDraggingVolumeRef = useRef(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;

    setDuration(0);
    setCurrentTime(0);
    setPlaying(false);

    const onTimeUpdate = () => {
      if (!isDraggingProgressRef.current) setCurrentTime(el.currentTime);
    };
    const onDurationChange = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      }
    };
    const onLoadedMetadata = () => {
      onDurationChange();
      setCurrentTime(el.currentTime);
    };
    const onCanPlay = () => onDurationChange();
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("loadeddata", onDurationChange);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("ended", onEnded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    el.volume = volume;
    el.playbackRate = playbackRate;
    el.load();

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("loadeddata", onDurationChange);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const skip = (deltaSec: number) => {
    const el = audioRef.current;
    if (!el) return;
    const d = Number.isFinite(el.duration) ? el.duration : Infinity;
    el.currentTime = Math.max(0, Math.min(d, el.currentTime + deltaSec));
    setCurrentTime(el.currentTime);
  };

  const seekToRatio = (ratio: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    const r = Math.max(0, Math.min(1, ratio));
    el.currentTime = r * el.duration;
    setCurrentTime(el.currentTime);
  };

  const onProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    if (!bar) return;
    e.preventDefault();
    isDraggingProgressRef.current = true;

    const update = (clientX: number) => {
      const rect = bar.getBoundingClientRect();
      seekToRatio((clientX - rect.left) / rect.width);
    };
    update(e.clientX);

    const onMove = (ev: PointerEvent) => update(ev.clientX);
    const onUp = () => {
      isDraggingProgressRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const setVolumeFromRatio = (ratio: number) => {
    const v = Math.max(0, Math.min(1, ratio));
    setVolume(v);
  };

  const onVolumeBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = volumeBarRef.current;
    if (!bar) return;
    e.preventDefault();
    isDraggingVolumeRef.current = true;

    const update = (clientX: number) => {
      const rect = bar.getBoundingClientRect();
      setVolumeFromRatio((clientX - rect.left) / rect.width);
    };
    update(e.clientX);

    const onMove = (ev: PointerEvent) => update(ev.clientX);
    const onUp = () => {
      isDraggingVolumeRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const volumePct = volume * 100;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/95 p-5 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.06] md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20">
          <Headphones className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-foreground">شرح صوتي مكمل</h3>
          <span className="mt-1 inline-block rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
            بودكاست أفق
          </span>
        </div>
      </div>
      <p className="mb-5 font-semibold text-foreground">{title}</p>

      {audioUrl ? (
        <div className="space-y-4">
          <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

          {/* شريط تقدم التشغيل */}
          <div className="space-y-1.5" dir="ltr">
            <div
              ref={progressRef}
              role="slider"
              tabIndex={0}
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration) || 0}
              aria-label="موضع التشغيل"
              className="group relative h-2.5 w-full cursor-pointer touch-none rounded-full bg-muted/80"
              onPointerDown={onProgressPointerDown}
              onKeyDown={(e) => {
                const el = audioRef.current;
                if (!el || !Number.isFinite(el.duration)) return;
                const step = 5;
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  skip(step);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  skip(-step);
                }
              }}
            >
              <div
                className="pointer-events-none absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-primary to-emerald-500"
                style={{ width: `${progressPct}%` }}
              />
              <div
                className="pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                style={{ left: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[11px] tabular-nums text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{Number.isFinite(duration) && duration > 0 ? formatTime(duration) : "—:—"}</span>
            </div>
          </div>

          {/* أزرار التشغيل والتخطي والسرعة */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => skip(-10)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-foreground transition-colors hover:bg-muted hover:text-primary"
                aria-label="إرجاع ١٠ ثوانٍ"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
                aria-label={playing ? "إيقاف" : "تشغيل"}
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="ms-0.5 h-6 w-6" />}
              </button>
              <button
                type="button"
                onClick={() => skip(10)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-foreground transition-colors hover:bg-muted hover:text-primary"
                aria-label="تقديم ١٠ ثوانٍ"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">السرعة</span>
              <div className="flex rounded-xl border border-border/60 bg-muted/30 p-0.5">
                {SPEEDS.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setPlaybackRate(rate)}
                    className={cn(
                      "min-w-[2.5rem] rounded-lg px-2 py-1.5 text-xs font-bold transition-colors",
                      playbackRate === rate
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {rate === 1 ? "1×" : rate === 1.25 ? "1.25×" : rate === 1.5 ? "1.5×" : "2×"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* التحكم بالصوت: شريط ملون + مقبض (وليس حقل range الافتراضي) */}
          <div
            className="flex items-center gap-3 border-t border-border/50 pt-4"
            dir="ltr"
          >
            <button
              type="button"
              onClick={() => {
                if (volume > 0) {
                  volumeBeforeMuteRef.current = volume;
                  setVolume(0);
                } else {
                  setVolume(volumeBeforeMuteRef.current > 0 ? volumeBeforeMuteRef.current : 1);
                }
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={volume === 0 ? "إلغاء كتم الصوت" : "كتم الصوت"}
            >
              {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">مستوى الصوت</p>
              <div
                ref={volumeBarRef}
                role="slider"
                tabIndex={0}
                aria-valuenow={Math.round(volume * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="مستوى الصوت"
                className="relative h-3 w-full cursor-pointer touch-none rounded-full bg-muted/90 p-0.5 shadow-inner"
                onPointerDown={onVolumeBarPointerDown}
                onKeyDown={(e) => {
                  const step = 0.05;
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault();
                    setVolumeFromRatio(volume + step);
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault();
                    setVolumeFromRatio(volume - step);
                  }
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full bg-muted/70">
                  <div
                    className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500"
                    style={{ width: `${volumePct}%` }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md ring-2 ring-violet-500/30"
                  style={{ left: `${volumePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          لم يتم توفير ملف بودكاست لهذا الفصل بعد. أضف ملفاً صوتياً (MP3 أو MP4) في{" "}
          <span className="font-semibold text-foreground">public/podcasts/</span> وربطه في{" "}
          <span className="font-semibold text-foreground">podcasts/podcast-audio-manifest.json</span> ثم شغّل سكربت
          المعالجة أو حدّث عمود podcast_audio_url في Supabase يدوياً.
        </p>
      )}
    </div>
  );
}
