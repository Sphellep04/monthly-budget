-- Interest rate and minimum payment for liability accounts (credit_card, loan),
-- needed to compute a payoff plan. Meaningless for asset accounts, left null there.

alter table public.accounts
  add column interest_rate_bps integer check (interest_rate_bps >= 0),
  add column minimum_payment_cents bigint check (minimum_payment_cents >= 0);
