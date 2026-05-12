import type { LucideIcon } from "lucide-react";
import {
  Award,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export type ExploreQuickLink = {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
};

export const exploreQuickLinks: ExploreQuickLink[] = [
  { href: "/learn", label: "المنصة التعليمية", desc: "المواد والفصول", icon: GraduationCap },
  { href: "/sanad", label: "سند", desc: "مرشدك الأكاديمي", icon: MessageCircle },
  { href: "/advisor", label: "لوحة المرشد", desc: "رؤى الجاهزية والمواعيد", icon: LayoutDashboard },
  { href: "/passport", label: "الجواز المهاري", desc: "توثيق المهارات", icon: Award },
  { href: "/sarh", label: "صرح", desc: "حوّل المواد الجامعية إلى مشاريع", icon: LayoutDashboard },
  { href: "/readiness/placement", label: "تحديد المستوى", desc: "اختبار موجّه", icon: Sparkles },
  { href: "/simulation", label: "اختبار المحاكاة", desc: "90 سؤالاً · 100 دقيقة", icon: FlaskConical },
];
