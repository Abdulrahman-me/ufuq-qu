'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Lightbulb,
    Code2,
    Video,
    ExternalLink,
    Bug,
    BookOpen,
    Link2,
} from "lucide-react";
import { AnimatedBackground } from "@/components/sarh/AnimatedBackground";

interface TaskDetailsItem {
    title: string;
    technical_why?: string;
    pseudo_code?: string | string[];
    academic_reference?: string;
    common_pitfalls?: string | string[];
    smart_media?: {
        youtube_video_id?: string;
        references?: Array<{ title: string; url: string }>;
    };
}

const PseudoCodeBlock = ({ content }: { content: string | string[] }) => {
    const lines = Array.isArray(content) ? content : [content];
    return (
        <div className="relative overflow-hidden rounded-xl border border-[#3e3e42] bg-[#1e1e1e] shadow-2xl" dir="rtl">
            {/* VS Code Header */}
            <div className="flex items-center justify-between border-b border-[#333333] bg-[#252526] px-4 py-2">
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[10px] font-mono font-medium text-[#858585] uppercase tracking-wider">Solution_Steps.log</span>
            </div>

            <div className="flex font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                {/* Line Numbers */}
                <div className="hidden sm:flex flex-col bg-[#1e1e1e] border-l border-[#333333] px-3 py-4 text-right select-none text-[#858585] min-w-[45px]">
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </div>

                {/* Code Content */}
                <pre className="flex-1 py-4 px-5 text-right whitespace-pre-wrap font-sans text-[#d4d4d4]">
                    {lines.map((line, i) => {
                        // Simple custom syntax highlighting for Arabic keywords if needed
                        const highlightedLine = line
                            .replace(/الخطوة الأولى/g, '<span style="color: #569cd6">الخطوة الأولى</span>')
                            .replace(/الخطوة الثانية/g, '<span style="color: #569cd6">الخطوة الثانية</span>')
                            .replace(/الخطوة الثالثة/g, '<span style="color: #569cd6">الخطوة الثالثة</span>')
                            .replace(/البداية/g, '<span style="color: #c586c0">البداية</span>')
                            .replace(/النهاية/g, '<span style="color: #c586c0">النهاية</span>');

                        return (
                            <div key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: highlightedLine }} />
                        );
                    })}
                </pre>
            </div>
        </div>
    );
};

export default function TaskDetails() {
    const router = useRouter();
    const [state, setState] = useState<{
        task: string | TaskDetailsItem;
        projectTitle: string;
        taskIndex: number;
    } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem("sarh_task_details_state");
            if (raw) {
                setState(JSON.parse(raw));
            }
        }
    }, []);

    if (!state) {
        return (
            <div className="flex min-h-screen items-center justify-center" dir="rtl">
                <div className="text-center">
                    <p className="mb-4 text-muted-foreground">لم يتم العثور على بيانات المهمة.</p>
                    <button
                        onClick={() => router.push("/sarh/workspace")}
                        className="rounded-xl bg-gradient-to-l from-[#1B8354] to-[#25935F] px-6 py-2 text-white"
                    >
                        العودة لمساحة العمل
                    </button>
                </div>
            </div>
        );
    }

    const { task, projectTitle } = state;
    const isObject = typeof task === "object" && task !== null;
    const title = isObject ? (task as any).title : String(task);
    const technicalWhy = isObject ? (task as any).technical_why : undefined;
    const pseudoCode = isObject ? (task as any).pseudo_code : undefined;
    const academicRef = isObject ? (task as any).academic_reference : undefined;

    const rawPitfalls = isObject ? (task as any).common_pitfalls : undefined;
    const commonPitfalls = Array.isArray(rawPitfalls)
        ? rawPitfalls
        : typeof rawPitfalls === "string"
            ? [rawPitfalls]
            : [];

    const smartMedia = isObject ? (task as any).smart_media : undefined;
    const youtubeVideoId = smartMedia?.youtube_video_id;
    const resources = isObject ? (task as any).resources || smartMedia?.references : undefined;

    const containerVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            dir="rtl"
            className="relative min-h-screen text-foreground selection:bg-primary/30"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <AnimatedBackground />

            <div className="relative mx-auto max-w-4xl space-y-6 px-4 py-6">
                <motion.div variants={itemVariants}>
                    <button
                        onClick={() => router.push("/sarh/workspace")}
                        className="glass-card flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                    >
                        <ArrowRight className="h-4 w-4" />
                        العودة لمساحة العمل
                    </button>
                </motion.div>

                <motion.header variants={itemVariants} className="glass-card p-6">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                        {projectTitle}
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        {title}
                    </h1>
                </motion.header>

                {technicalWhy && (
                    <motion.section variants={itemVariants} className="glass-card p-5">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                            <Lightbulb className="h-5 w-5 text-primary" />
                            لماذا هذه المهمة مهمة تقنياً؟
                        </h2>
                        <p className="leading-relaxed text-muted-foreground">{technicalWhy}</p>
                    </motion.section>
                )}

                {pseudoCode && (
                    <motion.section variants={itemVariants} className="glass-card p-5">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                            <Code2 className="h-5 w-5 text-primary" />
                            المنطق البرمجي (الخطوات المنطقية)
                        </h2>
                        <PseudoCodeBlock content={pseudoCode} />
                    </motion.section>
                )}

                {(youtubeVideoId || (resources && resources.length > 0)) && (
                    <motion.section variants={itemVariants} className="glass-card p-5">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                            <Video className="h-5 w-5 text-primary" />
                            المصادر التعليمية
                        </h2>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {youtubeVideoId && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:border-primary/40 group col-span-full sm:col-span-1"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:bg-gradient-to-l from-[#1B8354] to-[#25935F] group-hover:text-white transition-colors">
                                        <Video className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                            شرح مرئي للمهمة
                                            <ExternalLink className="h-3 w-3 opacity-50" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">مشاهدة على يوتيوب</p>
                                    </div>
                                </a>
                            )}

                            {resources && resources.map((r: any, i: number) => (
                                <a
                                    key={i}
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-primary/30 hover:bg-background group"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary group-hover:bg-primary/10 transition-colors">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                            <span className="truncate">{r.title}</span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.section>
                )}

                {commonPitfalls.length > 0 && (
                    <motion.section variants={itemVariants} className="glass-card p-5">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                            <Bug className="h-5 w-5 text-primary" />
                            تنبيهات وأخطاء شائعة
                        </h2>
                        <ul className="space-y-2">
                            {commonPitfalls.map((item: string, i: number) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-foreground"
                                >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
                                        !
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.section>
                )}

                {academicRef && (
                    <motion.section variants={itemVariants} className="glass-card p-5">
                        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                            <BookOpen className="h-5 w-5 text-primary" />
                            الربط بالمفاهيم الأكاديمية
                        </h2>
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <p className="text-sm leading-relaxed text-foreground font-medium">
                                {academicRef}
                            </p>
                        </div>
                    </motion.section>
                )}
            </div>
        </motion.div>
    );
}
