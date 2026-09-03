-- Per-user merchant keyword -> category mappings, learned from what the
-- user actually picks when auto-categorization suggests (or fails to
-- suggest) a category. One row per keyword; picking a new category for an
-- already-known keyword overwrites the old mapping (upserted from the app).

create table public.category_rules (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  keyword text not null,
  category text not null,
  created_at timestamptz not null default now(),
  unique (owner, keyword)
);
create index category_rules_owner_idx on public.category_rules (owner);

alter table public.category_rules enable row level security;

create policy "select own" on public.category_rules for select using (owner = auth.uid());
create policy "insert own" on public.category_rules for insert with check (owner = auth.uid());
create policy "update own" on public.category_rules for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.category_rules for delete using (owner = auth.uid());
