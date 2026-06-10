"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlacementResult, getSubjectReadiness } from "@/lib/readiness";

export default function ReadinessResultPage() {
  const router = useRouter();
  const result = useMemo(() => getPlacementResult(), []);
  const readiness = useMemo(() => getSubjectReadiness(), []);

  useEffect(() => {
    if (!result) {
      router.replace("/readiness/placement");
    }
  }, [result, router]);

  if (!result) return null;

  const durationMs = result.finishedAt - result.startedAt;
  const durationSec = Math.max(1, Math.round(durationMs / 1000));

  const perSubjects = result.perSubject.filter((p) => p.total > 0);
  const highest = perSubjects.reduce((best, cur) => {
    const curScore = cur.correct / cur.total;
    const bestScore = best.correct / best.total;
    return curScore > bestScore ? cur : best;
  }, perSubjects[0]);

  const lowest = perSubjects.reduce((worst, cur) => {
    const curScore = cur.correct / cur.total;
    const worstScore = worst.correct / worst.total;
    return curScore < worstScore ? cur : worst;
  }, perSubjects[0]);

  const subjectNames: Record<string, string> = {
    programming1: "برمجة 1",
    programming2: "برمجة 2",
    discrete_math: "الرياضيات المتقطعة",
    software_engineering: "هندسة البرمجيات",
    databases: "قواعد البيانات",
    ds_algo: "الخوارزميات وهياكل البيانات",
  };

  const totalReadiness = Math.round((result.totalScore / result.maxScore) * 100);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 text-center">
          <h1 className="text-2xl font-black text-foreground md:text-3xl">
            نتائج اختبار تحديد مستوى الجاهزية
          </h1>
          <p className="text-sm text-muted-foreground">
            هذه الصورة المبدئية لمستوى جاهزيتك بناءً على إجاباتك في الاختبار.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">نسبة الجاهزية الكلية</p>
            <p className="text-3xl font-black text-primary">{totalReadiness}%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-l from-[#1B8354] to-[#25935F] transition-all"
                style={{ width: `${totalReadiness}%` }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">عدد الأسئلة</p>
            <p className="text-2xl font-black text-foreground">{result.maxScore}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">الزمن المستغرق</p>
            <p className="text-2xl font-black text-foreground">{durationSec} ثانية</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">ترتيبك بين الطلاب (تقديري)</p>
            <p className="text-sm font-bold text-foreground">
              {totalReadiness >= 80
                ? "أنت ضمن أعلى 20% من الطلاب"
                : totalReadiness >= 60
                  ? "أنت ضمن أعلى 40% من الطلاب"
                  : totalReadiness >= 40
                    ? "أنت ضمن أعلى 60% من الطلاب"
                    : "أنت ضمن أعلى 80% من الطلاب"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">أكثر مادة جاهزية</p>
            <p className="text-sm font-bold text-foreground">
              {subjectNames[highest.subjectSlug] ?? highest.subjectSlug}
            </p>
            <p className="text-xs text-muted-foreground">
              {highest.correct} من {highest.total} أسئلة صحيحة
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground">أقل مادة جاهزية</p>
            <p className="text-sm font-bold text-foreground">
              {subjectNames[lowest.subjectSlug] ?? lowest.subjectSlug}
            </p>
            <p className="text-xs text-muted-foreground">
              {lowest.correct} من {lowest.total} أسئلة صحيحة
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <p className="text-sm font-bold text-foreground">توصية فورية من سند</p>
          <p className="text-xs text-muted-foreground">
            ننصحك بالبدء بمادة{" "}
            <span className="font-bold text-primary">
              {subjectNames[lowest.subjectSlug] ?? lowest.subjectSlug}
            </span>{" "}
            لأنها الأضعف حالياً لديك، مع الحفاظ على مراجعة سريعة لمادة{" "}
            <span className="font-bold">
              {subjectNames[highest.subjectSlug] ?? highest.subjectSlug}
            </span>{" "}
            لتثبيت مستواك العالي فيها.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-bold text-foreground">تفصيل نسبة الجاهزية لكل مادة</p>
          <ul className="space-y-3 text-xs text-foreground">
            {Object.entries(readiness).map(([slug, value]) => (
              <li key={slug} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>{subjectNames[slug] ?? slug}</span>
                  <span className="font-bold">{value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/80 transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-4">
          <Link
            href="/learn"
            className="rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-2 text-sm font-bold text-primary-foreground"
          >
            الانتقال إلى المنصة التعليمية
          </Link>
        </div>
      </div>
    </div>
  );
}

