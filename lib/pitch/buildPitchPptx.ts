/**
 * Server-only: builds PPTX bytes. Uses pptxgenjs (imports node:fs in some paths — must not run in Webpack client bundle).
 */
import pptxgen from "pptxgenjs";
import { DECK_SLIDES, type DeckSlide } from "./pitchDeckContent";

function slideBodyLines(s: DeckSlide): string[] {
  const lines: string[] = [];
  if (s.subline) lines.push(s.subline);
  if (s.bullets?.length) lines.push(...s.bullets.map((b) => `• ${b}`));
  if (s.pillars?.length) {
    s.pillars.forEach((p) => {
      lines.push(`${p.title}: ${p.desc}`);
    });
  }
  if (s.products?.length) {
    s.products.forEach((p) => {
      lines.push(`${p.title} — ${p.line}`);
    });
  }
  if (s.tech?.length) {
    lines.push(s.tech.join(" · "));
  }
  return lines;
}

export async function buildPitchPptxArrayBuffer(): Promise<ArrayBuffer> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Afaq";
  pptx.title = "منصة أفق — عرض المحكّمين";

  for (const s of DECK_SLIDES) {
    const slide = pptx.addSlide();
    slide.background = { color: "0f172a" };

    slide.addText(s.headline, {
      x: 0.5,
      y: 0.45,
      w: 12.33,
      h: s.kind === "cover" || s.kind === "closing" ? 1.4 : 0.95,
      fontSize: s.kind === "cover" || s.kind === "closing" ? 40 : 28,
      bold: true,
      color: "f8fafc",
      align: "right",
      fontFace: "Arial",
    });

    const body = slideBodyLines(s).join("\n");
    if (body.trim()) {
      slide.addText(body, {
        x: 0.5,
        y: s.kind === "cover" ? 2.1 : 1.55,
        w: 12.33,
        h: 5.2,
        fontSize: s.kind === "products" ? 13 : 15,
        color: "cbd5e1",
        align: "right",
        valign: "top",
        fontFace: "Arial",
      });
    }

    slide.addText(s.label, {
      x: 0.5,
      y: 6.85,
      w: 12.33,
      h: 0.35,
      fontSize: 11,
      color: "64748b",
      align: "right",
      fontFace: "Arial",
    });
  }

  const out = await pptx.write({ outputType: "arraybuffer", compression: true });
  if (out instanceof ArrayBuffer) return out;
  if (out instanceof Uint8Array) {
    const copy = out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
    if (copy instanceof ArrayBuffer) return copy;
  }
  throw new Error("Unexpected pptx write output");
}
