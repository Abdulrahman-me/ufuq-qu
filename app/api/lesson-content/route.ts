import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const chapterId = request.nextUrl.searchParams.get("chapterId");
  if (!chapterId) {
    return NextResponse.json({ error: "chapterId required" }, { status: 400 });
  }
  try {
    const { data, error } = await supabase
      .from("lesson_content")
      .select("*")
      .eq("chapter_id", chapterId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(null);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (data) {
      const d = data as Record<string, unknown>;
      if (Array.isArray(d.youtube_queries) === false) d.youtube_queries = [];
      if (Array.isArray(d.flashcards_json) === false) d.flashcards_json = [];
      if (Array.isArray(d.quiz_json) === false) d.quiz_json = [];
      if (Array.isArray(d.key_concepts) === false) d.key_concepts = [];
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("lesson-content API", e);
    return NextResponse.json({ error: "Failed to fetch lesson content" }, { status: 500 });
  }
}
