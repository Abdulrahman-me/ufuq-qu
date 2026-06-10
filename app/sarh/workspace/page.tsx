'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  ExternalLink,
  BookOpen,
  HardDrive,
  ArrowRight,
  Circle,
  CheckCircle2,
  Map,
  FileText,
  GraduationCap,
  Link2,
  Loader2,
  Sparkles,
  Info,
  PlayCircle,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/sarh/ui/skeleton";
import { Checkbox } from "@/components/sarh/ui/checkbox";
import { useToast } from "@/hooks/sarh/use-toast";
import { generatePhaseTasks } from "@/lib/sarh/geminiService";
import { AnimatedBackground } from "@/components/sarh/AnimatedBackground";

import type {
  WorkspaceData,
  TaskChecklistItem,
  TaskDetailsItem,
} from "@/types/sarh/workspace";

export type { WorkspaceData };

function isTaskDetailsItem(item: TaskChecklistItem): item is TaskDetailsItem {
  return typeof item === "object" && item !== null && "title" in item;
}

function getTaskTitle(item: TaskChecklistItem): string {
  return isTaskDetailsItem(item) ? item.title : String(item);
}

const WORKSPACE_STORAGE_KEY = "sarh_workspace_data";
const CHECKED_TASKS_KEY = "sarh_checked_tasks";

function saveWorkspaceData(data: WorkspaceData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
  }
}

