-- Tags expense rows created together as one split transaction (e.g. a single
-- receipt covering groceries and household items) so they can be grouped in
-- the UI. Each row is still an ordinary expense with its own budget_id and
-- amount_cents -- this is purely a display grouping, not a new entity.

alter table public.expenses
  add column split_group_id uuid;
create index expenses_split_group_idx on public.expenses (owner, split_group_id)
  where split_group_id is not null;
