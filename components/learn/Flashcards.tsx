"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export type FlashcardItem = { question: string; answer: string };

interface FlashcardsProps {
  cards: FlashcardItem[];
  className?: string;
}

export function Flashcards({ cards, className }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const hasCards = cards.length > 0;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">البطاقات التعليمية</h3>
      </div>
      {hasCards ? (
        <>
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="w-full rounded-2xl border-2 border-primary bg-primary/10 p-6 text-right min-h-[180px] flex flex-col items-center justify-center gap-4 transition-all hover:bg-primary/15"
          >
            <p className="text-lg font-medium text-foreground">
              {flipped ? card.answer : card.question}
            </p>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {flipped ? "الظهر" : "اقلب البطاقة"}
            </span>
          </button>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => { setIndex((i) => (i > 0 ? i - 1 : cards.length - 1)); setFlipped(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {index + 1} / {cards.length}
            </span>
            <button
              type="button"
              onClick={() => { setIndex((i) => (i < cards.length - 1 ? i + 1 : 0)); setFlipped(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">لا توجد بطاقات لهذا الفصل بعد.</p>
      )}
    </div>
  );
}
