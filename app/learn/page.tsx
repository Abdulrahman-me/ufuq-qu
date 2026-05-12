import { supabase } from "@/lib/supabase";
import { LearnSubjectsClient } from "@/components/learn/LearnSubjectsClient";

async function getSubjects() {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, description")
      .order("name");
    if (error) {
      console.error("getSubjects", error);
      return [];
    }
    return data ?? [];
  } catch (e) {
    console.error("getSubjects", e);
    return [];
  }
}

export default async function LearnPage() {
  const subjects = await getSubjects();
  return <LearnSubjectsClient subjects={subjects} />;
}
