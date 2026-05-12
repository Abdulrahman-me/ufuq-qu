import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const subjectId = request.nextUrl.searchParams.get("subjectId");
  const chapterId = request.nextUrl.searchParams.get("chapterId");
  try {
    if (chapterId) {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", chapterId)
        .single();
      if (error || !data) {
        return NextResponse.json({ error: error?.message ?? "Not found" }, { status: error?.code === "PGRST116" ? 404 : 500 });
      }
      return NextResponse.json(data);
    }
    if (!subjectId) {
      return NextResponse.json({ error: "subjectId or chapterId required" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("subject_id", subjectId)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch (e) {
    console.error("chapters API", e);
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
