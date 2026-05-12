"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePlacementResult, type PlacementPerSubject } from "@/lib/readiness";

type SubjectSlug =
  | "programming1"
  | "programming2"
  | "discrete_math"
  | "software_engineering"
  | "databases"
  | "ds_algo";

type Question = {
  id: string;
  subject: SubjectSlug;
  question: string;
  choices: string[];
  correctIndex: number;
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    subject: "programming1",
    question: "ما الناتج من تنفيذ التعليمة: 5 + 3 * 2 في معظم لغات البرمجة؟",
    choices: ["16", "11", "13", "10"],
    correctIndex: 1,
  },
  {
    id: "q2",
    subject: "programming1",
    question: "أي من التالي يُستخدم لتخزين مجموعة من العناصر من نفس النوع؟",
    choices: ["if", "array", "for", "return"],
    correctIndex: 1,
  },
  {
    id: "q3",
    subject: "programming2",
    question: "أي مصطلح يعبّر عن إعادة استخدام نفس اسم الدالة مع معاملات مختلفة؟",
    choices: ["Overloading", "Inheritance", "Encapsulation", "Polymorphism"],
    correctIndex: 0,
  },
  {
    id: "q4",
    subject: "programming2",
    question: "أي من التالي يصف مفهوم Encapsulation؟",
    choices: [
      "فصل الواجهة عن التنفيذ",
      "ربط البيانات مع الدوال التي تتعامل معها",
      "استخدام دوال لها نفس الاسم",
      "إعادة استخدام الكود عبر الوراثة",
    ],
    correctIndex: 1,
  },
  {
    id: "q5",
    subject: "ds_algo",
    question: "أي تركيب بيانات مناسب لتطبيق خوارزمية BFS؟",
    choices: ["Stack", "Queue", "Binary heap", "Hash table"],
    correctIndex: 1,
  },
  {
    id: "q6",
    subject: "ds_algo",
    question: "ما التعقيد الزمني لخوارزمية البحث الثنائي Binary search في أسوأ حالة؟",
    choices: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correctIndex: 2,
  },
  {
    id: "q7",
    subject: "software_engineering",
    question: "أي من التالي يصف مرحلة Requirements بشكل أدق؟",
    choices: [
      "كتابة الكود",
      "اختبار النظام",
      "تجميع وتحليل احتياجات الأطراف المعنية",
      "نشر النظام في بيئة الإنتاج",
    ],
    correctIndex: 2,
  },
  {
    id: "q8",
    subject: "software_engineering",
    question: "في منهجية Agile، أي من التالي صحيح؟",
    choices: [
      "خطة ثابتة لا تتغير",
      "تسليم دفعة واحدة في نهاية المشروع",
      "تكرار قصير مع تسليم مستمر للقيمة",
      "التركيز على التوثيق أكثر من الأفراد",
    ],
    correctIndex: 2,
  },
  {
    id: "q9",
    subject: "databases",
    question: "أي من التالي مثال على عبارة SELECT صحيحة في SQL؟",
    choices: [
      "SELECT * FROM;",
      "SELECT name, age users;",
      "SELECT name, age FROM users;",
      "SELECT FROM users WHERE;",
    ],
    correctIndex: 2,
  },
  {
    id: "q10",
    subject: "databases",
    question: "أي مفتاح يُستخدم لتمييز كل سجل عن الآخر في جدول قاعدة البيانات؟",
    choices: ["Foreign key", "Primary key", "Composite key", "Index"],
    correctIndex: 1,
  },
];

export default function PlacementPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number | null>>(() => {
    const initial: Record<string, number | null> = {};
    QUESTIONS.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  });
  const [startedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allAnswered = useMemo(
    () => QUESTIONS.every((q) => answers[q.id] !== null),
    [answers],
  );

  function handleSelect(questionId: string, index: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  }

  function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const finishedAt = Date.now();

    const perSubjectMap: Record<SubjectSlug, PlacementPerSubject> = {
      programming1: { subjectSlug: "programming1", correct: 0, total: 0 },
      programming2: { subjectSlug: "programming2", correct: 0, total: 0 },
      discrete_math: { subjectSlug: "discrete_math", correct: 0, total: 0 },
      software_engineering: {
        subjectSlug: "software_engineering",
        correct: 0,
        total: 0,
      },
      databases: { subjectSlug: "databases", correct: 0, total: 0 },
      ds_algo: { subjectSlug: "ds_algo", correct: 0, total: 0 },
    };

    let totalScore = 0;

    QUESTIONS.forEach((q) => {
      const chosen = answers[q.id];
      const per = perSubjectMap[q.subject];
      per.total += 1;
      if (chosen === q.correctIndex) {
        per.correct += 1;
        totalScore += 1;
      }
    });

    savePlacementResult({
      startedAt,
      finishedAt,
      totalScore,
      maxScore: QUESTIONS.length,
      perSubject: Object.values(perSubjectMap),
    });
    setAnalyzing(true);
    setTimeout(() => {
      router.push("/readiness/result");
    }, 1800);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (analyzing) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 md:px-10 flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-xl space-y-3 text-center">
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-bold text-foreground">
            سند يقوم بتحليل أدائك واقتراح خطة تعليمية مخصصة لك...
          </p>
          <p className="text-xs text-muted-foreground">
            يتم الآن توليد مؤشرات الجاهزية ورتبتك بين بقية الطلاب.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-foreground md:text-3xl">
            اختبار تحديد مستوى الجاهزية (MVP)
          </h1>
          <p className="text-sm text-muted-foreground">
            10 أسئلة تغطي برمجة 1 و 2، الخوارزميات وهياكل البيانات، هندسة البرمجيات،
            وقواعد البيانات.
          </p>
        </header>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              سؤال {currentIndex + 1} من {QUESTIONS.length}
            </span>
            <span className="tabular-nums">
              {Math.round((Object.values(answers).filter((v) => v !== null).length / QUESTIONS.length) * 100)}%
              مكتمل
            </span>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <p className="text-sm font-bold text-foreground">
              {currentIndex + 1}. {currentQuestion.question}
            </p>
            <div className="space-y-2">
              {currentQuestion.choices.map((choice, i) => {
                const selected = answers[currentQuestion.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(currentQuestion.id, i)}
                    className={
                      "w-full text-right rounded-xl border px-3 py-2 text-sm transition-colors " +
                      (selected
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border bg-card hover:bg-muted text-foreground")
                    }
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground disabled:opacity-40"
          >
            السابق
          </button>
          <button
            type="button"
            disabled={submitting || answers[currentQuestion.id] === null}
            onClick={() => {
              if (currentIndex < QUESTIONS.length - 1) {
                setCurrentIndex((i) => i + 1);
              } else {
                handleSubmit();
              }
            }}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {currentIndex < QUESTIONS.length - 1
              ? "السؤال التالي"
              : "إنهاء الاختبار وعرض النتيجة"}
          </button>
        </div>
      </div>
    </div>
  );
}

