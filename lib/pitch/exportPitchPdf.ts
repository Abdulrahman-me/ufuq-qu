"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const SLIDE_SELECTOR = "[data-pitch-slide]";

export async function downloadPitchPdf(filename = "afaq-pitch.pdf"): Promise<void> {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(SLIDE_SELECTOR));
  if (nodes.length === 0) {
    throw new Error("لا توجد شرائح للتصدير.");
  }

  let pdf: jsPDF | null = null;

  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    const imgW = el.offsetWidth;
    const imgH = el.offsetHeight;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#0f172a",
    });

    const img = canvas.toDataURL("image/jpeg", 0.92);

    if (!pdf) {
      pdf = new jsPDF({
        orientation: imgW >= imgH ? "landscape" : "portrait",
        unit: "px",
        format: [imgW, imgH],
      });
    } else {
      pdf.addPage([imgW, imgH], imgW >= imgH ? "landscape" : "portrait");
    }

    pdf.addImage(img, "JPEG", 0, 0, imgW, imgH, undefined, "FAST");
  }

  pdf!.save(filename);
}
