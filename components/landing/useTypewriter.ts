"use client";

import { useEffect, useState, useRef } from "react";

export function useTypewriter(
  phrases: string[],
  typeMs = 45,
  holdMs = 2200,
  delMs = 28,
) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAll = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    clearAll();
    if (!phrases.length) return;

    const phrase = phrases[phraseIndex % phrases.length];
    let i = 0;

    const step = () => {
      if (i <= phrase.length) {
        setText(phrase.slice(0, i));
        i++;
        timers.current.push(setTimeout(step, typeMs));
      } else {
        timers.current.push(
          setTimeout(() => {
            let j = phrase.length;
            const delStep = () => {
              if (j >= 0) {
                setText(phrase.slice(0, j));
                j--;
                timers.current.push(setTimeout(delStep, delMs));
              } else {
                setPhraseIndex((p) => (p + 1) % phrases.length);
              }
            };
            delStep();
          }, holdMs),
        );
      }
    };

    step();
    return () => clearAll();
  }, [phraseIndex, phrases, typeMs, holdMs, delMs]);

  return text;
}
