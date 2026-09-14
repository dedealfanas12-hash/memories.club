-- Run this once in your Supabase project's SQL editor
-- (Project -> SQL Editor -> New query -> paste -> Run).

create table if not exists momenku_storage (
  storage_key text not null,
  owner_id text not null,
  shared boolean not null default false,
  value text not null,
  updated_at timestamptz not null default now(),
  primary key (storage_key, owner_id)
);

alter table momenku_storage enable row level security;

-- Wide-open policy: fine for a personal project or early prototype where
-- anyone with an invitation link is meant to be able to read it, and there
-- is no login system to check against. If you later add real user accounts,
-- replace this with policies scoped to auth.uid().
create policy "momenku prototype - open read/write"
on momenku_storage
for all
using (true)
with check (true);
