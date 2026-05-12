"use client";

import { useState } from "react";
import { CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizItem = {
  question: string;
  choices: string[];
  correct_answer: string;
};

interface QuizProps {
  questions: QuizItem[];
  className?: string;
}

export function Quiz({ questions, className }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = finished ? null : questions[current];
  const hasQuestions = questions.length > 0;
  const answered = selected !== null;
  const totalCorrect = results.filter(Boolean).length;

  const goNext = () => {
    if (!q) return;
    setResults((r) => [...r, selected === q.correct_answer]);
    if (current < questions.length - 1) {
      setSelected(null);
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setResults([]);
    setFinished(false);
  };

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">تحدي سريع</h3>
      </div>
      {hasQuestions ? (
        finished ? (
          <div className="space-y-3">
            <p className="text-sm font-bold text-foreground">نتيجة التحدي السريع</p>
            <p className="text-sm text-foreground">
              أجبت بشكل صحيح على{" "}
              <span className="font-bold text-primary">
                {totalCorrect} من {questions.length}
              </span>{" "}
              من الأسئلة.
            </p>
            <p className="text-xs text-muted-foreground">
              يمكنك إعادة التحدي في أي وقت لتحسين مستواك.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 w-full py-2 rounded-xl border border-border text-sm font-bold hover:bg-muted"
            >
              إعادة التحدي
            </button>
          </div>
        ) : q ? (
          <>
            <p className="text-lg text-foreground mb-4">{q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => !answered && setSelected(choice)}
                  className={cn(
                    "p-4 rounded-xl border text-right flex items-center justify-between gap-2 transition-all",
                    selected === choice
                      ? choice === q.correct_answer
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-destructive/50 bg-destructive/10 text-destructive"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <span>{choice}</span>
                  {answered && selected === choice && (
                    <CheckCircle
                      className={cn(
                        "h-5 w-5 shrink-0",
                        choice === q.correct_answer ? "text-primary" : "text-destructive",
                      )}
                    />
                  )}
                </button>
              ))}
            </div>
            {answered && (
              <button
                type="button"
                onClick={goNext}
                className="mt-4 w-full py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
              >
                {current < questions.length - 1 ? "السؤال التالي" : "اعرض النتيجة"}
              </button>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              السؤال {current + 1} من {questions.length}
            </p>
          </>
        ) : null
      ) : (
        <p className="text-sm text-muted-foreground">لا توجد أسئلة لهذا الفصل بعد.</p>
      )}
    </div>
  );
}
