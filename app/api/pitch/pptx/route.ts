import { NextResponse } from "next/server";
import { buildPitchPptxArrayBuffer } from "@/lib/pitch/buildPitchPptx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const buf = await buildPitchPptxArrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="afaq-pitch.pptx"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "PPTX build failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
