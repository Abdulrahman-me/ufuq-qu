import { notFound } from "next/navigation";
import { LearnChapterClient } from "./LearnChapterClient";
import { supabase } from "@/lib/supabase";
import { resolvePodcastAudioUrl } from "@/lib/podcast-manifest";

export const dynamic = "force-dynamic";

async function getChapter(chapterId: string) {
  try {
    const [chRes, lcRes] = await Promise.all([
      supabase.from("chapters").select("*").eq("id", chapterId).single(),
      supabase.from("lesson_content").select("*").eq("chapter_id", chapterId).maybeSingle(),
    ]);

    if (chRes.error || !chRes.data) {
      return null;
    }

    const subRes = await supabase
      .from("subjects")
      .select("name")
      .eq("id", chRes.data.subject_id)
      .maybeSingle();

    const subjectName = subRes.data?.name ?? "";
    const audioUrl = resolvePodcastAudioUrl(
      subjectName,
      chRes.data.title,
      lcRes.data?.podcast_audio_url,
    );

    let content = lcRes.data ?? null;
    if (content) {
      content = { ...content, podcast_audio_url: audioUrl };
    } else if (audioUrl) {
      content = {
        summary_text: null,
        podcast_script: null,
        podcast_audio_url: audioUrl,
        youtube_queries: [] as string[],
        flashcards_json: [] as { question: string; answer: string }[],
        quiz_json: [] as { question: string; choices: string[]; correct_answer: string }[],
      };
    }

    return {
      chapter: chRes.data,
      content,
      subjectName,
    };
  } catch {
    return null;
  }
}

export default async function ChapterLearnPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const data = await getChapter(params.chapterId);
  if (!data) notFound();

  return (
    <LearnChapterClient
      chapterId={params.chapterId}
      subjectName={data.subjectName}
      initialChapter={data.chapter}
      initialContent={data.content}
    />
  );
}
