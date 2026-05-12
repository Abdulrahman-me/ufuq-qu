-- SANAD memory + human-in-the-loop flags (demo-friendly: user_id as text)

create table if not exists public.sanad_student_memory (
  user_id text primary key,
  memory_summary text,
  memory_json jsonb,
  updated_at timestamptz default now()
);

create index if not exists idx_sanad_student_memory_updated_at on public.sanad_student_memory (updated_at desc);

create table if not exists public.sanad_human_flags (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  risk_level text not null check (risk_level in ('LOW','MEDIUM','HIGH')),
  student_tier text not null check (student_tier in ('TOP_PERFORMER','FLUCTUATING','AT_RISK')),
  reason text,
  created_at timestamptz default now(),
  resolved boolean not null default false
);

create index if not exists idx_sanad_human_flags_user on public.sanad_human_flags (user_id);
create index if not exists idx_sanad_human_flags_resolved on public.sanad_human_flags (resolved);
create index if not exists idx_sanad_human_flags_created_at on public.sanad_human_flags (created_at desc);

alter table public.sanad_student_memory enable row level security;
alter table public.sanad_human_flags enable row level security;

-- Demo policies: allow public read for dashboard; allow insert for anyone (server uses service role anyway).
create policy "sanad_student_memory_select_public"
on public.sanad_student_memory
for select
to public
using (true);

create policy "sanad_student_memory_upsert_public"
on public.sanad_student_memory
for insert
to public
with check (true);

create policy "sanad_human_flags_select_public"
on public.sanad_human_flags
for select
to public
using (true);

create policy "sanad_human_flags_insert_public"
on public.sanad_human_flags
for insert
to public
with check (true);

