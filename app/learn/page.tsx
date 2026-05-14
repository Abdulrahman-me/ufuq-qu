export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { LearnSubjectsClient } from "@/components/learn/LearnSubjectsClient";

async function getSubjects() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log("Fetching subjects from Supabase URL:", supabaseUrl);
    
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, description")
      .order("name");
      
    if (error) {
      console.error("Supabase Error fetching subjects:", error);
      return [];
    }
    
    console.log("Fetched subjects count:", data?.length ?? 0);
    return data ?? [];
  } catch (e) {
    console.error("Unexpected error in getSubjects:", e);
    return [];
  }
}

export default async function LearnPage() {
  const { subjects, error } = await getSubjectsData();
  return <LearnSubjectsClient subjects={subjects} error={error} />;
}

async function getSubjectsData() {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name, description")
      .order("name");
      
    if (error) {
      return { subjects: [], error: error.message };
    }
    
    return { subjects: data ?? [], error: null };
  } catch (e) {
    return { subjects: [], error: e instanceof Error ? e.message : String(e) };
  }
}

