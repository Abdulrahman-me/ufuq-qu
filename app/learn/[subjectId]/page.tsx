import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LearnChaptersClient } from "@/components/learn/LearnChaptersClient";

async function getChapters(subjectId: string) {
  try {
    const [chRes, subRes] = await Promise.all([
      supabase.from("chapters").select("id, title").eq("subject_id", subjectId).order("sort_order"),
      supabase.from("subjects").select("name").eq("id", subjectId).single(),
    ]);
    const chapters = (chRes.data ?? []).sort((a: { title: string }, b: { title: string }) => {
      const matchA = a.title.match(/(\d+)(?:\.(\d+))?/);
      const matchB = b.title.match(/(\d+)(?:\.(\d+))?/);
      if (matchA && matchB) {
        const majorA = parseInt(matchA[1], 10);
        const minorA = matchA[2] ? parseInt(matchA[2], 10) : 0;
        const majorB = parseInt(matchB[1], 10);
        const minorB = matchB[2] ? parseInt(matchB[2], 10) : 0;
        if (majorA !== majorB) return majorA - majorB;
        if (minorA !== minorB) return minorA - minorB;
      }
      return a.title.localeCompare(b.title, "en", { numeric: true, sensitivity: "base" });
    });
    const subjectName = subRes.data?.name ?? "المادة";
    return { chapters, subjectName };
  } catch (e) {
    console.error("getChapters", e);
    return { chapters: [], subjectName: "" };
  }
}

export default async function SubjectChaptersPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const { chapters, subjectName } = await getChapters(params.subjectId);

  if (chapters.length === 0 && !subjectName) {
    notFound();
  }

  return <LearnChaptersClient subjectName={subjectName} chapters={chapters} />;
}
