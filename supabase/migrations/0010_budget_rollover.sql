-- Opt-in rollover: when set, a budget's unused amount from the immediately
-- preceding calendar month (matched by name, same owner) carries forward as
-- extra room this month. Single-hop only -- it does not compound indefinitely
-- across a chain of untouched months.

alter table public.budgets
  add column rollover boolean not null default false;
