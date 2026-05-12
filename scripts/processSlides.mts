// /**
//  * One-time script: read slide files, extract text, send to Gemini, save to Supabase.
//  * Run: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/processSlides.ts
//  * Or: node --loader ts-node/esm scripts/processSlides.ts
//  *
//  * Requires: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)
//  * Folder structure: /content/slides/{subjectSlug}/{Chapter1.pdf | Chapter2.pdf}
//  */

// import { createClient } from "@supabase/supabase-js";
// import * as fs from "fs";
// import * as path from "path";

// const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

// async function extractTextFromPdf(filePath: string): Promise<string> {
//   try {
//     const pdf = await import("pdf-parse");
//     const dataBuffer = fs.readFileSync(filePath);
//     const data = await pdf.default(dataBuffer);
//     return data.text;
//   } catch {
//     return fs.readFileSync(filePath, "utf-8").slice(0, 30000);
//   }
// }

// async function generateLessonFromSlides(apiKey: string, slideText: string) {
//   const prompt = `You are an educational content processor for an Arabic platform.
// Input: Raw text from course slides.

// Output valid JSON only (no markdown):
// {
//   "summary": "شرح مختصر للدرس بالعربية (2-4 فقرات)",
//   "podcast_script": "حوار تعليمي معلم/طالب بالعربية 300+ كلمة",
//   "flashcards": [{"question": "...", "answer": "..."}, ...],
//   "youtube_queries": ["query1", ...],
//   "quiz": [{"question": "...", "choices": ["أ","ب","ج","د"], "correct_answer": "..."}, ...],
//   "key_concepts": ["مفهوم1", ...]
// }
// At least 4 flashcards, 3 quiz questions, 3 youtube_queries. Arabic for all.

// Slides:
// ---
// ${slideText.slice(0, 28000)}
// ---`;

//   const res = await fetch(`${GEMINI_BASE}/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
//     }),
//   });
//   if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
//   const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
//   const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
//   return JSON.parse(text);
// }

// async function main() {
//   const apiKey = process.env.GEMINI_API_KEY;
//   const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

//   if (!apiKey || !supabaseUrl || !supabaseKey) {
//     console.error("Set GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)");
//     process.exit(1);
//   }

//   const supabase = createClient(supabaseUrl, supabaseKey);
//   const slidesDir = path.join(process.cwd(), "content", "slides");
//   if (!fs.existsSync(slidesDir)) {
//     console.log("No content/slides folder. Create it and add subject folders with PDFs.");
//     process.exit(0);
//   }

//   const subjectDirs = fs.readdirSync(slidesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
//   for (const subjectDir of subjectDirs) {
//     const subjectSlug = subjectDir.name;
//     const subjectPath = path.join(slidesDir, subjectSlug);

//     const { data: existingSubject } = await supabase.from("subjects").select("id").eq("name", subjectSlug).single();
//     let subjectId = existingSubject?.id;
//     if (!subjectId) {
//       const { data: inserted } = await supabase.from("subjects").insert({ name: subjectSlug, description: null }).select("id").single();
//       subjectId = inserted?.id;
//       if (!subjectId) continue;
//     }

//     const files = fs.readdirSync(subjectPath).filter((f) => f.endsWith(".pdf") || f.endsWith(".txt"));
//     let sortOrder = 0;
//     for (const file of files.sort()) {
//       const chapterTitle = path.basename(file, path.extname(file));
//       const slidePath = `${subjectSlug}/${file}`;
//       const fullPath = path.join(subjectPath, file);

//       const { data: existingChapter } = await supabase
//         .from("chapters")
//         .select("id")
//         .eq("subject_id", subjectId)
//         .eq("title", chapterTitle)
//         .single();

//       let chapterId = existingChapter?.id;
//       if (!chapterId) {
//         const { data: insertedCh } = await supabase
//           .from("chapters")
//           .insert({ subject_id: subjectId, title: chapterTitle, slide_path: slidePath, sort_order: sortOrder++ })
//           .select("id")
//           .single();
//         chapterId = insertedCh?.id;
//       }
//       if (!chapterId) continue;

