-- SANAD advisor booking requests

create table if not exists public.advisor_booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  source text not null default 'sanad',
  status text not null default 'PENDING',
  reason text,
  created_at timestamptz default now()
);

create index if not exists idx_advisor_booking_requests_user on public.advisor_booking_requests (user_id);
create index if not exists idx_advisor_booking_requests_status on public.advisor_booking_requests (status);

alter table public.advisor_booking_requests enable row level security;

-- For hackathon/demo: allow inserting a booking request for anyone.
-- In production, this should be restricted to authenticated users.
create policy "advisor_booking_requests_insert_public"
on public.advisor_booking_requests
for insert
to public
with check (true);

-- Hide booking requests by default (no public select).

