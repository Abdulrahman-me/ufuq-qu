import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const SLIDES_DIR = path.join(process.cwd(), "content", "slides");

export async function GET(
  _req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  const pathSegments = params.path ?? [];
  if (pathSegments.length === 0) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }
  const safePath = pathSegments.every((p) => p !== ".." && p !== "");
  if (!safePath) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const filePath = path.join(SLIDES_DIR, ...pathSegments);
  if (!filePath.startsWith(SLIDES_DIR)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not a file" }, { status: 404 });
    }
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const types: Record<string, string> = {
      ".pdf": "application/pdf",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };
    const contentType = types[ext] ?? "application/octet-stream";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
