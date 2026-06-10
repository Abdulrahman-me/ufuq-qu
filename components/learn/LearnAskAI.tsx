"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearnAskAIProps {
  chapterSummary: string;
  className?: string;
}

export function LearnAskAI({ chapterSummary, className }: LearnAskAIProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), chapterSummary }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? "عذراً، لم أتمكن من الإجابة.");
    } catch {
      setAnswer("حدث خطأ أثناء الاتصال بالمساعد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.4 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-5 shadow-lg backdrop-blur-xl ring-1 ring-primary/10 md:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -start-16 top-0 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.5 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-emerald-500/15 text-primary shadow-inner ring-1 ring-primary/20"
        >
          <Bot className="h-5 w-5" />
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-foreground">مساعد أفق</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Sparkles className="h-3 w-3" />
              ذكاء اصطناعي
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">اطرح سؤالك عن الدرس وسنوضحه لك بلغة بسيطة.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="مثال: لم أفهم الشريحة 5"
              className="flex-1 rounded-2xl border border-border/80 bg-background/80 px-4 py-2.5 text-sm shadow-inner backdrop-blur-sm transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <motion.button
              type="button"
              onClick={handleAsk}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-2xl bg-gradient-to-l from-[#1B8354] to-[#25935F] text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50 sm:self-auto"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
          {answer && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-foreground backdrop-blur-sm"
            >
              {answer}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