//       const slideText = await extractTextFromPdf(fullPath);
//       if (!slideText.trim()) {
//         console.log(`Skip (no text): ${slidePath}`);
//         continue;
//       }

//       console.log(`Processing ${slidePath}...`);
//       const processed = await generateLessonFromSlides(apiKey, slideText);

//       await supabase.from("lesson_content").upsert(
//         {
//           chapter_id: chapterId,
//           summary_text: processed.summary,
//           podcast_script: processed.podcast_script,
//           podcast_audio_url: null,
//           youtube_queries: processed.youtube_queries ?? [],
//           flashcards_json: processed.flashcards ?? [],
//           quiz_json: processed.quiz ?? [],
//           key_concepts: processed.key_concepts ?? [],
//           updated_at: new Date().toISOString(),
//         },
//         { onConflict: "chapter_id" },
//       );
//       console.log(`Saved: ${chapterTitle}`);
//     }
//   }
//   console.log("Done.");
// }

// main().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });
/**
 * One-time script: read slide files, extract text, send to Gemini, save to Supabase.
 * تشغيل من داخل مجلد ufuq-platform: npm run processSlides
 * (لا تستخدم ts-node — استخدم tsx فقط)
 * Requires: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { inspect } from "util";

const require = createRequire(import.meta.url);

// إعداد مسارات الملفات لنظام ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحميل متغيرات البيئة: من المجلد الحالي ثم من المجلد الأب (مثل Horizon/.env)
const cwd = process.cwd();
dotenv.config({ path: path.join(cwd, ".env.local") });
dotenv.config({ path: path.join(cwd, ".env") });
dotenv.config({ path: path.join(cwd, "..", ".env.local") });
dotenv.config({ path: path.join(cwd, "..", ".env") });

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = "gemini-2.5-flash";

async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const pdf = require("pdf-parse");
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (_err) {
    console.warn(`⚠️ فشل استخراج النص من PDF، سيتم التعامل معه كملف نصي: ${path.basename(filePath)}`);
    return fs.readFileSync(filePath, "utf-8").slice(0, 30000);
  }
}

/** استخراج النص من ملف PPTX (أرشيف ZIP يحتوي على شرائح XML) */
function extractTextFromPptx(filePath: string): string {
  try {
    const AdmZip = require("adm-zip");
    const zip = new AdmZip(filePath);
    const entries = zip.getEntries();
    const textParts: string[] = [];
    const slideRegex = /^ppt\/slides\/slide\d+\.xml$/i;
    for (const entry of entries) {
      if (!entry.isDirectory && slideRegex.test(entry.entryName)) {
        const xml = entry.getData().toString("utf-8");
        const text = xml
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (text) textParts.push(text);
      }
    }
    const full = textParts.join("\n\n");
    return full.slice(0, 30000);
  } catch (err) {
    console.warn(`⚠️ فشل استخراج النص من PPTX: ${path.basename(filePath)}`, err instanceof Error ? err.message : err);
    return "";
  }
}

/** استخراج النص حسب نوع الملف: pdf, pptx, أو txt */
async function extractSlideText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return extractTextFromPdf(filePath);
  if (ext === ".pptx") return extractTextFromPptx(filePath);
  if (ext === ".txt") return fs.readFileSync(filePath, "utf-8").slice(0, 30000);
  return "";
}

