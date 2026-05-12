-- Educational platform module (subjects, chapters, lesson_content, student_progress)

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects (id) on delete cascade not null,
  title text not null,
  slide_path text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.lesson_content (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters (id) on delete cascade not null unique,
  summary_text text,
  podcast_script text,
  podcast_audio_url text,
  youtube_queries jsonb default '[]',
  flashcards_json jsonb default '[]',
  quiz_json jsonb default '[]',
  key_concepts jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chapter_id uuid references public.chapters (id) on delete cascade not null,
  completion_percentage int default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  last_accessed timestamptz default now(),
  created_at timestamptz default now(),
  unique(user_id, chapter_id)
);

create index if not exists idx_chapters_subject on public.chapters (subject_id);
create index if not exists idx_lesson_content_chapter on public.lesson_content (chapter_id);
create index if not exists idx_student_progress_user on public.student_progress (user_id);
create index if not exists idx_student_progress_chapter on public.student_progress (chapter_id);
