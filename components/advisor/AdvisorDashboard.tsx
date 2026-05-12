"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { MetricCard } from "@/components/advisor/MetricCard";
import { StudentInsightsExplorer, type StudentInsight, type StudentState } from "@/components/advisor/StudentCard";
import { ADVISOR_ROSTER_100 } from "@/lib/advisor/mockStudents";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const R = ADVISOR_ROSTER_100;
const countPressure = R.filter((s) => s.state === "pressure").length;
const countHigh = R.filter((s) => s.state === "high").length;
const countFluctuating = R.filter((s) => s.state === "fluctuating").length;
const avgDelta =
  R.length > 0 ? Math.round(R.reduce((acc, s) => acc + (s.after - s.before), 0) / R.length) : 0;

const ADVISOR_ACTIONS = [
  { count: countPressure, text: "طالب مبتدئ يحتاج متابعة بشرية من المرشد" },
  { count: countFluctuating, text: "طالب متوسط يحتاج ضبطاً تكيفياً للمحتوى" },
  { count: countHigh, text: "طالب متفوّق جاهز لمشروع أو تحدٍ متقدّم" },
];

type SanadStatus = "pending" | "approved" | "modified" | "rejected";

interface SanadDecision {
  id: string;
  studentName: string;
  summary: string;
  proposedAction: string;
  status: SanadStatus;
}

const INITIAL_SANAD: SanadDecision[] = [
  {
    id: "s1",
    studentName: R[2]!.name,
    summary: "رصد سند إشارات ضغط مستمرة مع انخفاض في الجاهزية.",
    proposedAction: "جدولة جلسة مع المرشد الأكاديمي خلال 48 ساعة.",
    status: "pending",
  },
  {
    id: "s2",
    studentName: R[4]!.name,
    summary: "إيقاع غير منتظم؛ تباين في نتائج الاختبارات فوق العتبة.",
    proposedAction: "التحويل إلى جلسات مصغّرة 25 دقيقة مع مراجعة متباعدة.",
    status: "pending",
  },
  {
    id: "s3",
    studentName: R[5]!.name,
    summary: "خطر انفصال؛ اختبارات فائتة.",
    proposedAction: "تلميح خفيف + إمكانية حجز اختياري مع المرشد.",
    status: "pending",
  },
];

interface Appointment {
  id: string;
  studentName: string;
  when: string;
  topic: string;
  status: "confirmed" | "tentative";
}

const APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    studentName: R[2]!.name,
    when: "الأحد · 4:00 مساءً",
    topic: "الضغط وتخطيط العبء",
    status: "confirmed",
  },
  {
    id: "a2",
    studentName: R[1]!.name,
    when: "الاثنين · 2:00 مساءً",
    topic: "إيقاع الدراسة التكيفي",
    status: "confirmed",
  },
  {
    id: "a3",
    studentName: R[5]!.name,
    when: "الثلاثاء · 10:30 صباحاً",
    topic: "متابعة إعادة الارتباط",
    status: "tentative",
  },
  {
    id: "a4",
    studentName: R[0]!.name,
    when: "الأربعاء · 3:00 مساءً",
    topic: "نطاق المشروع المتقدّم",
    status: "tentative",
  },
  {
    id: "a5",
    studentName: R[3]!.name,
    when: "الخميس · 11:00 صباحاً",
    topic: "متابعة الأداء والمشروع",
    status: "tentative",
  },
];

const FILTER_OPTIONS: { value: "all" | StudentState; label: string }[] = [
  { value: "all", label: "جميع الطلاب" },
  { value: "high", label: "متفوّقون" },
  { value: "fluctuating", label: "متوسطون" },
  { value: "pressure", label: "مبتدئون" },
];

function sanadStatusLabel(status: Exclude<SanadStatus, "pending">): string {
  switch (status) {
    case "approved":
      return "معتمد";
    case "modified":
      return "معدّل";
    case "rejected":
      return "مرفوض";
    default:
      return "";
  }
}

function appointmentStatusLabel(status: Appointment["status"]): string {
  return status === "confirmed" ? "مؤكد" : "مبدئي";
}

