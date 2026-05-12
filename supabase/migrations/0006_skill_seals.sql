-- Skill Passport seals (MVP-friendly: user_id as text)

create table if not exists public.skill_seals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  student_address text,
  skill_name text not null,
  score integer,
  issuer text not null default 'Sanad',
  issued_at timestamptz default now(),
  chain_id integer,
  tx_hash text,
  polygonscan_url text,
  status text not null default 'ISSUED' check (status in ('ISSUED','FAILED')),
  meta jsonb
);

create index if not exists idx_skill_seals_user on public.skill_seals (user_id);
create index if not exists idx_skill_seals_issued_at on public.skill_seals (issued_at desc);

alter table public.skill_seals enable row level security;

-- Demo policies: allow read/insert for anyone.
create policy "skill_seals_select_public"
on public.skill_seals
for select
to public
using (true);

create policy "skill_seals_insert_public"
on public.skill_seals
for insert
to public
with check (true);

