-- Recurring templates/incomes were monthly-only. Add a frequency so annual and
-- quarterly bills (insurance, domain renewals) don't have to be re-added by hand.
-- anchor_month is the 1-12 month a quarterly/annual item is anchored to; for
-- quarterly it also recurs every 3 months from there. Ignored for monthly.

alter table public.recurring_templates
  add column frequency text not null default 'monthly'
    check (frequency in ('monthly', 'quarterly', 'annually')),
  add column anchor_month integer check (anchor_month between 1 and 12);

alter table public.recurring_incomes
  add column frequency text not null default 'monthly'
    check (frequency in ('monthly', 'quarterly', 'annually')),
  add column anchor_month integer check (anchor_month between 1 and 12);
