-- Allow public (anon) and authenticated users to read education tables for the app
alter table if exists public.subjects enable row level security;
alter table if exists public.chapters enable row level security;
alter table if exists public.lesson_content enable row level security;

drop policy if exists "subjects_select" on public.subjects;
create policy "subjects_select" on public.subjects for select using (true);

drop policy if exists "chapters_select" on public.chapters;
create policy "chapters_select" on public.chapters for select using (true);

drop policy if exists "lesson_content_select" on public.lesson_content;
create policy "lesson_content_select" on public.lesson_content for select using (true);
