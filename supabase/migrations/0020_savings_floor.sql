-- A standing minimum the user wants protected each month - distinct from a
-- Savings Goal (an aspirational target you build up toward): a floor is
-- evaluated fresh every month against that month's remaining balance.
-- 0 means "not set" (feature hidden in the UI).

alter table public.user_settings
  add column savings_floor_cents bigint not null default 0;
