-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  university text,
  major text,
  created_at timestamptz default now()
);

create table if not exists public.student_profiles (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  study_year text,
  learning_style text,
  attention_span_minutes integer,
  current_status text check (current_status in ('excellent', 'stable', 'struggling', 'at_risk')),
  created_at timestamptz default now()
);

-- Learning content
create table if not exists public.courses (
  id bigserial primary key,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.chapters (
  id bigserial primary key,
  course_id bigint references public.courses (id) on delete cascade,
  title text not null,
  slides_path text,
  created_at timestamptz default now()
);

create table if not exists public.lessons (
  id bigserial primary key,
  chapter_id bigint references public.chapters (id) on delete cascade,
  title text not null,
  text_content text,
  podcast_script text,
  podcast_audio_url text,
  summary text,
  created_at timestamptz default now()
);

create table if not exists public.flashcards (
  id bigserial primary key,
  lesson_id bigint references public.lessons (id) on delete cascade,
  question text not null,
  answer text not null,
  difficulty text
);

-- Learning behavior
create table if not exists public.learning_sessions (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  lesson_id bigint references public.lessons (id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz,
  duration_minutes integer
);

create table if not exists public.behavior_events (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  lesson_id bigint references public.lessons (id) on delete cascade,
  event_type text not null,
  timestamp timestamptz default now(),
  metadata jsonb
);

create table if not exists public.attention_analysis (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  avg_focus_minutes integer,
  last_updated timestamptz default now()
);

-- Quiz system
create table if not exists public.quizzes (
  id bigserial primary key,
  lesson_id bigint references public.lessons (id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists public.questions (
  id bigserial primary key,
  quiz_id bigint references public.quizzes (id) on delete cascade,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text not null,
  difficulty text
);

create table if not exists public.quiz_attempts (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  quiz_id bigint references public.quizzes (id) on delete cascade,
  score integer,
  time_taken integer,
  created_at timestamptz default now()
);

-- Jahiziyah radar
create table if not exists public.skill_scores (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  skill_name text not null,
  score integer not null,
  last_updated timestamptz default now()
);

-- SANAD
create table if not exists public.sanad_sessions (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  started_at timestamptz default now(),
  ended_at timestamptz
);

create table if not exists public.sanad_messages (
  id bigserial primary key,
  session_id bigint references public.sanad_sessions (id) on delete cascade,
  sender text check (sender in ('student', 'sanad')),
  message text not null,
  created_at timestamptz default now()
);

create table if not exists public.sanad_interventions (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  type text check (type in ('motivation', 'learning_capsule', 'schedule_adjustment', 'advisor_meeting')),
  description text,
  created_at timestamptz default now()
);

-- Advisor system
create table if not exists public.advisor_requests (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  sanad_recommendation text,
  advisor_decision text check (advisor_decision in ('approved', 'modified', 'rejected')),
  advisor_notes text,
  meeting_time timestamptz,
  status text
);

-- Skill passport
create table if not exists public.skills (
  id bigserial primary key,
  name text not null,
  description text
);

create table if not exists public.student_skills (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  skill_id bigint references public.skills (id) on delete cascade,
  mastery_level text,
  projects text,
  strength_points text,
  improvement_points text
);

create table if not exists public.badges (
  id bigserial primary key,
  name text not null,
  description text,
  icon text
);

create table if not exists public.student_badges (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  badge_id bigint references public.badges (id) on delete cascade,
  earned_at timestamptz default now()
);

create table if not exists public.challenges (
  id bigserial primary key,
  title text not null,
  description text,
  difficulty text
);

create table if not exists public.student_challenges (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  challenge_id bigint references public.challenges (id) on delete cascade,
  completion_status text,
  review_notes text
);

-- Blockchain verification
create table if not exists public.passport_hashes (
  id bigserial primary key,
  user_id uuid references public.users (id) on delete cascade,
  hash text not null,
  polygon_tx text,
  created_at timestamptz default now()
);

