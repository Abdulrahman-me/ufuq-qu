import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardCheck,
  GitBranch,
  GraduationCap,
  Hammer,
  Medal,
  TrendingUp,
  Trophy,
  UserCheck,
} from "lucide-react";

export type ShowcaseIconKey = keyof typeof SHOWCASE_ICONS;

export const SHOWCASE_ICONS = {
  trophy: Trophy,
  graduationCap: GraduationCap,
  trendingUp: TrendingUp,
  calendarDays: CalendarDays,
  hammer: Hammer,
  medal: Medal,
  clipboardCheck: ClipboardCheck,
  gitBranch: GitBranch,
  userCheck: UserCheck,
} as const satisfies Record<string, LucideIcon>;

/** ختم مدمَج في واجهة الكتيب مع بيانات السجل العملي. */
export type BookletSeal = {
  id: string;
  skill_name: string;
  score: number | null;
  issuer: string;
  issued_at: string;
  chain_id: number | null;
  tx_hash: string | null;
  polygonscan_url: string | null;
  status: "ISSUED" | "FAILED";
  showcase?: { variant: number; iconKey: ShowcaseIconKey; faded?: boolean; commitmentYellow?: boolean };
  ledger_title?: string;
  ledger_detail?: string;
};

export type ShowcaseBadgeRow = {
  id: string;
  skill_name: string;
  score: number | null;
  issuer: string;
  issued_at: string;
  chain_id: number | null;
  tx_hash: string | null;
  polygonscan_url: string | null;
  status: "ISSUED" | "FAILED";
  variant: number;
  iconKey: ShowcaseIconKey;
  /** باهت للدلالة على عدم الالتزام مؤخراً (مثلاً لم يُسجَّل دخول منذ أيام) */
  faded?: boolean;
  ledger_title: string;
  ledger_detail: string;
  /** وسام الالتزام: تلوين أصفر وأقل بهتاناً */
  commitment_yellow?: boolean;
};