type SanadDialog = null | { mode: "modify"; id: string } | { mode: "reject"; id: string };

function SanadModifyModal({
  open,
  studentName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="إغلاق"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h3 className="text-lg font-black text-foreground">تعديل قرار سند</h3>
        <p className="mt-1 text-sm text-muted-foreground">الطالب: {studentName}</p>
        <label htmlFor="sanad-modify-note" className="mt-4 block text-sm font-semibold text-foreground">
          ملاحظات المراجعة
        </label>
        <textarea
          id="sanad-modify-note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="أدخل ملاحظاتك حول التعديل…"
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40"
        />
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => onConfirm(note)}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-amber-700"
          >
            تأكيد التعديل
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SanadRejectModal({
  open,
  studentName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir="rtl">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="إغلاق"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h3 className="text-lg font-black text-foreground">رفض توصية سند</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          هل أنت متأكد من رفض التوصية المقترحة لـ <span className="font-bold text-foreground">{studentName}</span>؟ لا
          يمكن التراجع عن هذا الإجراء في التجربة التجريبية.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl border border-rose-500/50 bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-rose-700"
          >
            تأكيد الرفض
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AdvisorDashboard() {
  const [filter, setFilter] = useState<"all" | StudentState>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterWrapRef = useRef<HTMLDivElement>(null);
  const [sanadDecisions, setSanadDecisions] = useState<SanadDecision[]>(INITIAL_SANAD);
  const [toast, setToast] = useState<string | null>(null);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [sanadSectionOpen, setSanadSectionOpen] = useState(false);
  const [sanadDialog, setSanadDialog] = useState<SanadDialog>(null);
  const [page, setPage] = useState(0);

  const filteredStudents = useMemo(() => {
    if (filter === "all") return R;
    return R.filter((s) => s.state === filter);
  }, [filter]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const pageIndex = Math.min(page, Math.max(0, totalPages - 1));
  const pageSlice = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, pageIndex]);

  const rangeStart = filteredStudents.length === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filteredStudents.length, pageIndex * PAGE_SIZE + PAGE_SIZE);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  const modifyDecision = sanadDialog?.mode === "modify" ? sanadDecisions.find((d) => d.id === sanadDialog.id) : null;
  const rejectDecision = sanadDialog?.mode === "reject" ? sanadDecisions.find((d) => d.id === sanadDialog.id) : null;

  function applySanadModify(id: string, note: string) {
    setSanadDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status: "modified" as const } : d)));
    showToast(`تم تعديل قرار سند · ${note.trim() ? note.slice(0, 80) + (note.length > 80 ? "…" : "") : "بدون ملاحظات"}`);
    setSanadDialog(null);
  }

  function applySanadReject(id: string) {
    setSanadDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status: "rejected" as const } : d)));
    showToast("تم رفض قرار سند.");
    setSanadDialog(null);
  }

  function handleSanad(id: string, action: "approve" | "modify" | "reject") {
    if (action === "modify") {
      setSanadDialog({ mode: "modify", id });
      return;
    }
    if (action === "approve") {
      setSanadDecisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "approved" as const } : d)),
      );
      showToast("تم اعتماد قرار سند وتسجيله.");
    }
    if (action === "reject") {
      setSanadDialog({ mode: "reject", id });
    }
  }

  const pendingSanad = sanadDecisions.filter((d) => d.status === "pending");

  useEffect(() => {
    if (!filterOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [filterOpen]);

  useEffect(() => {
    if (!sanadDialog) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sanadDialog]);

  return (
    <div className="relative pb-20" dir="rtl">
      <SanadModifyModal
        open={sanadDialog?.mode === "modify"}
        studentName={modifyDecision?.studentName ?? ""}
        onClose={() => setSanadDialog(null)}
        onConfirm={(note) => {
          if (sanadDialog?.mode === "modify") applySanadModify(sanadDialog.id, note);
        }}
      />
      <SanadRejectModal
        open={sanadDialog?.mode === "reject"}
        studentName={rejectDecision?.studentName ?? ""}
        onClose={() => setSanadDialog(null)}
        onConfirm={() => {
          if (sanadDialog?.mode === "reject") applySanadReject(sanadDialog.id);
        }}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-6 start-1/2 z-[100] -translate-x-1/2 rounded-xl border border-border bg-card/95 px-4 py-2.5 text-sm font-semibold shadow-2xl backdrop-blur-md md:start-auto md:end-8 md:translate-x-0"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="متوسط تحسّن الجاهزية"
          value={`${avgDelta > 0 ? "+" : ""}${avgDelta}%`}
          description="متوسط فرق الجاهزية (بعد − قبل) ضمن عينة الـ١٠٠"
          icon={TrendingUp}
          delay={0}
          accent="emerald"
        />
        <MetricCard
          title="إجمالي الطلاب"
          value="100"
          description="أسماء سعودية حقيقية — عرض ١٠ في كل صفحة"
          icon={Users}
          delay={0.06}
          accent="violet"
        />
        <MetricCard
          title="طلاب مبتدئون"
          value={String(countPressure)}
          description="يحتاجون تدخلاً أو متابعة عاجلة"
          icon={Target}
          delay={0.12}
          accent="rose"
        />
        <MetricCard
          title="متفوّقون"
          value={String(countHigh)}
          description="أداء مرتفع ضمن التوزيع الدوري للعينة"
          icon={Sparkles}
          delay={0.18}
          accent="emerald"
        />
      </div>

      <div className="flex flex-col gap-10 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground">رؤى الطلاب</h2>
              <p className="text-sm text-muted-foreground">إشارات سلوكية وتوصيات الذكاء الاصطناعي</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {filteredStudents.length} طالب في القائمة الحالية — ١٠ أسماء لكل صفحة. اضغط السهم لعرض التفاصيل.
              </p>
            </div>
            <div className="relative" ref={filterWrapRef}>
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-4 py-2.5 text-sm font-bold shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/5"
              >
                <Filter className="h-4 w-4 text-primary" />
                {FILTER_OPTIONS.find((f) => f.value === filter)?.label}
                <ChevronDown className={cn("h-4 w-4 transition-transform", filterOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {filterOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute end-0 z-20 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-xl"
                  >
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFilter(opt.value);
                          setFilterOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm font-semibold transition-colors",
                          filter === opt.value ? "bg-primary/10 text-primary" : "hover:bg-muted",
                        )}
                      >
                        {opt.label}
                        {filter === opt.value ? <Check className="h-4 w-4" /> : null}
                      </button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <StudentInsightsExplorer students={pageSlice} />

          {filteredStudents.length > PAGE_SIZE ? (
            <div className="flex flex-col items-stretch justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center">
              <p className="text-center text-xs text-muted-foreground sm:text-start">
                عرض {rangeStart}–{rangeEnd} من {filteredStudents.length} · صفحة {pageIndex + 1} من {totalPages}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={pageIndex <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold transition-colors hover:bg-muted disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </button>
                <button
                  type="button"
                  disabled={pageIndex >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold transition-colors hover:bg-muted disabled:opacity-40"
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card/50 shadow-sm backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setAppointmentsOpen((o) => !o)}
              aria-expanded={appointmentsOpen}
              className="flex w-full items-center justify-between gap-3 p-5 text-start transition-colors hover:bg-muted/30"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">جلسات المرشد المجدولة</h2>
                  <p className="text-xs text-muted-foreground">مواعيد من الأحد إلى الخميس مع المرشد الأكاديمي</p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200",
                  appointmentsOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                appointmentsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-border/50 px-5 pb-5 pt-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {APPOINTMENTS.map((a, i) => (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm"
                      >
                        <div>
                          <p className="font-bold text-foreground">{a.studentName}</p>
                          <p className="text-xs text-muted-foreground">{a.topic}</p>
                        </div>
                        <div className="text-end">
                          <p className="font-mono text-xs font-bold text-foreground tabular-nums" dir="ltr">
                            {a.when}
                          </p>
                          <span
                            className={cn(
                              "mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                              a.status === "confirmed"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                : "bg-amber-500/15 text-amber-800 dark:text-amber-300",
                            )}
                          >
                            {appointmentStatusLabel(a.status)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-violet-500/[0.04] to-transparent shadow-sm"
          >
            <button
              type="button"
              onClick={() => setSanadSectionOpen((o) => !o)}
              aria-expanded={sanadSectionOpen}
              className="flex w-full items-center justify-between gap-3 p-5 text-start transition-colors hover:bg-violet-500/[0.06]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <ClipboardList className="h-6 w-6 shrink-0 text-violet-600 dark:text-violet-400" />
                <div>
                  <h2 className="text-lg font-black text-foreground">قرارات سند · مراجعة المرشد</h2>
                  <p className="text-xs text-muted-foreground">
                    اعتماد التدخلات المقترحة من الذكاء الاصطناعي أو تعديلها أو رفضها
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-6 w-6 shrink-0 text-muted-foreground transition-transform duration-200",
                  sanadSectionOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                sanadSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-border/50 px-5 pb-5 pt-2">
                  <div className="space-y-3">
                    {sanadDecisions.map((d) => (
                      <div
                        key={d.id}
                        className={cn(
                          "rounded-xl border p-4 transition-colors",
                          d.status === "pending"
                            ? "border-border/70 bg-card/90"
                            : d.status === "approved"
                              ? "border-emerald-500/30 bg-emerald-500/[0.04]"
                              : d.status === "modified"
                                ? "border-amber-500/30 bg-amber-500/[0.04]"
                                : "border-rose-500/30 bg-rose-500/[0.04]",
                        )}
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <p className="font-bold text-foreground">{d.studentName}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{d.summary}</p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                              <span className="text-primary">المقترح: </span>
                              {d.proposedAction}
                            </p>
                            {d.status !== "pending" ? (
                              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                                الحالة: {sanadStatusLabel(d.status)}
                              </p>
                            ) : null}
                          </div>
                          {d.status === "pending" ? (
                            <div className="flex flex-wrap gap-2 lg:shrink-0">
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSanad(d.id, "approve")}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                              >
                                <Check className="h-3.5 w-3.5" />
                                اعتماد
                              </motion.button>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSanad(d.id, "modify")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-900 dark:text-amber-200"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                تعديل
                              </motion.button>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSanad(d.id, "reject")}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-800 dark:text-rose-200"
                              >
                                <X className="h-3.5 w-3.5" />
                                رفض
                              </motion.button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                  {pendingSanad.length === 0 ? (
                    <p className="mt-3 text-center text-sm text-muted-foreground">تمت مراجعة جميع عناصر سند في هذه التجربة.</p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="w-full shrink-0 space-y-6 xl:w-[320px]">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 space-y-6"
          >
            <div className="rounded-2xl border border-border/70 bg-card/90 p-5 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md dark:ring-white/[0.06]">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">إجراءات مقترحة للمرشد</h3>
              <ul className="mt-4 space-y-3">
                {ADVISOR_ACTIONS.map((a, i) => (
                  <motion.li
                    key={a.text}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5"
                  >
                    <span
                      dir="ltr"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-xs font-black text-primary tabular-nums"
                    >
                      {a.count}
                    </span>
                    <span className="text-sm font-medium leading-snug text-foreground">{a.text}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                تحديث الرؤى
              </motion.button>
            </div>

            <div className="group relative h-[200px] [perspective:1000px]">
              <div className="relative h-full transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 flex flex-col justify-end overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/20 via-violet-500/10 to-background p-5 shadow-md [backface-visibility:hidden]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.25),transparent_50%)]" />
                  <Sparkles className="relative mb-2 h-8 w-8 text-primary" />
                  <p className="relative text-lg font-black text-foreground">نبض تكيفي</p>
                  <p className="relative text-xs text-muted-foreground">مرّر المؤشر فوق البطاقة لإظهار القياس الحي</p>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center rounded-2xl border border-border/60 bg-card p-5 shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="font-mono text-3xl font-black text-primary" dir="ltr">
                    +12%
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">ارتفاع جاهزية المجموعة</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    مُجمّع من بيانات الجلسات، فرق الاختبارات، وإشارات ذاكرة سند.
                  </p>
                  <ArrowUpRight className="mt-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
