-- BudgetWise initial schema: one table per persisted app type, RLS scoped to owner,
-- plus a private storage bucket for receipt photos.

create table public.budgets (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  limit_cents bigint not null,
  color text not null,
  category text not null,
  year integer not null,
  month integer not null,
  created_at timestamptz not null default now()
);
create index budgets_owner_year_month_idx on public.budgets (owner, year, month);

create table public.recurring_templates (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  budget_id bigint not null references public.budgets(id) on delete cascade,
  name text not null,
  amount_cents bigint not null,
  day_of_month integer not null,
  notes text,
  created_at timestamptz not null default now()
);
create index recurring_templates_owner_idx on public.recurring_templates (owner);

create table public.expenses (
  id bigint generated always as identity primary key,
  budget_id bigint not null references public.budgets(id) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  date date not null,
  amount_cents bigint not null,
  notes text,
  receipt_url text,
  recurring_template_id bigint references public.recurring_templates(id) on delete set null,
  created_at timestamptz not null default now()
);
create index expenses_owner_budget_idx on public.expenses (owner, budget_id);
create index expenses_owner_date_idx on public.expenses (owner, date);

create table public.bill_payments (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  recurring_template_id bigint not null references public.recurring_templates(id) on delete cascade,
  year integer not null,
  month integer not null,
  due_day integer not null,
  paid_date timestamptz,
  paid_amount_cents bigint,
  notes text
);
create index bill_payments_owner_idx on public.bill_payments (owner);

create table public.incomes (
  id bigint generated always as identity primary key,
  owner uuid not null references auth.users(id) on delete cascade,
  source text not null,
  amount_cents bigint not null,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);
create index incomes_owner_date_idx on public.incomes (owner, date);

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_cents bigint not null,
  saved_cents bigint not null default 0,
  target_date date,
  color text not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index savings_goals_owner_idx on public.savings_goals (owner);

create table public.budget_templates (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index budget_templates_owner_idx on public.budget_templates (owner);

create table public.budget_template_categories (
  id bigint generated always as identity primary key,
  budget_template_id uuid not null references public.budget_templates(id) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  limit_cents bigint not null,
  color text not null,
  category text not null,
  sort_order integer not null default 0
);
create index budget_template_categories_template_idx on public.budget_template_categories (budget_template_id);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notes_owner_idx on public.notes (owner);

create table public.user_settings (
  owner uuid primary key references auth.users(id) on delete cascade,
  alert_threshold_percent integer not null default 80
);

-- Row Level Security: every table restricted to rows owned by the authenticated user.
-- All 4 policies (select/insert/update/delete) are required on each table -- a table with
-- RLS enabled but fewer policies silently blocks the owner's own writes rather than erroring.

alter table public.budgets enable row level security;
create policy "select own" on public.budgets for select using (owner = auth.uid());
create policy "insert own" on public.budgets for insert with check (owner = auth.uid());
create policy "update own" on public.budgets for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.budgets for delete using (owner = auth.uid());

alter table public.recurring_templates enable row level security;
create policy "select own" on public.recurring_templates for select using (owner = auth.uid());
create policy "insert own" on public.recurring_templates for insert with check (owner = auth.uid());
create policy "update own" on public.recurring_templates for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.recurring_templates for delete using (owner = auth.uid());

alter table public.expenses enable row level security;
create policy "select own" on public.expenses for select using (owner = auth.uid());
create policy "insert own" on public.expenses for insert with check (owner = auth.uid());
create policy "update own" on public.expenses for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.expenses for delete using (owner = auth.uid());

alter table public.bill_payments enable row level security;
create policy "select own" on public.bill_payments for select using (owner = auth.uid());
create policy "insert own" on public.bill_payments for insert with check (owner = auth.uid());
create policy "update own" on public.bill_payments for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.bill_payments for delete using (owner = auth.uid());

alter table public.incomes enable row level security;
create policy "select own" on public.incomes for select using (owner = auth.uid());
create policy "insert own" on public.incomes for insert with check (owner = auth.uid());
create policy "update own" on public.incomes for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.incomes for delete using (owner = auth.uid());

alter table public.savings_goals enable row level security;
create policy "select own" on public.savings_goals for select using (owner = auth.uid());
create policy "insert own" on public.savings_goals for insert with check (owner = auth.uid());
create policy "update own" on public.savings_goals for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.savings_goals for delete using (owner = auth.uid());

alter table public.budget_templates enable row level security;
create policy "select own" on public.budget_templates for select using (owner = auth.uid());
create policy "insert own" on public.budget_templates for insert with check (owner = auth.uid());
create policy "update own" on public.budget_templates for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.budget_templates for delete using (owner = auth.uid());

alter table public.budget_template_categories enable row level security;
create policy "select own" on public.budget_template_categories for select using (owner = auth.uid());
create policy "insert own" on public.budget_template_categories for insert with check (owner = auth.uid());
create policy "update own" on public.budget_template_categories for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.budget_template_categories for delete using (owner = auth.uid());

alter table public.notes enable row level security;
create policy "select own" on public.notes for select using (owner = auth.uid());
create policy "insert own" on public.notes for insert with check (owner = auth.uid());
create policy "update own" on public.notes for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.notes for delete using (owner = auth.uid());

alter table public.user_settings enable row level security;
create policy "select own" on public.user_settings for select using (owner = auth.uid());
create policy "insert own" on public.user_settings for insert with check (owner = auth.uid());
create policy "update own" on public.user_settings for update using (owner = auth.uid()) with check (owner = auth.uid());
create policy "delete own" on public.user_settings for delete using (owner = auth.uid());

-- Storage: private bucket for receipt photos, path convention {owner_uuid}/{uuid}-{filename}

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy "select own receipts" on storage.objects for select
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "insert own receipts" on storage.objects for insert
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own receipts" on storage.objects for delete
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
