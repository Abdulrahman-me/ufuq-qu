import { GEMINI_GENERATE_CONTENT_URL } from "./gemini/config";
import { geminiFetchWithRotation } from "./gemini/rotation";

export type ProcessedLesson = {
  summary: string;
  podcast_script: string;
  flashcards: { question: string; answer: string }[];
  youtube_queries: string[];
  quiz: { question: string; choices: string[]; correct_answer: string }[];
  key_concepts?: string[];
};

export async function generateLessonFromSlides(slideText: string): Promise<ProcessedLesson> {
  const prompt = `You are an educational content processor for an Arabic platform preparing students for the national readiness exam.
Input: Raw text extracted from course slides.

Output a valid JSON object only, no markdown, with this exact structure:
{
  "summary": "شرح مختصر ومبسط للدرس بالعربية (2-4 فقرات)",
  "podcast_script": "نص حوار تعليمي بين معلم وطالب بالعربية الفصحى أو اللهجة السعودية المبسطة، يشرح أفكار الدرس. على الأقل 300 كلمة.",
  "flashcards": [{"question": "سؤال بالعربية", "answer": "إجابة بالعربية"}, ...],
  "youtube_queries": ["استعلام بحث يوتيوب بالعربية أو الإنجليزية", ...],
  "quiz": [{"question": "سؤال اختيار من متعدد بالعربية", "choices": ["خيار أ", "خيار ب", "خيار ج", "خيار د"], "correct_answer": "نص الخيار الصحيح exactly as in choices"}, ...],
  "key_concepts": ["مفهوم 1", "مفهوم 2", ...]
}
Generate at least 4 flashcards, 3 quiz questions, 5 youtube_queries (search terms in Arabic or English for real educational videos). Use Arabic for user-facing text but keep technical/scientific terms in English (e.g. Binary heap, Divide and conquer, API) — do not translate them literally.

Slides text:
---
${slideText.slice(0, 28000)}
---`;

  const res = await geminiFetchWithRotation(
    GEMINI_GENERATE_CONTENT_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    },
    "generateLessonFromSlides",
  );

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  return JSON.parse(text) as ProcessedLesson;
}

export async function askAI(question: string, contextSummary: string): Promise<string> {
  const res = await geminiFetchWithRotation(
    GEMINI_GENERATE_CONTENT_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `أنت مساعد تعليمي لمنصة أفق. الطالب يطرح سؤالاً عن الدرس. اشرح بإيجاز وبالعربية فقط، مستخدماً ملخص الدرس التالي كسياق. احتفظ بالمصطلحات العلمية والتقنية بالإنجليزية (مثل Binary heap، Divide and conquer) ولا تترجمها حرفياً.\n\nملخص الدرس:\n${contextSummary.slice(0, 6000)}\n\nسؤال الطالب:\n${question}`,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.5 },
      }),
    },
    "askAI",
  );

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "عذراً، لم أتمكن من توليد إجابة.";
}
