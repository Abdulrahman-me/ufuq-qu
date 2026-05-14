import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase configuration is missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Subject = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Chapter = {
  id: string;
  subject_id: string;
  title: string;
  slide_path: string | null;
  sort_order: number;
  created_at: string;
};

export type LessonContent = {
  id: string;
  chapter_id: string;
  summary_text: string | null;
  podcast_script: string | null;
  podcast_audio_url: string | null;
  youtube_queries: string[];
  flashcards_json: { question: string; answer: string }[];
  quiz_json: { question: string; choices: string[]; correct_answer: string }[];
  key_concepts: string[];
  created_at: string;
  updated_at: string;
};

export type StudentProgress = {
  id: string;
  user_id: string;
  chapter_id: string;
  completion_percentage: number;
  last_accessed: string;
  created_at: string;
};
