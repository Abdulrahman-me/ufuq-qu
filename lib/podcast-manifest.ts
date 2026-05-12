import { readFileSync } from "fs";
import { join } from "path";

/** يقرأ manifest مرة لكل طلب (يُستدعى من الخادم فقط). */
export function loadPodcastManifest(): Record<string, string> {
  try {
    const p = join(process.cwd(), "podcasts", "podcast-audio-manifest.json");
    const raw = readFileSync(p, "utf-8");
    const j = JSON.parse(raw) as Record<string, string>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(j)) {
      if (k.startsWith("_") || typeof v !== "string") continue;
      out[k.trim()] = v.trim().startsWith("/") ? v.trim() : `/${v.trim()}`;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * أولوية: رابط Supabase إن وُجد وليس فارغاً.
 * وإلا: مطابقة مفتاح manifest `اسم_المادة/عنوان_الفصل` (مطابقة غير حساسة لحالة الأحرف لاسم المادة).
 */
export function resolvePodcastAudioUrl(
  subjectName: string,
  chapterTitle: string,
  dbUrl: string | null | undefined,
): string | null {
  const trimmed = typeof dbUrl === "string" ? dbUrl.trim() : "";
  if (trimmed) return trimmed;

  const manifest = loadPodcastManifest();
  const sn = subjectName.trim();
  const ct = chapterTitle.trim();
  const exact = `${sn}/${ct}`;
  if (manifest[exact]) return manifest[exact];

  for (const [key, url] of Object.entries(manifest)) {
    const slash = key.indexOf("/");
    if (slash === -1) continue;
    const sub = key.slice(0, slash).trim();
    const ch = key.slice(slash + 1).trim();
    if (sub.toLowerCase() === sn.toLowerCase() && ch === ct) return url;
  }
  return null;
}
