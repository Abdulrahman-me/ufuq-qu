"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  LayoutGrid,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { exploreQuickLinks } from "@/lib/nav/exploreQuickLinks";
import { cn } from "@/lib/utils";

const products = [
  {
    href: "/learn",
    label: "المنصة التعليمية",
    desc: "دروس، شرائح، بودكاست، كويز، فيديوهات موصى بها",
    icon: GraduationCap,
  },
  {
    href: "/sanad",
    label: "سند",
    desc: "مرشد أكاديمي ذكي يحلل أداءك وذاكرتك",
    icon: MessageCircle,
  },
  {
    href: "/passport",
    label: "الجواز المهاري",
    desc: "أوسمة ومهارات موثّقة في الجواز المهاري الرقمي",
    icon: Award,
  },
  {
    href: "/sarh",
    label: "صرح",
    desc: "حوّل المواد الجامعية إلى مشاريع عملية حقيقية",
    icon: LayoutGrid,
  },
  {
    href: "/simulation",
    label: "اختبار المحاكاة",
    desc: "٩٠ سؤالاً في زمن الاختبار الوطني — محاكاة كاملة",
    icon: FlaskConical,
  },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const [scrolled, setScrolled] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openExplore, setOpenExplore] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(t)) setOpenProducts(false);
      if (exploreRef.current && !exploreRef.current.contains(t)) setOpenExplore(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const headerSurface =
    isHome && !scrolled
      ? "border-transparent bg-transparent"
      : "border-border/80 bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/70";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("sticky top-0 z-50 border-b transition-all duration-300", headerSurface)}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
            <Image
              src="/horizon-favicon.png"
              alt="أفق"
              fill
              sizes="36px"
              priority
              className="object-cover"
            />
          </div>
          <span className="text-lg font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
            أفق
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted hover:text-foreground",
              pathname === "/" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            الرئيسية
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpenProducts((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                openProducts ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              المنتجات
              <ChevronDown className={cn("h-4 w-4 transition-transform", openProducts && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openProducts && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl"
                >
                  {products.map((product) => {
                    const Icon = product.icon;
                    return (
                      <Link
                        key={product.href}
                        href={product.href}
                        onClick={() => setOpenProducts(false)}
                        className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{product.label}</p>
                          <p className="text-xs leading-snug text-muted-foreground">{product.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isDark ? "الوضع النهاري" : "الوضع الليلي"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="relative" ref={exploreRef}>
            <button
              type="button"
              onClick={() => setOpenExplore((v) => !v)}
              className={cn(
                "flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
                openExplore
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              استكشف
              <ChevronDown className={cn("h-4 w-4 transition-transform", openExplore && "rotate-180")} />
            </button>
            <AnimatePresence>
              {openExplore && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute end-0 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-xl"
                >
                  {exploreQuickLinks.map((p) => {
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpenExplore(false)}
                        className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{p.label}</p>
                          <p className="text-xs leading-snug text-muted-foreground">{p.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground"
            aria-label={isDark ? "الوضع النهاري" : "الوضع الليلي"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {products.map((product) => {
                const Icon = product.icon;
                return (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {product.label}
                  </Link>
                );
              })}
              <p className="px-3 pt-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">استكشف</p>
              {exploreQuickLinks.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {p.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
