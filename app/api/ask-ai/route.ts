import { NextRequest, NextResponse } from "next/server";
import { askAI } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, chapterSummary } = body as { question?: string; chapterSummary?: string };
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }
    const context = typeof chapterSummary === "string" ? chapterSummary : "";
    const answer = await askAI(question, context);
    return NextResponse.json({ answer });
  } catch (e) {
    console.error("ask-ai API", e);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
