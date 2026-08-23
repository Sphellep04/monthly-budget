-- Extends import_all_data (0003, 0007, 0009, 0011, 0013) so restoring a backup
-- carries forward each account's interest rate and minimum payment.

create or replace function public.import_all_data(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid := auth.uid();
begin
  if v_owner is null then
    raise exception 'not authenticated';
  end if;

  -- Delete children before parents.
  delete from expenses where owner = v_owner;
  delete from bill_payments where owner = v_owner;
  delete from budget_template_categories where owner = v_owner;
  delete from incomes where owner = v_owner;
  delete from recurring_templates where owner = v_owner;
  delete from recurring_incomes where owner = v_owner;
  delete from budget_templates where owner = v_owner;
  delete from budgets where owner = v_owner;
  delete from savings_goals where owner = v_owner;
  delete from notes where owner = v_owner;
  delete from categories where owner = v_owner;
  delete from accounts where owner = v_owner;

  -- Insert parents before children.

  insert into budgets (id, owner, name, limit_cents, color, category, year, month, rollover, created_at)
  overriding system value
  select (r->>'id')::bigint, v_owner, r->>'name', (r->>'limit_cents')::bigint,
         r->>'color', r->>'category', (r->>'year')::int, (r->>'month')::int,
         coalesce((r->>'rollover')::boolean, false),
         coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'budgets', '[]'::jsonb)) r;
  perform setval(pg_get_serial_sequence('budgets', 'id'),
    greatest((select coalesce(max(id), 0) from budgets), 1));

  insert into budget_templates (id, owner, name, created_at)
  select coalesce((r->>'id')::uuid, gen_random_uuid()), v_owner, r->>'name',
         coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'budgetTemplates', '[]'::jsonb)) r;

  insert into recurring_incomes (id, owner, source, amount_cents, day_of_month, frequency, anchor_month, notes, created_at)
  overriding system value
  select (r->>'id')::bigint, v_owner, r->>'source', (r->>'amount_cents')::bigint,
         (r->>'day_of_month')::int, coalesce(r->>'frequency', 'monthly'),
         (r->>'anchor_month')::int, r->>'notes', coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'recurringIncomes', '[]'::jsonb)) r;
  perform setval(pg_get_serial_sequence('recurring_incomes', 'id'),
    greatest((select coalesce(max(id), 0) from recurring_incomes), 1));

  insert into recurring_templates (id, owner, budget_id, name, amount_cents, day_of_month, frequency, anchor_month, notes, created_at)
  overriding system value
  select (r->>'id')::bigint, v_owner, (r->>'budget_id')::bigint, r->>'name',
         (r->>'amount_cents')::bigint, (r->>'day_of_month')::int, coalesce(r->>'frequency', 'monthly'),
         (r->>'anchor_month')::int, r->>'notes',
         coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'recurringTemplates', '[]'::jsonb)) r;
  perform setval(pg_get_serial_sequence('recurring_templates', 'id'),
    greatest((select coalesce(max(id), 0) from recurring_templates), 1));

  insert into budget_template_categories (budget_template_id, owner, name, limit_cents, color, category, sort_order)
  select (r->>'budget_template_id')::uuid, v_owner, r->>'name', (r->>'limit_cents')::bigint,
         r->>'color', r->>'category', coalesce((r->>'sort_order')::int, 0)
  from jsonb_array_elements(coalesce(payload->'budgetTemplateCategories', '[]'::jsonb)) r;

  insert into incomes (owner, source, amount_cents, date, notes, recurring_income_id, created_at)
  select v_owner, r->>'source', (r->>'amount_cents')::bigint, (r->>'date')::date, r->>'notes',
         (r->>'recurring_income_id')::bigint, coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'incomes', '[]'::jsonb)) r;

  insert into expenses (owner, budget_id, date, amount_cents, notes, receipt_url, recurring_template_id, created_at)
  select v_owner, (r->>'budget_id')::bigint, (r->>'date')::date, (r->>'amount_cents')::bigint,
         r->>'notes', r->>'receipt_url', (r->>'recurring_template_id')::bigint,
         coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'expenses', '[]'::jsonb)) r;

  insert into bill_payments (id, owner, recurring_template_id, year, month, due_day, paid_date, paid_amount_cents, notes)
  select coalesce((r->>'id')::uuid, gen_random_uuid()), v_owner, (r->>'recurring_template_id')::bigint,
         (r->>'year')::int, (r->>'month')::int, (r->>'due_day')::int,
         (r->>'paid_date')::timestamptz, (r->>'paid_amount_cents')::bigint, r->>'notes'
  from jsonb_array_elements(coalesce(payload->'billPayments', '[]'::jsonb)) r;

  insert into savings_goals (id, owner, name, target_cents, saved_cents, target_date, color, created_at, completed_at)
  select coalesce((r->>'id')::uuid, gen_random_uuid()), v_owner, r->>'name', (r->>'target_cents')::bigint,
         coalesce((r->>'saved_cents')::bigint, 0), (r->>'target_date')::date, r->>'color',
         coalesce((r->>'created_at')::timestamptz, now()), (r->>'completed_at')::timestamptz
  from jsonb_array_elements(coalesce(payload->'savingsGoals', '[]'::jsonb)) r;

  insert into notes (id, owner, title, content, created_at, updated_at)
  select coalesce((r->>'id')::uuid, gen_random_uuid()), v_owner, r->>'title', r->>'content',
         coalesce((r->>'created_at')::timestamptz, now()), coalesce((r->>'updated_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'notes', '[]'::jsonb)) r;

  insert into categories (owner, name, created_at)
  select v_owner, r->>'name', coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'categories', '[]'::jsonb)) r;

  insert into accounts (owner, name, type, balance_cents, interest_rate_bps, minimum_payment_cents, created_at)
  select v_owner, r->>'name', r->>'type', coalesce((r->>'balance_cents')::bigint, 0),
         (r->>'interest_rate_bps')::int, (r->>'minimum_payment_cents')::bigint,
         coalesce((r->>'created_at')::timestamptz, now())
  from jsonb_array_elements(coalesce(payload->'accounts', '[]'::jsonb)) r;

  if payload ? 'userSettings' then
    insert into user_settings (owner, alert_threshold_percent)
    values (v_owner, coalesce((payload->'userSettings'->>'alert_threshold_percent')::int, 80))
    on conflict (owner) do update set alert_threshold_percent = excluded.alert_threshold_percent;
  end if;
end;
$$;

revoke all on function public.import_all_data(jsonb) from public;
grant execute on function public.import_all_data(jsonb) to authenticated;
