import { NextRequest, NextResponse } from "next/server";

const YT_API = "https://www.googleapis.com/youtube/v3/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const apiKey = process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!q?.trim()) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "YouTube API key not configured" }, { status: 503 });
  }
  try {
    const res = await fetch(
      `${YT_API}?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(q.trim())}&key=${apiKey}`
    );
    const data = await res.json();
    const videoId = data?.items?.[0]?.id?.videoId ?? null;
    const title = data?.items?.[0]?.snippet?.title ?? null;
    return NextResponse.json({ videoId, title });
  } catch (e) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
