/**
 * Single source for pitch deck: UI slides + PPTX/PDF export text.
 */

export type DeckSlideKind = "cover" | "statement" | "pillars" | "split" | "products" | "chips" | "closing";

export interface DeckSlide {
  id: string;
  kind: DeckSlideKind;
  /** Short label for thumbnails / PPTX section */
  label: string;
  headline: string;
  subline?: string;
  bullets?: string[];
  /** Three short labels for pillars slide */
  pillars?: { title: string; desc: string }[];
  /** Product rows for products slide */
  products?: { title: string; line: string; href?: string }[];
  /** Tech names */
  tech?: string[];
  /** Tailwind gradient token for decoration */
  palette: "aurora" | "sunset" | "ocean" | "forest" | "royal" | "midnight" | "dawn";
}

export const DECK_SLIDES: DeckSlide[] = [
  {
    id: "cover",
    kind: "cover",
    label: "الغلاف",
    palette: "aurora",
    headline: "منصة أفق",
    subline: "تعلّم تكيفي · مرشد ذكي · إثبات مهارات على السلسلة",
    bullets: ["Afaq · Academic Readiness Platform", "عرض للمحكّمين — نسخة شرائح"],
  },
  {
    id: "problem",
    kind: "statement",
    label: "المشكلة",
    palette: "sunset",
    headline: "المشكلة",
    subline: "ضغط الجاهزية يصطدم بفجوة مهارات و«ضجيج» في السيرة",
    bullets: [
      "مسارات تعلم غير واضحة: محتوى يُستهلك كفيديوهات دون ربط بالأداء القابل للقياس.",
      "صعوبة إثبات المهارات لأصحاب العمل دون دليل موثوق.",
      "في الهاكاثونات نحتاج أثراً تقنياً واضحاً: سلوك تعلم + ذكاء اصطناعي + شفافية.",
    ],
  },
  {
    id: "solution",
    kind: "pillars",
    label: "الحل",
    palette: "ocean",
    headline: "الحل",
    subline: "أفق كمنظومة واحدة: تعلّم، إرشاد، ثم إثبات",
    pillars: [
      { title: "تعلّم", desc: "جلسات مصغّرة داخل الفصل — شرائح، صوت، بطاقات، كويز، فيديو." },
      { title: "إرشاد", desc: "سند Sanad: مرشد ذكي، ذاكرة طويلة، وتنبيه للمرشد البشري." },
      { title: "إثبات", desc: "الجواز المهاري: أوسمة ومعاملات موثّقة على الشبكة." },
    ],
  },
  {
    id: "goal",
    kind: "split",
    label: "الهدف",
    palette: "forest",
    headline: "الهدف",
    subline:
      "تمكين الخريج التقني من مسار واضح: من التعلم الموجّه إلى جاهزية قابلة للقياس، ثم إثبات مهارة يمكن التحقق منه.",
  },
  {
    id: "vision",
    kind: "split",
    label: "الرؤية",
    palette: "royal",
    headline: "الرؤية",
    subline:
      "أن تصبح أفق مرجعاً للجاهزية الأكاديمية التقنية: تجربة تكيفية، شفافة تقنياً، وقريبة من الطالب والمرشد وسوق العمل.",
  },
  {
    id: "products",
    kind: "products",
    label: "المنتجات",
    palette: "midnight",
    headline: "منتجات المنصة",
    subline: "وحدات منفّذة في المنتج الحالي",
    products: [
      { title: "المنصة التعليمية", line: "فصول، شرائح، بودكاست، كويز، فيديو، Ask AI.", href: "/learn" },
      { title: "سند Sanad", line: "محادثة ذكية، تصنيف أداء، ذاكرة Supabase، حجز مرشد.", href: "/sanad" },
      { title: "الجواز المهاري", line: "أوسمة وختم على Polygon مع سجل في قاعدة البيانات.", href: "/passport" },
      { title: "تحديد المستوى", line: "اختبار موجّه يحدّث جاهزية المواد.", href: "/readiness/placement" },
      { title: "اختبار المحاكاة", line: "٩٠ سؤالاً · ١٠٠ دقيقة — محاكاة كاملة.", href: "/simulation" },
      { title: "لوحة المرشد", line: "رؤى، مواعيد، ومراجعة قرارات سند.", href: "/advisor" },
    ],
  },
  {
    id: "tech",
    kind: "chips",
    label: "التقنيات",
    palette: "dawn",
    headline: "التقنيات المستخدمة",
    tech: ["Next.js 14", "React 18 + TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Gemini API", "Polygon + ethers.js"],
  },
  {
    id: "closing",
    kind: "closing",
    label: "الخاتمة",
    palette: "aurora",
    headline: "شكراً لاهتمامكم",
    subline: "أفق — جاهزية أكاديمية بذكاء وشفافية تقنية",
    bullets: ["afaq.app · منصة الجاهزية الأكاديمية"],
  },
];
