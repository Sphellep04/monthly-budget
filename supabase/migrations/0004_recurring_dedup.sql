-- Plain (non-partial) unique indexes: Postgres treats NULL as distinct from every other
-- NULL, so these only constrain rows that actually have a non-null recurring_template_id /
-- recurring_income_id -- ordinary manually-entered expenses/incomes (always NULL here) are
-- unaffected. A partial index (WHERE ... IS NOT NULL) was considered but supabase-js's
-- .upsert(..., { onConflict }) can't target a partial index's WHERE predicate via PostgREST,
-- so a plain index is required for the upsert-based fix in applyRecurringTemplates/
-- applyRecurringIncomes to work. This closes the race condition at the database level
-- (upsert with onConflict replaces the old select-then-insert check) instead of merely
-- reducing its odds.

create unique index expenses_recurring_dedup_idx
  on public.expenses (owner, recurring_template_id, date);

create unique index incomes_recurring_dedup_idx
  on public.incomes (owner, recurring_income_id, date);
