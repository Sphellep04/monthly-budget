export type DebtPayoffStrategy = "avalanche" | "snowball";

export interface DebtInput {
  id: string;
  balanceCents: bigint;
  annualRateBps: number;
  minimumPaymentCents: bigint;
}

export interface DebtPayoffEntry {
  id: string;
  monthsToPayoff: number;
}

export interface DebtPayoffPlan {
  order: string[];
  entries: DebtPayoffEntry[];
  totalMonths: number;
}

/** Highest interest rate first (avalanche) or lowest balance first (snowball). */
export function orderDebts(
  debts: DebtInput[],
  strategy: DebtPayoffStrategy,
): string[] {
  const sorted = [...debts].sort((a, b) =>
    strategy === "avalanche"
      ? b.annualRateBps - a.annualRateBps
      : Number(a.balanceCents - b.balanceCents),
  );
  return sorted.map((d) => d.id);
}

/**
 * Simulates paying minimums on every debt plus a fixed extra amount funneled to
 * the highest-priority unpaid debt in `order`; once a debt is paid off, its
 * minimum payment rolls into the extra pool for the next one (the standard
 * avalanche/snowball "waterfall"). Returns null if the plan never pays off
 * within maxMonths (extra + minimums don't outpace interest).
 */
export function simulateDebtPayoff(
  debts: DebtInput[],
  order: string[],
  extraMonthlyCents: bigint,
  maxMonths = 600,
): DebtPayoffPlan | null {
  const balances = new Map(debts.map((d) => [d.id, d.balanceCents]));
  const minPayments = new Map(debts.map((d) => [d.id, d.minimumPaymentCents]));
  const rates = new Map(debts.map((d) => [d.id, d.annualRateBps]));
  const payoffMonth = new Map<string, number>();

  for (let month = 1; month <= maxMonths; month++) {
    for (const id of order) {
      const bal = balances.get(id) ?? 0n;
      if (bal <= 0n) continue;
      const rateBps = BigInt(rates.get(id) ?? 0);
      const interest = (bal * rateBps) / 10000n / 12n;
      balances.set(id, bal + interest);
    }

    for (const id of order) {
      const bal = balances.get(id) ?? 0n;
      if (bal <= 0n) continue;
      const minPay = minPayments.get(id) ?? 0n;
      const payment = minPay < bal ? minPay : bal;
      const remaining = bal - payment;
      balances.set(id, remaining);
      if (remaining <= 0n && !payoffMonth.has(id)) payoffMonth.set(id, month);
    }

    let pool = extraMonthlyCents;
    for (const id of order) {
      if (payoffMonth.has(id) && payoffMonth.get(id) !== month) {
        pool += minPayments.get(id) ?? 0n;
      }
    }
    for (const id of order) {
      if (pool <= 0n) break;
      const bal = balances.get(id) ?? 0n;
      if (bal <= 0n) continue;
      const payment = pool < bal ? pool : bal;
      const remaining = bal - payment;
      balances.set(id, remaining);
      pool -= payment;
      if (remaining <= 0n && !payoffMonth.has(id)) payoffMonth.set(id, month);
    }

    if (order.every((id) => (balances.get(id) ?? 0n) <= 0n)) {
      return {
        order,
        entries: order.map((id) => ({
          id,
          monthsToPayoff: payoffMonth.get(id) ?? month,
        })),
        totalMonths: month,
      };
    }
  }
  return null;
}
