import { supabase } from "@/lib/supabase";

export type SanadState = "HIGH" | "UNSTABLE" | "AT_RISK";
export type SanadRisk = "LOW" | "MEDIUM" | "HIGH";

export interface SanadAnalysis {
  student_id: string;
  student_state: SanadState;
  focus_duration: number;
  readiness_score: number;
  risk_level: SanadRisk;
  recommended_actions: string[];
  weak_topics: string[];
  learning_consistency: "HIGH" | "MEDIUM" | "LOW";
  // Optional enrichments from the advisor workflow (server may add these)
  human_flags?: {
    id: string;
    risk_level: SanadRisk;
    student_tier: "TOP_PERFORMER" | "FLUCTUATING" | "AT_RISK";
    reason: string | null;
    created_at: string;
    resolved: boolean;
  }[];
  memory_summary?: string | null;
}

/**
 * مؤقتاً: تحليل مبني على بيانات بسيطة / محاكاة لأجل العرض في الـ MVP.
 * لاحقاً يمكن ربطه فعلياً بجداول مثل student_progress ونتائج الكويز.
 */
export async function analyzeStudentMock(userId: string): Promise<SanadAnalysis> {
  // مثال بسيط: استخدم student_progress لو وجد، وإلا استخدم قيم افتراضية.
  let avgCompletion = 0;
  let lessonsCount = 0;

  try {
    const { data } = await supabase
      .from("student_progress")
      .select("completion_percentage")
      .eq("user_id", userId);

    if (data && data.length > 0) {
      lessonsCount = data.length;
      avgCompletion =
        data.reduce((sum, row) => sum + (row.completion_percentage ?? 0), 0) / lessonsCount;
    }
  } catch {
    // نتجاهل الخطأ في الـ MVP
  }

  // منطق بسيط لتحديد الحالة بناءً على متوسط الإكمال
  let student_state: SanadState = "UNSTABLE";
  let risk_level: SanadRisk = "MEDIUM";
  let readiness_score = Math.round(avgCompletion);
  const focus_duration = 30; // دقيقة، قيمة تقريبية في الـ MVP

  if (avgCompletion >= 80) {
    student_state = "HIGH";
    risk_level = "LOW";
  } else if (avgCompletion <= 40) {
    student_state = "AT_RISK";
    risk_level = "HIGH";
  }

  const recommended_actions: string[] = [];

  if (student_state === "HIGH") {
    recommended_actions.push(
      "الانتقال إلى مواد أكثر تقدماً في نفس المسار.",
      "حل تمارين تحدٍّ إضافية على المفاهيم الأساسية.",
      "العمل على مشروع قصير يطبق ما تعلمته حتى الآن."
    );
  } else if (student_state === "UNSTABLE") {
    recommended_actions.push(
      "مراجعة الدروس ذات الإكمال المنخفض قبل الانتقال لمحتوى جديد.",
      "استخدام البطاقات التعليمية Flashcards يومياً لمدة 15 دقيقة.",
      "تقسيم جلسات المذاكرة إلى فترات قصيرة من 25–30 دقيقة مع استراحات."
    );
  } else {
    recommended_actions.push(
      "إنشاء خطة تعافٍ من ثلاث خطوات تركز على أهم الوحدات في المنهج.",
      "تخصيص أوقات ثابتة يومية للمذاكرة ولو لمدة 20 دقيقة.",
      "عند الحاجة يرتّب سند تلقائياً متابعة مع المرشد الأكاديمي ضمن أوقات العمل — راقب رسائل التنبيه في المنصة.",
    );
  }

  const learning_consistency: SanadAnalysis["learning_consistency"] =
    avgCompletion >= 70 ? "HIGH" : avgCompletion >= 40 ? "MEDIUM" : "LOW";

  const weak_topics: string[] = []; // يمكن ملؤها لاحقاً من تحليل الكويز

  return {
    student_id: userId,
    student_state,
    focus_duration,
    readiness_score,
    risk_level,
    recommended_actions,
    weak_topics,
    learning_consistency,
  };
}

