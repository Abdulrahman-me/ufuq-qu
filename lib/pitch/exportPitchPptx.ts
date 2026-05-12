"use client";

/**
 * Downloads PPTX generated on the server — avoids bundling pptxgenjs in the browser (it uses node:fs).
 */
export async function downloadPitchPptx(filename = "afaq-pitch.pptx"): Promise<void> {
  const res = await fetch("/api/pitch/pptx", { method: "GET" });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) detail = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(detail || "تعذّر إنشاء العرض");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
