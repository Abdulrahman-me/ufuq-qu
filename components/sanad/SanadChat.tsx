"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ClipboardList, Loader2, Send, Sparkles, X } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "student" | "sanad";
  content: string;
}

type SanadReport = {
  analysis: string[];
  strengths: string[];
  improvements: string[];
  actions: string[];
};

type SanadRecommendation = { title: string; detail: string };

export default function SanadChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "sanad",
      content:
        "هلا فيك. أنا سند، ودي أساعدك ترفع جاهزيتك بشكل ذكي. قبل نبدأ: وش أكثر شي تبي تحسّنه هالفترة؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [report, setReport] = useState<SanadReport | null>(null);
  const [recommendations, setRecommendations] = useState<SanadRecommendation[]>([]);
  const [schedulingNote, setSchedulingNote] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sessionSummary = useMemo(() => {
    try {
      const raw = localStorage.getItem("ufuq:lastSessionSummary");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const userId = "demo-user";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!sessionSummary) return;
    const key = "ufuq:sessionSummarySaved";
    if (localStorage.getItem(key) === "true") return;

    let cancelled = false;
    async function saveSessionMemory() {
      try {
        const res = await fetch("/api/sanad/session/close", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            sessionSummary,
            lastChatExcerpt: messages.slice(-8).map((m) => ({ sender: m.sender, content: m.content })),
          }),
        });
        const json = await res.json();
        if (!cancelled && res.ok && json?.ok) {
          localStorage.setItem(key, "true");
        }
      } catch {
        // ignore
      }
    }
    saveSessionMemory();
    return () => {
      cancelled = true;
    };
  }, [sessionSummary, userId, messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "student",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyToSend = [...messages, userMessage].map((m) => ({ sender: m.sender, content: m.content }));
      const studentTurnCount = historyToSend.filter((m) => m.sender === "student").length;
      /** ذاكرة الجلسات الطويلة تُحمّل للنموذج فقط بعد أول رد — بداية طبيعية ثم سياق عند الحاجة */
      const includeLongTermMemory = studentTurnCount >= 2;

      const res = await fetch("/api/sanad/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: historyToSend,
          sessionSummary,
          userId,
          includeLongTermMemory,
        }),
      });
      const data = await res.json();

      const sanadMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "sanad",
        content: data.reply ?? "تعذر الاتصال بنظام سند حالياً، حاول مرة أخرى لاحقاً.",
      };

      setMessages((prev) => [...prev, sanadMessage]);
      setReport(data.report ?? null);
      setRecommendations(Array.isArray(data.recommendations) ? data.recommendations : []);
      setSchedulingNote(typeof data.advisor_scheduling_note === "string" ? data.advisor_scheduling_note : null);

      if (data.auto_booking_created) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "sanad",
            content:
              "رتّبت لك متابعة تلقائية مع المرشد الأكاديمي ضمن أوقات العمل (من 8 صباحاً إلى 3 عصراً). فريق الدعم يتواصل معك قريباً — ما تحتاج تسوي حجز يدوي.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "sanad",
          content: "حدث خطأ أثناء الاتصال بسند. تأكد من الإعدادات وحاول من جديد.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/50 shadow-2xl backdrop-blur-xl ring-1 ring-primary/10"
      >
        <div className="pointer-events-none absolute -end-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-gradient-to-l from-muted/40 to-transparent px-4 py-4 md:px-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-emerald-500/20 text-primary shadow-inner ring-1 ring-primary/25"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            <div>
              <p className="text-sm font-black text-foreground">سند — وكيل تعلّم (AI Agent)</p>
              <p className="text-[11px] text-muted-foreground">
                يغلق حلقة الذكاء: بيانات الجلسات → تحليل → توصيات — ليس مجرد ردود جاهزة
              </p>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setReportOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-xs font-black shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <ClipboardList className="h-4 w-4 text-primary" />
            تقرير الجلسة والتوصيات
          </motion.button>
        </div>

        <div
          ref={scrollRef}
          className="custom-scrollbar relative flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5"
        >
          {messages.map((message, i) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              className={message.sender === "student" ? "flex justify-start" : "flex justify-end"}
            >
              <div
                className={
                  message.sender === "sanad"
                    ? "flex max-w-[88%] items-end gap-2 md:max-w-[82%]"
                    : "max-w-[88%] md:max-w-[82%]"
                }
              >
                {message.sender === "sanad" && (
                  <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={
                    message.sender === "student"
                      ? "rounded-2xl rounded-tr-sm border border-primary/25 bg-gradient-to-br from-primary to-emerald-600 px-4 py-3 text-sm font-medium leading-relaxed text-primary-foreground shadow-lg shadow-primary/20"
                      : "rounded-2xl rounded-tl-sm border border-border/80 bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm backdrop-blur-sm"
                  }
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-end pe-1">
              <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                سند يجهّز الرد…
              </div>
            </div>
          )}
        </div>

        <div className="relative border-t border-border/60 bg-gradient-to-t from-muted/20 to-transparent p-4 md:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <textarea
              className="min-h-[52px] flex-1 resize-none rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm shadow-inner backdrop-blur-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب لسند هنا…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={sendMessage}
              disabled={loading}
              className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 text-sm font-black text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 sm:w-auto sm:px-8"
            >
              <Send className="h-4 w-4" />
              إرسال
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {reportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-md"
            onClick={() => setReportOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="custom-scrollbar max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-xl md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-foreground">تقرير الجلسة والتوصيات</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    يظهر هنا تحليل سند والبطاقات التوصيفية بعد محادثتك — افتح النافذة عندما تحب تراجع الخلاصة.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="إغلاق"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {recommendations.length > 0 && (
                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  {recommendations.slice(0, 4).map((r, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="group rounded-2xl border border-border/70 bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm transition-shadow hover:border-primary/30 hover:shadow-md"
                    >
                      <p className="text-xs font-black text-primary">{r.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.detail}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {schedulingNote && (
                <div className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-foreground">
                  <p className="font-bold text-amber-800 dark:text-amber-200">ملاحظة للمتابعة</p>
                  <p className="mt-1 text-muted-foreground">{schedulingNote}</p>
                </div>
              )}

              {!report ? (
                <p className="text-sm text-muted-foreground">
                  اكتب لسند بعد المحادثة ليظهر هنا تحليل منظم. إن وُجدت توصيات فهي تظهر أعلاه في البطاقات.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {(
                    [
                      ["تحليل الجلسة", report.analysis],
                      ["نقاط القوة", report.strengths],
                      ["نقاط التحسين", report.improvements],
                      ["توصيات عملية", report.actions],
                    ] as const
                  ).map(([label, items]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4 backdrop-blur-sm"
                    >
                      <p className="text-sm font-black text-foreground">{label}</p>
                      <ul className="mt-2 list-disc space-y-1 pr-5 text-xs leading-relaxed text-muted-foreground">
                        {items.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