async function generateLessonFromSlides(apiKey: string, slideText: string) {
  const prompt = `You are an educational content processor for an Arabic university-level platform (RTL).
Input: Raw text from course slides.

Audience: Computer science / engineering university students (NOT kids). Avoid childish tone. Do NOT invent student names (like Ahmed, Sara, etc). Speak in neutral second person.

Output valid JSON only (no markdown):
{
  "summary": "شرح نصي مفصل يغطي جميع السلايدات بدون استثناء، مع توضيح الأفكار بالتسلسل، موجه لطلاب الجامعات بالعربية.",
  "brief_summary": "ملخص مختصر للدرس بالعربية (2-4 فقرات تلخص أهم النقاط).",
  "podcast_script": "حوار تعليمي بين Teacher و Student بالعربية، 300+ كلمة، مناسب لطلاب الجامعات، بدون أسماء محددة للطلاب، فقط Teacher / Student.",
  "flashcards": [{"question": "...", "answer": "..."}, ...],
  "youtube_queries": ["query1", ...],
  "quiz": [{"question": "...", "choices": ["أ","ب","ج","د"], "correct_answer": "..."}, ...],
  "key_concepts": ["مفهوم1", ...]
}

Rules:
- Use Arabic for normal explanation.
- Keep all scientific/technical terms in English (e.g. Binary heap, Divide and conquer, API, Hash table) — do NOT translate them literally.
- The "summary" field is a full textual explanation that walks through ALL slides in order.
- The "brief_summary" field is a short high-level summary for a separate view.
- The "podcast_script" must already be structured as alternating dialogue lines, each starting with "Teacher:" or "Student:".
- Tone: serious but encouraging, for university-level students.

Slides:
---
${slideText.slice(0, 28000)}
---`;

  const res = await fetch(`${GEMINI_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.4, 
        responseMimeType: "application/json" 
      },
    }),
  });

  if (!res.ok) throw new Error(`Gemini Error ${res.status}: ${await res.text()}`);
  
  const data = await res.json() as any;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return JSON.parse(text);
}

async function main() {
  // استخدام الأسماء الصحيحة للمتغيرات كما هي في ملفك الـ .env
  const apiKey = process.env.GEMINI_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey || !supabaseUrl || !supabaseKey) {
    console.error("❌ خطأ: لم يتم العثور على المفاتيح! تأكد من وجود GEMINI_API_KEY و NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY (أو NEXT_PUBLIC_SUPABASE_ANON_KEY) في .env أو .env.local (المجلد الحالي أو الأب).");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ملف يدوي لإسناد ملفات بودكاست لكل شابتر (لا يولد صوتاً آلياً)
  const podcastManifestPath = path.join(process.cwd(), "podcasts", "podcast-audio-manifest.json");
  let podcastAudioManifest: Record<string, string> = {};
  try {
    if (fs.existsSync(podcastManifestPath)) {
      podcastAudioManifest = JSON.parse(fs.readFileSync(podcastManifestPath, "utf-8"));
    }
  } catch (err) {
    console.warn("⚠️ تعذر قراءة podcast-audio-manifest.json. سيتم ترك podcast_audio_url = null.", err);
  }

  function getPodcastAudioUrl(subjectSlug: string, chapterTitle: string): string | null {
    const key = `${subjectSlug}/${chapterTitle}`;
    const v = podcastAudioManifest[key];
    if (!v) return null;
    if (v.startsWith("/")) return v;
    return `/${v}`;
  }
  const slidesDir = path.join(process.cwd(), "content", "slides");

  if (!fs.existsSync(slidesDir)) {
    console.log("📂 مجلد content/slides غير موجود. قم بإنشائه وأضف ملفات PDF أو PPTX أو TXT.");
    process.exit(0);
  }

  // اختيارية: حذف البيانات القديمة عند ضبط RESET_UFUQ_DATA=true في .env
  if (process.env.RESET_UFUQ_DATA === "true") {
    console.warn("⚠️ RESET_UFUQ_DATA=true → سيتم حذف بيانات أفق من Supabase (subjects, chapters, lesson_content, student_progress إن وجدت).");
    try {
      await supabase.from("lesson_content").delete().neq("chapter_id", -1);
      await supabase.from("student_progress").delete().neq("id", -1);
    } catch {
      // ignore if table does not exist
    }
    await supabase.from("chapters").delete().neq("id", -1);
    await supabase.from("subjects").delete().neq("id", -1);
    console.log("🗑️ تم حذف البيانات القديمة بنجاح.");
  }

  const subjectDirs = fs.readdirSync(slidesDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  let processedCount = 0;
  for (const subjectDir of subjectDirs) {
    const subjectSlug = subjectDir.name;
    const subjectPath = path.join(slidesDir, subjectSlug);

    console.log(`\n📚 معالجة المادة: ${subjectSlug}`);

    const { data: existingSubject } = await supabase.from("subjects").select("id").eq("name", subjectSlug).single();
    let subjectId = existingSubject?.id;
    
    if (!subjectId) {
      const { data: inserted } = await supabase.from("subjects").insert({ name: subjectSlug }).select("id").single();
      subjectId = inserted?.id;
    }
    if (!subjectId) continue;

    const files = fs
      .readdirSync(subjectPath)
      .filter((f) => f.endsWith(".pdf") || f.endsWith(".pptx") || f.endsWith(".txt"));
    let sortOrder = 0;

    for (const file of files.sort()) {
      if (processedCount >= 20) {
        console.log("✅ تم الوصول إلى حد 20 ملفاً، سيتم التوقف.");
        break;
      }

      const chapterTitle = path.basename(file, path.extname(file));
      const slidePath = `${subjectSlug}/${file}`;
      const fullPath = path.join(subjectPath, file);

      console.log(`📄 جاري معالجة الفصل: ${chapterTitle}...`);

      const { data: existingChapter } = await supabase
        .from("chapters")
        .select("id")
        .eq("subject_id", subjectId)
        .eq("title", chapterTitle)
        .single();

      let chapterId = existingChapter?.id;
      if (!chapterId) {
        const { data: insertedCh } = await supabase
          .from("chapters")
          .insert({ 
            subject_id: subjectId, 
            title: chapterTitle, 
            slide_path: slidePath, 
            sort_order: sortOrder++ 
          })
          .select("id")
          .single();
        chapterId = insertedCh?.id;
      }
      if (!chapterId) continue;

      const slideText = await extractSlideText(fullPath);
      if (!slideText.trim()) {
        console.log(`⏭️ تخطي (لا يوجد نص مستخرج): ${chapterTitle}`);
        continue;
      }

      // تخطي الفصول التي لديها محتوى مسبقاً (لتجنب استهلاك الحصة عند إعادة التشغيل)
      const desiredPodcastAudioUrl = getPodcastAudioUrl(subjectSlug, chapterTitle);
      const { data: existingContent } = await supabase
        .from("lesson_content")
        .select("chapter_id,podcast_audio_url")
        .eq("chapter_id", chapterId)
        .limit(1)
        .single();
      if (existingContent?.chapter_id) {
        // إذا كان الصوت مفقوداً والملف اليدوي يوفّره، حدّث فقط رابط الصوت بدون إعادة توليد نص Gemini.
        if (desiredPodcastAudioUrl && existingContent.podcast_audio_url !== desiredPodcastAudioUrl) {
          await supabase.from("lesson_content").update({ podcast_audio_url: desiredPodcastAudioUrl, updated_at: new Date().toISOString() }).eq("chapter_id", chapterId);
          processedCount += 1;
          console.log(`✅ تم تحديث رابط بودكاست الفصل فقط: ${chapterTitle}`);
        } else {
          console.log(`⏭️ محتوى موجود مسبقاً، تخطي: ${chapterTitle}`);
        }
        continue;
      }

      try {
        const processed = await generateLessonFromSlides(apiKey, slideText);

        await supabase.from("lesson_content").upsert(
          {
            chapter_id: chapterId,
            summary_text: processed.summary, // full explanation of all slides
            podcast_script: processed.podcast_script,
            podcast_audio_url: desiredPodcastAudioUrl,
            youtube_queries: processed.youtube_queries ?? [],
            flashcards_json: processed.flashcards ?? [],
            quiz_json: processed.quiz ?? [],
            key_concepts: processed.key_concepts ?? [],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "chapter_id" }
        );
        processedCount += 1;
        console.log(`✅ تم الحفظ بنجاح: ${chapterTitle}`);
      } catch (err: unknown) {
        const is429 = err instanceof Error && err.message.includes("429");
        if (is429) {
          console.error(`⛔ حصة Gemini اليومية منتهية (حد 20 طلب/يوم للمجاني). أعد التشغيل غداً أو ترقّ الخطة: ${chapterTitle}`);
        } else {
          console.error(`❌ خطأ أثناء معالجة ${chapterTitle}:`, err);
        }
      }
    }
  }
  console.log("\n✨ تمت العملية بنجاح.");
}

main().catch((e) => {
  const msg = e instanceof Error ? e.message : inspect(e);
  const stack = e instanceof Error ? e.stack : "";
  console.error("❌ خطأ:", msg);
  if (stack) console.error(stack);
  process.exit(1);
});