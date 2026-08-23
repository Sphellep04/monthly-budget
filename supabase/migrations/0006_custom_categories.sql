-- User-defined budget categories, supplementing the app's built-in category list.

create table public.categories (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (owner, name)
);
create index categories_owner_idx on public.categories (owner);

alter table public.categories enable row level security;
create policy "select own" on public.categories for select using (owner = auth.uid());
create policy "insert own" on public.categories for insert with check (owner = auth.uid());
create policy "delete own" on public.categories for delete using (owner = auth.uid());
