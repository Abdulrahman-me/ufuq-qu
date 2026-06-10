'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import {
    Trophy,
    Clock,
    TrendingUp,
    ExternalLink,
    FolderOpen,
    Award,
    ArrowUpRight
} from "lucide-react";
import { AnimatedBackground } from "@/components/sarh/AnimatedBackground";

const radarData = [
    { skill: "البرمجة", value: 85 },
    { skill: "التفكير الرياضي", value: 70 },
    { skill: "هياكل البيانات", value: 78 },
    { skill: "المنطق", value: 65 },
    { skill: "الهندسة", value: 72 },
];

const stats = [
    { label: "مشاريع مكتملة", value: "12", icon: Trophy },
    { label: "ساعات تطوير فعلي", value: "248", icon: Clock },
    { label: "مواءمة سوق العمل", value: "76%", icon: TrendingUp },
];

const skills = [
    { name: "Python & Data Science", value: 82 },
    { name: "SQL & Database Design", value: 75 },
    { name: "Algorithm Optimization", value: 68 },
    { name: "API Development", value: 60 },
    { name: "Machine Learning", value: 55 },
    { name: "System Architecture", value: 48 },
];

export default function AchievementPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        const savedProjects = localStorage.getItem("sarh_projects_list");
        if (savedProjects) {
            setProjects(JSON.parse(savedProjects));
        } else {
            const mocks = [
                {
                    id: "1",
                    name: "محرك تحليل البيانات",
                    progress: 75,
                    lastUpdated: "2026-03-01",
                    category: "الذكاء الاصطناعي"
                },
                {
                    id: "2",
                    name: "تطبيق تجارة إلكترونية",
                    progress: 45,
                    lastUpdated: "2026-03-05",
                    category: "برمجة الويب"
                }
            ];
            setProjects(mocks);
            localStorage.setItem("sarh_projects_list", JSON.stringify(mocks));
        }
    }, []);

    const handleOpenProject = (project: any) => {
        router.push("/sarh/workspace");
    };

    return (
        <div className="relative min-h-screen text-foreground selection:bg-primary/30 pb-16 p-6 sm:p-10" dir="rtl">
            <AnimatedBackground />

            <div className="relative mx-auto max-w-7xl">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-black text-foreground tracking-tight">لوحة الإنجاز</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl leading-relaxed text-base transition-all">
                        استعرض كفاءتك المهاريّة وتابع تقدّم مشاريعك القائمة في مكان واحد.
                    </p>
                </header>

                {/* Stats Row (Slightly more compact) */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card group flex items-center gap-4 p-5 transition-all hover:border-primary/30">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/50 transition-colors group-hover:bg-primary/10">
                                <stat.icon className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-foreground leading-none mb-1">{stat.value}</p>
                                <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                    {/* Column: Radar + Enablement */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        {/* Radar Chart Section (Increased Margin for labels) */}
                        <section className="glass-card p-6 flex flex-col items-center">
                            <h2 className="mb-6 w-full text-base font-black text-foreground flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                رادار المهارات الأكاديمية
                            </h2>
                            <div className="w-full h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
                                        <PolarGrid stroke="hsl(var(--primary) / 0.1)" />
                                        <PolarAngleAxis
                                            dataKey="skill"
                                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: "600", fontFamily: "Tajawal" }}
                                        />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="المهارات"
                                            dataKey="value"
                                            stroke="hsl(var(--primary))"
                                            fill="hsl(var(--primary))"
                                            fillOpacity={0.2}
                                            strokeWidth={3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Enablement List (Competency) */}
                        <section className="glass-card p-6">
                            <h2 className="mb-6 text-base font-black text-foreground flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                قائمة التمكين
                            </h2>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group">
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{skill.name}</span>
                                            <span className="text-xs font-black text-primary">{skill.value}%</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-primary/40 to-primary transition-all duration-1000 group-hover:from-primary/60"
                                                style={{ width: `${skill.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Column: Projects + CTA */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        {/* Projects Progress Section */}
                        <section className="glass-card p-6">
                            <h2 className="mb-6 text-base font-black text-foreground flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-primary" />
                                مشاريعي القائمة
                            </h2>

                            <div className="space-y-4">
                                {projects.map((project, i) => (
                                    <div
                                        key={project.id}
                                        className="group rounded-xl border border-border/50 bg-accent/5 p-4 transition-all hover:bg-accent/10 hover:border-primary/30"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="space-y-0.5">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">
                                                    {project.category}
                                                </span>
                                                <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors">
                                                    {project.name}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => handleOpenProject(project)}
                                                className="p-2 rounded-lg bg-background border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-gradient-to-l from-[#1B8354] to-[#25935F] hover:text-black"
                                            >
                                                <ArrowUpRight className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted shadow-inner">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-primary w-8 text-left">
                                                {project.progress}%
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {projects.length === 0 && (
                                    <div className="py-12 text-center text-muted-foreground bg-accent/5 rounded-2xl border border-dashed border-border text-base font-medium">
                                        لا توجد مشاريع قائمة حالياً.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* CTA Card (More compact and smaller button) */}
                        <section className="bg-gradient-to-l from-[#1B8354] to-[#25935F] rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20 flex items-center justify-between overflow-hidden relative group">
                            <div className="absolute -right-12 -bottom-12 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-1">
                                <h4 className="font-black text-xl mb-0.5 tracking-tight">ابدأ صرحاً جديداً</h4>
                                <p className="text-primary-foreground/90 text-sm font-medium">حوّل معرفتك الأكاديمية إلى واقع ملموس</p>
                            </div>
                            <button
                                onClick={() => router.push("/sarh")}
                                className="relative z-10 px-6 py-2.5 bg-black text-white rounded-xl font-black text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
                            >
                                إنشاء مشروع
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