function loadWorkspaceData(): WorkspaceData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ───────────── Skeleton Loader ───────────── */
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6" dir="rtl">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Skeleton className="h-80 rounded-2xl lg:col-span-3" />
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/* ───────────── Main Component ───────────── */
export default function Workspace() {
  const router = useRouter();
  const { toast } = useToast();
  const archiveTriggered = useRef(false);

  // Load from localStorage (Next.js doesn't have route state by default for push)
  const [data, setData] = useState<WorkspaceData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loaded = loadWorkspaceData();
    if (loaded) {
      setData(loaded);
    }
  }, []);

  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (data) {
       try {
        const raw = localStorage.getItem(CHECKED_TASKS_KEY);
        if (raw) {
          setCheckedTasks(new Set(JSON.parse(raw)));
        }
      } catch {
        setCheckedTasks(new Set());
      }
    }
  }, [data]);

  const [thinkingTask, setThinkingTask] = useState<number | null>(null);
  const [isGeneratingNextPhase, setIsGeneratingNextPhase] = useState(false);


  const currentPhaseIndex = data?.currentPhaseIndex || 0;
  const currentPhase = data?.roadmap?.[currentPhaseIndex];
  const isLastPhase = currentPhaseIndex === (data?.roadmap?.length || 0) - 1;

  const handleCompletePhase = async () => {
    if (!data) return;
    if (isLastPhase) {
      toast({ title: "تهانينا!", description: "لقد أتممت كافة مراحل المشروع بنجاح!" });
      return;
    }

    setIsGeneratingNextPhase(true);
    try {
      const nextPhase = data.roadmap![currentPhaseIndex + 1];
      const result = await generatePhaseTasks(
        data.project_title,
        nextPhase.phase,
        nextPhase.tasks,
        data.task_checklist.map(t => getTaskTitle(t))
      );

      const newData: WorkspaceData = {
        ...data,
        task_checklist: result.task_checklist,
        currentPhaseIndex: currentPhaseIndex + 1
      };

      setData(newData);
      saveWorkspaceData(newData);
      setCheckedTasks(new Set());
      localStorage.removeItem(CHECKED_TASKS_KEY);


      toast({
        title: "تم الانتقال للمرحلة التالية",
        description: `بدأنا الآن في: ${nextPhase.phase}`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الاتصال",
        description: "فشل توليد مهام المرحلة التالية. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsGeneratingNextPhase(false);
    }
  };

  useEffect(() => {
    if (checkedTasks.size > 0 || localStorage.getItem(CHECKED_TASKS_KEY)) {
      localStorage.setItem(CHECKED_TASKS_KEY, JSON.stringify([...checkedTasks]));
    }
  }, [checkedTasks]);

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" dir="rtl">
        <p className="text-lg text-muted-foreground">لا توجد بيانات مشروع. ابدأ من الصفحة الرئيسية.</p>
        <button
          onClick={() => router.push("/sarh")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-3 font-bold text-primary-foreground"
        >
          <ArrowRight className="h-5 w-5" />
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const archiveFallbacks = [
    {
      project_name: "تطبيق التوصيات الذكي - Node.js",
      solution_hint: `// خوارزمية التوصية المبنية على المحتوى
function getRecommendations(userPrefs, items) {
  return items
    .map(item => ({
      ...item,
      score: calculateSimilarity(userPrefs, item.tags)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}`,
      task_name: "بناء نظام التوصيات",
    },
    {
      project_name: "نظام تحليل البيانات الضخمة",
      solution_hint: `import pandas as pd
import numpy as np

def clean_and_process(file_path):
    df = pd.read_csv(file_path)
    # معالجة القيم المفقودة وتحويل الأنواع
    df.fillna(df.mean(), inplace=True)
    return df.groupby('category').agg({'sales': 'sum'})`,
      task_name: "معالجة البيانات",
    },
    {
      project_name: "نظام التوصية المتقدم",
      solution_hint: `from surprise import SVD
from surprise import Dataset

# خوارزمية التصفية التعاونية SVD
class CollaborativeFiltering:
    def __init__(self):
        self.algo = SVD()
        
    def fit_and_predict(self, data, user_id, item_id):
        trainset = data.build_full_trainset()
        self.algo.fit(trainset)
        # التنبؤ بتقييم المستخدم
        prediction = self.algo.predict(user_id, item_id)
        return prediction.est`,
      task_name: "بناء خوارزمية التوصية",
    }
  ];

  const archiveData = data.archive_match || archiveFallbacks[Math.floor(Math.random() * archiveFallbacks.length)];

  const triggerArchiveNotification = (taskName: string) => {
    toast({
      title: "🔍 وجدنا لك حلاً جاهزاً!",
      description: `المهمة "${taskName}" تم تنفيذها سابقاً في مشروع "${archiveData.project_name}". يمكنك توفير الوقت بالاطلاع على خوارزميتهم.`,
      action: (
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem("sarh_archive_state", JSON.stringify({
                    project_name: archiveData.project_name,
                    solution_hint: archiveData.solution_hint,
                    task_name: taskName,
                }));
                router.push("/sarh/archive");
            }
          }}
          className="mt-2 flex items-center gap-1.5 rounded-lg bg-gradient-to-l from-[#1B8354] to-[#25935F] px-3 py-1.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          عرض الحل في الأرشيف
        </button>
      ),
    });
  };

  const toggleTask = (index: number) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);

      // Trigger archive logic when 3rd task (index 2) is checked
      if (index === 2 && next.has(2) && !archiveTriggered.current && data?.task_checklist?.length >= 3) {
        archiveTriggered.current = true;
        setThinkingTask(2); // show thinking on 3rd task
        setTimeout(() => {
          setThinkingTask(null);
          triggerArchiveNotification(getTaskTitle(data.task_checklist[2]));
        }, 3000);
      }

      return next;
    });
  };

  const completedCount = checkedTasks.size;
  const totalTasks = data.task_checklist?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30" dir="rtl">
      <AnimatedBackground />

      <div className="relative mx-auto max-w-7xl space-y-4 px-4 py-6">

        {/* ═══ Row 1: Header Card ═══ */}
        <header className="glass-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-foreground">
                {data.project_title}
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            </div>
            {data.notion_url && (
              <a
                href={data.notion_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80"
              >
                <ExternalLink className="h-4 w-4" />
                فتح في Notion
              </a>
            )}
          </div>
        </header>

        {/* ═══ Row 2: Roadmap (60%) + Tasks & Academic (40%) ═══ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">

          {/* ─── Left: Roadmap (3/5 = 60%) ─── */}
          {data.roadmap && data.roadmap.length > 0 && (
            <section className="glass-card p-4 lg:col-span-3">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <Map className="h-5 w-5 text-primary" />
                  خارطة الطريق التفاعلية
                </h2>
                <div className="text-[10px] font-bold text-muted-foreground bg-accent px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  المرحلة {currentPhaseIndex + 1} من {data.roadmap.length}
                </div>
              </div>

              <div className="relative space-y-0">
                {data.roadmap.map((phase, i) => {
                  const isCompleted = i < currentPhaseIndex;
                  const isActive = i === currentPhaseIndex;
                  return (
                    <div key={i} className={`relative flex gap-4 pb-6 ${!isActive && !isCompleted ? "opacity-40" : ""}`}>
                      {i < data.roadmap.length - 1 && (
                        <div className={`absolute right-[17px] top-10 h-full w-0.5 ${isCompleted ? "bg-gradient-to-l from-[#1B8354] to-[#25935F]" : "bg-border"}`} />
                      )}
                      <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-md transition-colors ${isCompleted ? "bg-gradient-to-l from-[#1B8354] to-[#25935F] text-primary-foreground" :
                        isActive ? "bg-gradient-to-l from-[#1B8354] to-[#25935F] text-primary-foreground shadow-primary/20" :
                          "bg-muted text-muted-foreground"
                        }`}>
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                      </div>
                      <div className={`flex-1 rounded-xl border p-4 transition-all ${isActive ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border bg-card"
                        }`}>
                        <h3 className={`mb-2 text-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}>{phase.phase}</h3>
                        <ul className="space-y-1">
                          {(phase.tasks || []).map((task, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <Circle className={`mt-0.5 h-2.5 w-2.5 shrink-0 ${isActive ? "text-primary/50" : "text-muted-foreground/30"}`} />
                              {task}
                            </li>
                          ))}
                        </ul>

                        {isActive && (
                          <button
                            onClick={handleCompletePhase}
                            disabled={isGeneratingNextPhase || progress < 80}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-l from-[#1B8354] to-[#25935F] py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingNextPhase ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            {isLastPhase ? "إتمام المشروع" : "إتمام المرحلة والانتقال للتالية"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Right: Tasks + Academic (2/5 = 40%) ─── */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* Tasks Checklist */}
            {data.task_checklist && data.task_checklist.length > 0 && (
              <section className="glass-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <CheckSquare className="h-5 w-5 text-primary" />
                    المهام التقنية
                  </h2>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                    {completedCount}/{totalTasks}
                  </span>
                </div>
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#1B8354] to-[#25935F] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {data.task_checklist.map((task, i) => (
                    <li
                      key={i}
                      onClick={() => toggleTask(i)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-all hover:bg-muted/50 ${thinkingTask === i ? "animate-pulse bg-primary/5 ring-1 ring-primary/20" : ""
                        }`}
                    >
                      {thinkingTask === i ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      ) : (
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                          <Checkbox
                            checked={checkedTasks.has(i)}
                            onCheckedChange={() => toggleTask(i)}
                          />
                        </div>
                      )}
                      <span
                        className={`flex-1 text-xs leading-relaxed ${checkedTasks.has(i) ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                      >
                        {getTaskTitle(task)}
                      </span>

                      <div className="flex items-center gap-1">
                        {isTaskDetailsItem(task) && task.smart_media?.youtube_video_id && (
                          <Video className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined') {
                                localStorage.setItem("sarh_task_details_state", JSON.stringify({
                                    task,
                                    projectTitle: data.project_title,
                                    taskIndex: i,
                                }));
                                router.push("/sarh/task-details");
                            }
                          }}
                          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          title="عرض تفاصيل المهمة"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>


              </section>
            )}

            {/* Academic Links */}
            {data.academic_links && data.academic_links.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
              >
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  الربط الأكاديمي
                </h2>
                <div className="space-y-3">
                  {data.academic_links.map((link, i) => (
                    <div key={i}>
                      <h3 className="mb-1.5 text-sm font-bold text-foreground">{link.subject}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(link.chapters || []).map((ch, j) => (
                          <span
                            key={j}
                            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>

        {/* ═══ Row 3: Resources Grid + Drive Note ═══ */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {data.resources && data.resources.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${data.drive_note ? "lg:col-span-3" : "lg:col-span-4"}`}
            >
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                <Link2 className="h-5 w-5 text-primary" />
                الموارد والمراجع
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card flex items-center gap-3 p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <ExternalLink className="h-4 w-4 text-primary" />
                    </div>
                    <span className="truncate text-sm font-medium text-foreground">{res.title}</span>
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {data.drive_note && (
            <section className="glass-card flex flex-col items-center justify-center gap-3 p-6 text-center lg:col-span-1">
              <HardDrive className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-foreground">{data.drive_note}</p>
              <p className="text-xs text-muted-foreground">نعمل على ربط مساحة العمل بملفاتك السحابية</p>
            </section>
          )}

          {!data.drive_note && (
            <section className="glass-card col-span-full flex flex-col items-center justify-center gap-3 p-6 text-center">
              <HardDrive className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-foreground">
                قريباً سيتم عرض ملفات Google Drive الخاصة بك هنا
              </p>
              <p className="text-xs text-muted-foreground">نعمل على ربط مساحة العمل بملفاتك السحابية</p>
            </section>
          )}
        </div>
      </div>
    </div >
  );
}