/** أوسمة عرض ثابتة — متنوعة بالألوان والإنجازات (لا تُحفظ في قاعدة البيانات). */
export const SHOWCASE_BADGES: ShowcaseBadgeRow[] = [
  {
    id: "showcase-hackathon-psau",
    skill_name: "فوز في هاكاثون «رُقِيّ الحلول»",
    score: null,
    issuer: "جامعة الأمير سطام بن عبد العزيز",
    issued_at: "2025-11-18T10:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 0,
    iconKey: "trophy",
    ledger_title: "فوز في هاكاثون «رُقِيّ الحلول»",
    ledger_detail:
      "شارك الفريق في مسار «خدمات ذكية للمجتمع الأكاديمي» لمدة 36 ساعة. تم تسليم نموذج أولي لواجهة حجز الموارد مع لوحة تحكم للمسؤولين، وعرض أمام لجنة من قسم الحاسب. صدرت شهادة فوز بالمركز الأول موقّعة من عمادة شؤون الطلاب.",
  },
  {
    id: "showcase-ml-course",
    skill_name: "إكمال دورة Machine Learning",
    score: 94,
    issuer: "أكاديمية طويق للتقنية (XYZ)",
    issued_at: "2025-12-02T14:30:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 1,
    iconKey: "graduationCap",
    ledger_title: "دورة تعلّم آلي — مسار متكامل",
    ledger_detail:
      "أُنجزت وحدات: انحدار، تصنيف، تجميع، وتقييم النماذج مع مشروع ختامي (تصنيف نصوص عربية قصيرة). الدرجة النهائية 94٪ وحضور التمارين العملية مكتمل.",
  },
  {
    id: "showcase-readiness-high",
    skill_name: "جاهزية مرتفعة (+88٪)",
    score: 88,
    issuer: "منصة أفق — متوسط المواد",
    issued_at: "2026-01-10T09:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 2,
    iconKey: "trendingUp",
    ledger_title: "وسام الجاهزية المرتفعة",
    ledger_detail:
      "تحقّق شرط متوسط جاهزية 88٪ أو أعلى عبر المواد الستة في المسار، مع استقرار النتائج على عدة أسابيع. يعكس استعداداً عاماً قبل التدريب التعاوني أو المحاكاة.",
  },
  {
    id: "showcase-daily-streak",
    skill_name: "وسام الالتزام — دخول يومي",
    score: null,
    issuer: "منصة أفق",
    issued_at: "2026-03-22T08:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 3,
    iconKey: "calendarDays",
    faded: true,
    commitment_yellow: true,
    ledger_title: "التزام بالدخول اليومي (غير نشط مؤخراً)",
    ledger_detail:
      "سُجّلت سلسلة دخول يومية سابقة للمنصة. لم يُسجَّل دخول منذ 3 أيام — لذلك يظهر الوسام باهتاً حتى يعود النشاط اليومي.",
  },
  {
    id: "showcase-capstone-volunteer",
    skill_name: "مشروع «لوحة تتبّع المتطوعين»",
    score: null,
    issuer: "بإشراف الخريج سعود العتيبي",
    issued_at: "2025-10-05T16:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 4,
    iconKey: "hammer",
    ledger_title: "إتمام مشروع تخرّجي تحت إشراف خريج",
    ledger_detail:
      "بُنيت لوحة لتسجيل ساعات التطوع وربطها بفرق العمل؛ مراجعة الكود ونموذج قاعدة البيانات مع المشرف أسبوعياً. تسليم نهائي مع عرض توضيحي مسجّل.",
  },
  {
    id: "showcase-cyber-sec-2nd",
    skill_name: "المركز الثاني — أمن المعلومات",
    score: null,
    issuer: "نادي الحاسب — جامعة الملك سعود",
    issued_at: "2025-09-14T11:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 5,
    iconKey: "medal",
    ledger_title: "مسابقة أمن المعلومات الطلابية",
    ledger_detail:
      "مسار CTF لمدة يومين: تحليل ثغرات بسيطة، استغلال آمن في بيئة معزولة، وكتابة تقرير مختصر. المركز الثاني من أصل 24 فريقاً.",
  },
  {
    id: "showcase-simulation-90",
    skill_name: "محاكاة الجاهزية — 90/90",
    score: 100,
    issuer: "اختبار المحاكاة الوطني (عرض)",
    issued_at: "2026-02-28T13:45:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 6,
    iconKey: "clipboardCheck",
    ledger_title: "إكمال محاكاة الجاهزية كاملةً",
    ledger_detail:
      "أُجيبت الـ 90 سؤالاً ضمن الوقت المحدد للمحاكاة، مع مراجعة مُلخّصة للمواضيع الأضعف بعد النتيجة.",
  },
  {
    id: "showcase-oss-pr",
    skill_name: "مساهمة مدمجة في مستودع المنصة",
    score: null,
    issuer: "فريق التطوير المفتوح — أفق",
    issued_at: "2025-08-20T19:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 7,
    iconKey: "gitBranch",
    ledger_title: "دمج (Pull request) مقبول",
    ledger_detail:
      "تحسينات على مكوّن عرض الجداول وإصلاح تباين الألوان؛ مراجعة من زميلين ودمج في الفرع الرئيسي بعد اجتياز الفحوصات الآلية.",
  },
  {
    id: "showcase-mentor-sanad",
    skill_name: "توصية مرشد — سند",
    score: null,
    issuer: "الدكتور فيصل الدوسري — المرشد الأكاديمي",
    issued_at: "2026-03-01T12:00:00.000Z",
    chain_id: null,
    tx_hash: null,
    polygonscan_url: null,
    status: "ISSUED",
    variant: 0,
    iconKey: "userCheck",
    ledger_title: "توصية مرشد مُسجّلة في سند",
    ledger_detail:
      "تأكيد على انتظام الحضور في جلسات الإرشاد، وخطة تحسين للفصل القادم مع متابعة أهداف قصيرة المدى.",
  },
];

/** يستبعد ختم التطوير القديم «Data Structures» ونسخته العربية «هياكل بيانات» فقط (لا يمس مادة «هياكل وخوارزميات»). */
export function isLegacyDataStructuresSeal(skillName: string): boolean {
  const n = skillName.trim().toLowerCase();
  const ar = skillName.trim();
  return n === "data structures" || n.includes("data structures") || ar.includes("هياكل بيانات");
}

export function showcaseRowToBookletSeal(row: ShowcaseBadgeRow): BookletSeal {
  return {
    id: row.id,
    skill_name: row.skill_name,
    score: row.score,
    issuer: row.issuer,
    issued_at: row.issued_at,
    chain_id: row.chain_id,
    tx_hash: row.tx_hash,
    polygonscan_url: row.polygonscan_url,
    status: row.status,
    showcase: {
      variant: row.variant,
      iconKey: row.iconKey,
      faded: row.faded,
      ...(row.commitment_yellow ? { commitmentYellow: true as const } : {}),
    },
    ledger_title: row.ledger_title,
    ledger_detail: row.ledger_detail,
  };
}

/** ترتيب زمني للعرض في السجل العملي (الأحدث أولاً). */
export function showcaseLedgerSorted(): ShowcaseBadgeRow[] {
  return [...SHOWCASE_BADGES].sort(
    (a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime(),
  );
}
