import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  LayoutGrid,
  Award,
  Radar,
  Archive,
  GraduationCap,
  Briefcase,
  Moon,
  Sun,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/sarh/ui/tooltip";

const navItems = [
  { icon: LayoutGrid, label: "الرئيسية", path: "/sarh" },
  { icon: Briefcase, label: "مساحة العمل", path: "/sarh/workspace" },
  { icon: Award, label: "لوحة الإنجاز", path: "/sarh/achievement" },
  { icon: Archive, label: "الأرشيف", path: "/sarh/archive" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-e border-border bg-card dark:bg-background/20 backdrop-blur-xl py-6 gap-2">
      <Link href="/sarh" className="mb-8 select-none transition-transform hover:scale-110 active:scale-95">
        <div className="flex items-center justify-center">
          <img src="/sarh-hero.png" alt="صرح" className="h-10 w-10 object-contain" />
        </div>
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-4">
        {navItems.map((item) => {
          if (item.path === "/sarh") return null; // Skip home icon as we have the logo above
          const isActive = pathname === item.path;
          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.path}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${isActive
                    ? "bg-gradient-to-l from-[#1B8354] to-[#25935F] text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.8} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-tajawal font-bold bg-[#0a0a0a] border-white/10 text-white">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Dark Mode Toggle - Kept but simplified */}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-white/5 hover:text-white"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-tajawal font-bold bg-[#0a0a0a] border-white/10 text-white">
          {isDark ? "الوضع النهاري" : "الوضع الليلي"}
        </TooltipContent>
      </Tooltip>
    </aside>
  );
}
