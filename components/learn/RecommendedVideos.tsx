"use client";



import { useEffect, useRef, useState } from "react";

import { Youtube, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";



interface RecommendedVideosProps {

  queries: string[];

  className?: string;

  onVideoEvent?: (event: "play" | "pause" | "replay", payload?: { currentTime?: number }) => void;

}



interface VideoResult {

  videoId: string | null;

  title: string | null;

  query: string;

}



/** Must use /embed/ — watch URLs break iframe playback. */

function youtubeEmbedSrc(videoId: string) {

  const params = new URLSearchParams({

    enablejsapi: "1",

    rel: "0",

    modestbranding: "1",

    playsinline: "1",

    autoplay: "0",

  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

}



function loadYouTubeIframeApi(onReady: () => void) {

  const w = window as Window & { YT?: { Player: unknown }; onYouTubeIframeAPIReady?: () => void };

  if (w.YT?.Player) {

    onReady();

    return;

  }

  const prev = w.onYouTubeIframeAPIReady;

  w.onYouTubeIframeAPIReady = () => {

    prev?.();

    onReady();

  };

  const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

  if (!existing) {

    const tag = document.createElement("script");

    tag.src = "https://www.youtube.com/iframe_api";

    document.body.appendChild(tag);

  }

}



export function RecommendedVideos({ queries, className, onVideoEvent }: RecommendedVideosProps) {

  const [results, setResults] = useState<VideoResult[]>([]);

  const [loading, setLoading] = useState(true);

  const displayQueries = (queries ?? []).slice(0, 5);

  const playersRef = useRef<Record<string, { destroy?: () => void }>>({});

  const onVideoEventRef = useRef(onVideoEvent);

  const resultsRef = useRef(results);



  useEffect(() => {

    onVideoEventRef.current = onVideoEvent;

  }, [onVideoEvent]);



  useEffect(() => {

    resultsRef.current = results;

  }, [results]);



  const queryKey = displayQueries.join("\n");

  useEffect(() => {

    if (displayQueries.length === 0) {

      setLoading(false);

      return;

    }

    let cancelled = false;

    setLoading(true);

    Promise.all(

      displayQueries.map(async (q) => {

        try {

          const res = await fetch(`/api/youtube-search?q=${encodeURIComponent(q)}`);

          const data = await res.json();

          if (cancelled) return { videoId: null, title: null, query: q };

          return {

            videoId: data.videoId ?? null,

            title: data.title ?? null,

            query: q,

          };

        } catch {

          return { videoId: null, title: null, query: q };

        }

      }),

    ).then((arr) => {

      if (!cancelled) {

        setResults(arr);

        setLoading(false);

      }

    });

    return () => {

      cancelled = true;

    };

  }, [queryKey]);



  const hasQueries = displayQueries.length > 0;



  useEffect(() => {

    if (!results.length) return;



    let cancelled = false;



    function destroyPlayers() {

      Object.values(playersRef.current).forEach((p) => p?.destroy?.());

      playersRef.current = {};

    }



    function bindPlayers() {

      if (cancelled) return;

      const YT = (window as unknown as { YT: { Player: new (id: string, config: object) => { destroy?: () => void }; PlayerState: Record<string, number> } }).YT;

      if (!YT?.Player) return;



      destroyPlayers();



      const snapshot = resultsRef.current;

      snapshot.forEach((r, index) => {

        if (!r.videoId) return;

        const key = `${r.videoId}:${r.query}:${index}`;

        const elementId = `yt-embed-${key.replace(/[^a-zA-Z0-9_-]/g, "_")}`;

        const el = document.getElementById(elementId);

        if (!el || el.tagName !== "IFRAME") return;



        const player = new YT.Player(elementId, {

          events: {

            onStateChange: (event: { data: number; target: { getCurrentTime?: () => number } }) => {

              const state = event.data;

              const currentTime =

                typeof event.target.getCurrentTime === "function"

                  ? event.target.getCurrentTime()

                  : undefined;

              if (state === YT.PlayerState.PLAYING) {

                onVideoEventRef.current?.("play", { currentTime });

              } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {

                onVideoEventRef.current?.("pause", { currentTime });

              }

            },

          },

        });

        playersRef.current[key] = player;

      });

    }



    function scheduleBind() {

      requestAnimationFrame(() => {

        requestAnimationFrame(bindPlayers);

      });

    }



    loadYouTubeIframeApi(scheduleBind);



    return () => {

      cancelled = true;

      destroyPlayers();

    };

  }, [results]);



  return (

    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>

      <div className="flex items-center gap-2 mb-4">

        <Youtube className="h-5 w-5 text-primary" />

        <h3 className="font-bold text-foreground">فيديوهات موصى بها</h3>

      </div>

      {!hasQueries ? (

        <p className="text-sm text-muted-foreground">لا توجد اقتراحات فيديو لهذا الفصل بعد.</p>

      ) : loading ? (

        <div className="flex items-center gap-2 text-muted-foreground">

          <Loader2 className="h-4 w-4 animate-spin" />

          <span className="text-sm">جاري تحميل الفيديوهات...</span>

        </div>

      ) : (

        <ul className="space-y-4">

          {results.map((r, i) => {

            const stableKey = r.videoId ? `${i}-${r.query}::${r.videoId}` : `empty-${i}-${r.query}`;

            const iframeId = r.videoId

              ? `yt-embed-${`${r.videoId}:${r.query}:${i}`.replace(/[^a-zA-Z0-9_-]/g, "_")}`

              : "";

            return (

              <li key={stableKey}>

                {r.videoId ? (

                  <div className="space-y-3">

                    {r.title && (

                      <p className="text-sm font-medium text-foreground line-clamp-2">{r.title}</p>

                    )}

                    <div className="relative aspect-video w-full min-h-[180px] overflow-hidden rounded-lg bg-black mt-1">

                      <iframe

                        id={iframeId}

                        title={r.title ?? "YouTube"}

                        src={youtubeEmbedSrc(r.videoId)}

                        className="absolute inset-0 h-full w-full border-0"

                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

                        allowFullScreen

                        loading="eager"

                      />

                    </div>

                  </div>

                ) : (

                  <p className="text-xs text-muted-foreground">

                    لم يتوفر فيديو مناسب لهذه الكلمات المفتاحية بعد.

                  </p>

                )}

              </li>

            );

          })}

        </ul>

      )}

    </div>

  );

}

