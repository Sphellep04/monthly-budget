-- Recurring income (e.g. monthly salary), mirroring recurring_templates on the expense side.

create table public.recurring_incomes (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  source text not null,
  amount_cents bigint not null,
  day_of_month integer not null,
  notes text,
  created_at timestamptz not null default now()
);
create index recurring_incomes_owner_idx on public.recurring_incomes (owner);

alter table public.incomes
  add column recurring_income_id bigint references public.recurring_incomes(id) on delete set null;

alter table public.recurring_incomes enable row level security;
create policy "select own" on public.recurring_incomes for select using (owner = auth.uid());
create policy "insert own" on public.recurring_incomes for insert with check (owner = auth.uid());
create policy "update own" on public.recurring_incomes for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.recurring_incomes for delete using (owner = auth.uid());
