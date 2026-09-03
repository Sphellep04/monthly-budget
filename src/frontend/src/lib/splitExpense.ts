export interface SplitRowAmount {
  budgetId: string;
  amountStr: string;
}

function parseRowCents(amountStr: string): number {
  const n = Number.parseFloat(amountStr);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

/** Sum of all split rows' amounts, and what's left over for the primary budget. */
export function computeSplitTotals(
  totalCents: number,
  splitRows: SplitRowAmount[],
): { splitTotalCents: number; primaryRemainingCents: number } {
  const splitTotalCents = splitRows.reduce(
    (sum, row) => sum + parseRowCents(row.amountStr),
    0,
  );
  return {
    splitTotalCents,
    primaryRemainingCents: totalCents - splitTotalCents,
  };
}

/**
 * Validates a set of split rows against the primary expense total. Returns
 * a user-facing error message, or null if the split is valid: every row
 * has a budget and a positive amount, and the splits leave a positive
 * amount for the primary budget (so the total is always fully accounted
 * for, split across at least two budgets - never zero or negative for
 * either side).
 */
export function validateSplitExpense(
  splitRows: SplitRowAmount[],
  primaryRemainingCents: number,
): string | null {
  if (splitRows.length === 0) return null;
  if (splitRows.some((r) => !r.budgetId)) {
    return "Choose a budget for every split.";
  }
  if (splitRows.some((r) => Number.parseFloat(r.amountStr) <= 0)) {
    return "Enter a valid amount for every split.";
  }
  if (primaryRemainingCents <= 0) {
    return "The splits must add up to less than the total amount.";
  }
  return null;
}
