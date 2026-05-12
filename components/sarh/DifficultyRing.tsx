export const DifficultyRing = ({ difficulty }: { difficulty: "beginner" | "intermediate" | "advanced" }) => {
    const colors = {
        beginner: "text-emerald-500",
        intermediate: "text-amber-500",
        advanced: "text-rose-500",
    };

    const labels = {
        beginner: "مبتدئ",
        intermediate: "متوسط",
        advanced: "متقدم",
    };

    return (
        <div className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full bg-current ${colors[difficulty]}`} />
            <span className="text-xs font-medium text-muted-foreground">{labels[difficulty]}</span>
        </div>
    );
};
