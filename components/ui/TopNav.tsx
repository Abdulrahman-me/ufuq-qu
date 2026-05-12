"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // لضمان عدم حدوث خطأ في الهيدريشن (Hydration) عند تبديل الثيم
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 z-40 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-16 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white text-lg font-bold">
            أ
          </div>
          <span className="text-xl font-black tracking-tight">أفق</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            الرئيسية
          </Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            لوحة الطالب
          </Link>
          <Link href="/sanad" className="hover:text-primary transition-colors">
            سند الذكي
          </Link>
          <Link href="/passport" className="hover:text-primary transition-colors">
            الجواز المهاري
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-xs"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button className="hidden sm:inline-flex items-center rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </header>
  );
}