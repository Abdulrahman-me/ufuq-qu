'use client';

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Zap,
  BookOpen,
  Layers,
  ArrowLeft,
  Clock,
  TrendingUp,
  BookMarked,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  Cpu,
  Lightbulb,
  Globe,
  Plus,
  Brain,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/sarh/use-toast";
import {
  projectsData,
  ALL_SUBJECTS,
  CAREER_PATHS,
  type ProjectItem,
  type CareerPath,
} from "@/data/sarh/projects";
import { Sparkline } from "@/components/sarh/Sparkline";
import { DifficultyRing } from "@/components/sarh/DifficultyRing";
import { generateSarhWorkspace } from "@/lib/sarh/geminiService";
import { AnimatedBackground } from "@/components/sarh/AnimatedBackground";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/sarh/ui/accordion";

const badgeColors: Record<string, string> = {
  "الجبر الخطي": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "الإحصاء": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "الذكاء الاصطناعي": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "التفاضل والتكامل": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "برمجة 1": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "نظم قواعد البيانات": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "الخوارزميات": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "تراكيب البيانات": "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

const MOCK_STATS = [
  {
    label: "أكثر المهارات طلباً هذا الأسبوع",
    items: ["Python", "React", "SQL", "ML"],
    sparkData: [40, 55, 70, 65, 82, 88, 90],
  },
  {
    label: "المواد الأكثر ربطاً بالمشاريع",
    items: ["برمجة 1", "الإحصاء", "AI", "DB"],
    sparkData: [20, 35, 50, 45, 62, 75, 78],
  },
];

const features = [
  { icon: Zap, title: "تجهيز فوري", desc: "وفّر ساعات من التخطيط؛ منصة صرح تجهز لك كل ما تحتاجه للبدء في التنفيذ الآن." },
  { icon: BookOpen, title: "ربط المقررات", desc: "تحويل المقررات النظرية إلى مشاريع تطبيقية حقيقية" },
  { icon: Layers, title: "خبرات سابقة", desc: "الاستفادة من أرشيف مشاريع الزملاء لتسريع رحلتك" },
];

const userJourney = [
  { step: "01", title: "اختر مسارك", desc: "حدد المواد أو المهارات التي تريد تطويرها" },
  { step: "02", title: "هندسة المشروع", desc: "يقوم الذكاء الاصطناعي بتصميم صرحك الخاص" },
  { step: "03", title: "باشر البناء", desc: "استلم بيئة العمل والمهام وابدأ رحلة التعلم" },
];

const testimonials = [
  { name: "عبدالله العتيبي", role: "طالب هندسة برمجيات", content: "حوّل صرح دراستي النظرية إلى واقع ملموس. الآن أملك معرض أعمال قوي بفضل المشاريع التي بنيتها هنا." },
  { name: "سارة القحطاني", role: "طالبة علوم بيانات", content: "فكرة ربط المواد ببعضها في مشروع واحد عبقرية. سهلت علي فهم الإحصاء وتطبيقه برمجياً." },
  { name: "فهد الدوسري", role: "مطور تطبيقات", content: "الخلفية التقنية والمهام المرتبة جعلتني أركز على البرمجة بدلاً من تضييع الوقت في التخطيط." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function Typewriter({ texts, speed = 100, wait = 2000 }: { texts: string[], speed?: number, wait?: number }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout = setInterval(() => setBlink(prev => !prev), 500);
    return () => clearInterval(timeout);
  }, []);

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), wait);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, speed, wait]);

  return (
    <span>
      {texts[index].substring(0, subIndex)}
      <span className={blink ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}

export default function IndexPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"single" | "multi">("single");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [careerPath, setCareerPath] = useState<CareerPath | "all">("all");
  const projectInputRef = useRef<HTMLTextAreaElement>(null);

  const projects = useMemo(() => {
    let list = projectsData.filter((p) => p.type === filter);
    if (selectedSubjects.length > 0) {
      list = list.filter((p) => selectedSubjects.every((s) => p.badges.includes(s)));
    }
    if (careerPath !== "all") {
      list = list.filter((p) => p.careerPaths.includes(careerPath));
    }
    return list.slice(0, 9);
  }, [filter, selectedSubjects, careerPath]);

  const canBuild = description.trim() || selectedProject;

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const addToDescription = (text: string) => {
    setDescription(prev => prev ? `${prev}, ${text}` : text);
    projectInputRef.current?.focus();
  };

  const saveWorkspaceData = (data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("sarh_workspace_data", JSON.stringify(data));
    }
  };

  const handleBuild = async () => {
    if (!canBuild) return;
    setLoading(true);
    const selected = projectsData.find((p) => p.title === selectedProject);
    const courses = selected ? selected.badges : [];
    try {
      const userPrompt = description.trim();
      const projectTitle = selected?.title || userPrompt || "";
      const projectDescription = selected?.description || "";
      const coursesString = courses.length > 0 ? courses.join(", ") : "";
      const data = await generateSarhWorkspace({ projectTitle, projectDescription, courses: coursesString, userPrompt });

      if (data) {
        toast({ title: "تم تجهيز صرحك بنجاح!" });
        const workspaceData = {
          project_title: data.project_title || projectTitle,
          description: data.project_description || data.description || projectDescription,
          roadmap: data.roadmap || [],
          task_checklist: (data.task_checklist || data.tasks || []).map((t: any) => ({
            ...t,
            title: t.title || (typeof t === "string" ? t : ""),
            resources: t.smart_media?.youtube_query
              ? [{ title: `بحث يوتيوب: ${t.smart_media.youtube_query}`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(t.smart_media.youtube_query)}` }, ...(t.smart_media?.references || [])]
              : (t.resources || [])
          })),
          academic_links: data.academic_links || data.academic_link || [],
          resources: data.resources || [],
          drive_note: data.drive_note || "",
          notion_url: data.notion_url || "",
          archive_match: data.archive_match ? { project_name: data.archive_match.related_project || data.archive_match.project_name || "", solution_hint: data.archive_match.solution_hint || "", task_name: data.archive_match.task_name || "" } : undefined
        };
        localStorage.removeItem("sarh_checked_tasks");
        saveWorkspaceData(workspaceData);
        // In Next.js, we don't have navigate state, so we rely on localStorage
        router.push("/sarh/workspace");
        if (workspaceData.notion_url) window.open(workspaceData.notion_url, "_blank");
      } else {
        toast({ 
          variant: "destructive",
          title: "خطأ في البيانات", 
          description: "لم يتم استلام بيانات المشروع من الخادم." 
        });
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      toast({ 
        variant: "destructive",
        title: "حدث خطأ أثناء الإرسال", 
        description: "يرجى المحاولة مرة أخرى، قد يكون هناك ضغط على الخادم." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30" dir="rtl">
      <AnimatedBackground />

      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background/90 backdrop-blur-xl">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-16 w-16 animate-spin text-primary relative" />
          </div>
          <p className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            جاري هندسة صرحك وتجهيز المخططات الأكاديمية...
          </p>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Navigation / Header */}
        <header className="flex h-20 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-8 text-sm font-medium text-muted-foreground"
          >
            <a href="#about" className="hover:text-primary transition-colors">عن صرح</a>
            <a href="#projects" className="hover:text-primary transition-colors">المشاريع</a>
            <a href="#builder" className="hover:text-primary transition-colors">ابنِ مشروعك</a>
          </motion.div>
        </header>

        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center pt-16 pb-32 min-h-[90vh] text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            منصة ذكية للطلاب الجامعيين
          </motion.div>
          <motion.h1 variants={itemVariants} className="mb-6 text-5xl font-black tracking-tight text-foreground sm:text-7xl">
            شيّد واقعك <span className="text-primary font-black">التقني</span> اليوم
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            صرح هو مختبرك الشخصي لتحويل المقررات الجامعية النظرية إلى مشاريع عملية احترافية. ابنِ مستقبلك، مشروعاً تلو الآخر.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              ابدأ بناء مشروعك
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary px-8 py-4 text-base font-bold transition-all hover:bg-muted"
            >
              تصفح الأفكار
            </button>
          </motion.div>
        </motion.section>

        {/* Features & Stats */}
        <motion.section
          id="about"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-32 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card group p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Why Unique Section */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl font-black mb-8 leading-tight">لماذا صرح <span className="text-primary italic">مختلف؟</span></h2>
              <div className="space-y-6">
                {[
                  { icon: Cpu, title: "ذكاء اصطناعي أكاديمي", desc: "نظامنا يفهم المناهج الجامعية السعودية ويطوعها لمشاريع السوق." },
                  { icon: Lightbulb, title: "توجيه ذكي", desc: "كل مهمة تأتي مع روابط ومصادر تعليمية من يوتيوب ومراجع أكاديمية." },
                  { icon: Globe, title: "صقل الخبرة", desc: "نمنحك الخبرة التي يطلبها أصحاب العمل قبل أن تنهي دراستك الجامعية." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="aspect-square w-full rounded-[2rem] bg-secondary border border-border p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-black/[0.02]" />
                <div className="relative h-full w-full rounded-[1.5rem] bg-card border border-border p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black">S</div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white">سلطان علي</div>
                      <div className="text-[10px] text-muted-foreground">@sultan_dev</div>
                    </div>
                  </div>
                  <div className="space-y-4 min-h-[120px]">
                    <div className="text-lg font-medium leading-relaxed">
                      أريد بناء <span className="text-primary font-bold"><Typewriter texts={["تطبيق اذكار", "تطبيق اخبار", "موقع تعليمي", "منصة تواصل", "تطبيق تجاري"]} /></span>
                      <br />
                      باستخدام <span className="text-blue-400 font-bold"><Typewriter texts={["Flutter", "Python", "React", "Swift"]} /></span>
                      <br />
                      مع ربط مادتي <span className="text-emerald-400 font-bold opacity-90"><Typewriter texts={["البرمجة والتفاضل", "نظم قواعد البيانات والجبر الخطي", "البرمجة", "الخوارزميات والتفاضل", "تراكيب البيانات"]} /></span>
                    </div>
                  </div>
                  <div className="mt-12 flex justify-end">
                    <button className="h-12 px-6 rounded-full bg-primary text-primary-foreground text-sm font-black shadow-lg shadow-primary/20">
                      ابدأ البناء
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* User Journey */}
        <section className="mb-32 text-center">
          <h2 className="text-4xl font-black mb-16">رحلتك من الفكرة إلى <span className="text-primary italic">الواقع</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {userJourney.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="text-8xl font-black text-primary/20 absolute -top-12 left-1/2 -translate-x-1/2 uppercase">
                  {step.step}
                </div>
                <h4 className="text-2xl font-bold mb-4 relative z-10">{step.title}</h4>
                <p className="text-muted-foreground relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Motivation Section */}
        <section className="mb-32 scale-90 sm:scale-95 origin-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 sm:px-16 text-center"
          >
            <div className="absolute inset-0 bg-[#000]/10 mix-blend-overlay" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl sm:text-5xl font-black leading-tight text-primary-foreground md:whitespace-nowrap">
                مستقبلك المهني يبدأ بـ "حجر بناء" واحد
              </h2>
              <p className="mx-auto max-w-2xl text-base sm:text-lg font-medium text-primary-foreground/80 mb-8">
                الشركات لا تبحث عن معدلك التراكمي فقط، بل تبحث عما تستطيع بناءه. صرح يضعك في الطريق الصحيح لتكون مرغوباً في سوق العمل قبل التخرج.
              </p>
              <div className="flex justify-center flex-wrap gap-6 text-primary-foreground font-black text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> بناء معرض أعمال</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> خبرة عملية</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> جاهزية تقنية</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
            <h2 className="text-4xl font-black">قصص نجاح من <span className="text-primary italic">صرح</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-10 flex flex-col"
              >
                <p className="text-lg italic text-muted-foreground mb-8">"{t.content}"</p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-black">
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{t.name}</h5>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended Projects section */}
        <section id="projects" className="mb-32 scroll-mt-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-black text-foreground">صروح مقترحة</h2>
              <p className="text-muted-foreground">مشاريع جاهزة للتنفيذ فوراً</p>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="inline-flex rounded-full bg-secondary p-1 border border-border">
                <button
                  onClick={() => { setFilter("single"); setSelectedProject(null); }}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${filter === "single" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"}`}
                >
                  مادة واحدة
                </button>
                <button
                  onClick={() => { setFilter("multi"); setSelectedProject(null); }}
                  className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${filter === "multi" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"}`}
                >
                  مواد متعددة
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border-none glass-card px-6">
                <AccordionTrigger className="py-5 hover:no-underline group">
                  <div className="flex items-center gap-3 text-lg font-bold transition-colors group-hover:text-primary">
                    <BookMarked className="h-6 w-6" />
                    تصفية حسب المواد والمسارات
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-8 pt-4">
                  <div className="flex flex-col gap-10">
                    <div>
                      <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-muted-foreground">المواد الجامعية</h4>
                      <div className="flex flex-wrap gap-3">
                        {ALL_SUBJECTS.map((subject) => {
                          const isActive = selectedSubjects.includes(subject);
                          return (
                            <button
                              key={subject}
                              onClick={() => toggleSubject(subject)}
                              className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${isActive ? badgeColors[subject] || "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "border-white/5 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white"}`}
                            >
                              {subject}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-4 text-sm font-black uppercase tracking-widest text-muted-foreground">المسار المهني المستهدف</h4>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setCareerPath("all")}
                          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${careerPath === "all" ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
                        >
                          الكل
                        </button>
                        {CAREER_PATHS.map((cp) => (
                          <button
                            key={cp.id}
                            onClick={() => setCareerPath(cp.id)}
                            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${careerPath === cp.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
                          >
                            {cp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {projects.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center glass-card">
                  <Sparkles className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-xl font-bold text-muted-foreground">لا توجد مشاريع تطابق هذه المعايير</p>
                </motion.div>
              ) : (
                projects.map((project, i) => (
                  <motion.div
                    key={project.title}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelectedProject(selectedProject === project.title ? null : project.title)}
                    className={`glass-card group flex flex-col p-6 cursor-pointer border-2 shadow-none transition-all duration-500 ${selectedProject === project.title ? "border-primary bg-primary/10 ring-8 ring-primary/5" : "border-border hover:border-primary/20"}`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <DifficultyRing difficulty={project.difficulty} />
                      <div className="rounded-full bg-secondary px-3 py-1 text-[10px] font-black tracking-widest text-muted-foreground uppercase border border-border">
                        {project.estimatedWeeks.min}-{project.estimatedWeeks.max} أسابيع
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-black">{project.title}</h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.badges.map((badge) => (
                        <span key={badge} className={`rounded-md border px-2.5 py-1 text-[10px] font-bold ${badgeColors[badge] || "border-white/5 bg-white/5 text-muted-foreground"}`}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={handleBuild}
              disabled={!canBuild || loading}
              className="rounded-2xl bg-primary px-12 py-5 text-xl font-black text-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30 disabled:opacity-50"
            >
              {loading ? "جاري التجهيز..." : "شيّد صرحك الآن"}
            </button>
          </div>
        </section>

        {/* Custom Project Builder */}
        <section id="builder" className="mb-32 scroll-mt-20">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-black mb-4 tracking-tighter">هندسة <span className="text-primary">صرحك</span> الخاص</h2>
            <p className="text-muted-foreground text-lg">صف فكرتك، أو اختر المواد والتقنيات لتصميم بيئة عملك فوراً</p>
          </div>
          <div className="glass-card p-1 sm:p-2 bg-white/[0.02]">
            <div className="rounded-[1.5rem] bg-card border border-border p-4 sm:p-10">
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <h4 className="mb-4 text-sm font-black uppercase text-muted-foreground tracking-widest">وصف المشروع</h4>
                  <textarea
                    ref={projectInputRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: أريد بناء نظام ذكي لإدارة مطعم يربط بين تطبيق الجوال ونظام المحاسبة باستخدام بايثون..."
                    className="min-h-[220px] w-full resize-none rounded-2xl bg-secondary p-6 text-xl leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background border border-border"
                  />
                </div>
                <div>
                  <h4 className="mb-4 text-sm font-black uppercase text-muted-foreground tracking-widest">إكمال تلقائي ذكي</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-xs font-bold text-muted-foreground">نوع المشروع</p>
                      <div className="flex flex-wrap gap-2">
                        {["موقع ويب", "تطبيق جوال", "ذكاء اصطناعي", "برنامج سطح مكتب"].map(item => (
                          <button key={item} onClick={() => addToDescription(item)} className="rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors">
                            <Plus className="inline h-3 w-3 mr-1" /> {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-xs font-bold text-muted-foreground">التقنيات</p>
                      <div className="flex flex-wrap gap-2">
                        {["Node.js", "React", "Python", "SQL", "Firebase"].map(item => (
                          <button key={item} onClick={() => addToDescription(item)} className="rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs font-bold hover:bg-muted transition-colors">
                            <Plus className="inline h-3 w-3 mr-1" /> {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center justify-between gap-8 pt-8 border-t border-white/5 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MousePointer2 className="h-4 w-4" />
                  اضغط لتشييد الصرح
                </div>
                <button
                  onClick={handleBuild}
                  disabled={!canBuild || loading}
                  className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-primary px-12 py-5 text-xl font-black text-black shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "جاري التجهيز..." : "شيّد صرحك الآن"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Stats */}
        <section className="pb-32">
          <div className="rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-border bg-secondary/50">
            {MOCK_STATS.map((stat, i) => (
              <div key={i} className="flex items-center gap-6 rounded-2xl border border-border bg-card p-6">
                <div className="h-12 w-24 shrink-0">
                  <Sparkline data={stat.sparkData} className="h-12 w-24 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="truncate text-lg font-bold text-primary">{stat.items.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 text-center text-sm text-muted-foreground">
          <div className="mb-4 text-3xl font-black text-foreground">صرح</div>
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة صرح الأكاديمية</p>
        </footer>
      </div>
    </div>
  );
}
