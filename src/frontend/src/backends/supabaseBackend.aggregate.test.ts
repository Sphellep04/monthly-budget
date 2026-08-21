import { describe, expect, it } from "vitest";
import {
  type BudgetRow,
  type ExpenseRow,
  type IncomeRow,
  aggregateMonthlySummary,
} from "./supabaseBackend";

function budgetRow(overrides: Partial<BudgetRow> = {}): BudgetRow {
  return {
    id: 1,
    owner: "user-1",
    name: "Groceries",
    limit_cents: "50000",
    color: "#22c55e",
    category: "Groceries",
    year: 2026,
    month: 8,
    created_at: "2026-08-01T00:00:00Z",
    ...overrides,
  };
}

function expenseRow(overrides: Partial<ExpenseRow> = {}): ExpenseRow {
  return {
    id: 1,
    budget_id: 1,
    owner: "user-1",
    date: "2026-08-05",
    amount_cents: "1000",
    notes: null,
    receipt_url: null,
    recurring_template_id: null,
    created_at: "2026-08-05T00:00:00Z",
    ...overrides,
  };
}

function incomeRow(overrides: Partial<IncomeRow> = {}): IncomeRow {
  return {
    id: 1,
    owner: "user-1",
    source: "Salary",
    amount_cents: "450000",
    date: "2026-08-01",
    notes: null,
    recurring_income_id: null,
    created_at: "2026-08-01T00:00:00Z",
    ...overrides,
  };
}

describe("aggregateMonthlySummary", () => {
  it("attributes expenses to the matching budget and computes remaining", () => {
    const summary = aggregateMonthlySummary(
      2026n,
      8n,
      [budgetRow()],
      [expenseRow({ amount_cents: "3000" })],
      [],
    );

    expect(summary.budgets).toHaveLength(1);
    expect(summary.budgets[0].totalSpentCents).toBe(3000n);
    expect(summary.budgets[0].remainingCents).toBe(47000n);
  });

  it("ignores expenses belonging to a different budget", () => {
    const summary = aggregateMonthlySummary(
      2026n,
      8n,
      [budgetRow({ id: 1 }), budgetRow({ id: 2, name: "Dining" })],
      [expenseRow({ budget_id: 2, amount_cents: "2000" })],
      [],
    );

    const [groceries, dining] = summary.budgets;
    expect(groceries.totalSpentCents).toBe(0n);
    expect(dining.totalSpentCents).toBe(2000n);
  });

  it("sums totals across budgets and income", () => {
    const summary = aggregateMonthlySummary(
      2026n,
      8n,
      [
        budgetRow({ id: 1, limit_cents: "50000" }),
        budgetRow({ id: 2, limit_cents: "20000" }),
      ],
      [
        expenseRow({ id: 1, budget_id: 1, amount_cents: "1000" }),
        expenseRow({ id: 2, budget_id: 2, amount_cents: "500" }),
      ],
      [
        incomeRow({ amount_cents: "450000" }),
        incomeRow({ id: 2, amount_cents: "10000" }),
      ],
    );

    expect(summary.totalBudgetCents).toBe(70000n);
    expect(summary.totalSpentCents).toBe(1500n);
    expect(summary.totalIncomeCents).toBe(460000n);
    expect(summary.year).toBe(2026n);
    expect(summary.month).toBe(8n);
  });

  it("returns an empty summary when there are no budgets", () => {
    const summary = aggregateMonthlySummary(2026n, 8n, [], [], []);

    expect(summary.budgets).toEqual([]);
    expect(summary.totalBudgetCents).toBe(0n);
    expect(summary.totalSpentCents).toBe(0n);
    expect(summary.totalIncomeCents).toBe(0n);
  });
});
