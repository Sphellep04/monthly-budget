-- Account balances (checking, savings, credit card, loan, investment) so net
-- worth can be tracked separately from monthly budget/expense tracking.
-- balance_cents is always a positive magnitude; for credit_card/loan it means
-- "amount owed" and is subtracted (not added) when computing net worth.

create table public.accounts (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('checking', 'savings', 'credit_card', 'loan', 'investment', 'other')),
  balance_cents bigint not null default 0,
  created_at timestamptz not null default now()
);
create index accounts_owner_idx on public.accounts (owner);

alter table public.accounts enable row level security;
create policy "select own" on public.accounts for select using (owner = auth.uid());
create policy "insert own" on public.accounts for insert with check (owner = auth.uid());
create policy "update own" on public.accounts for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.accounts for delete using (owner = auth.uid());
