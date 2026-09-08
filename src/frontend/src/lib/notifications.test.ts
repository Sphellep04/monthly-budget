import { describe, expect, it } from "vitest";
import type { BudgetSummary, UpcomingBill } from "../types";
import { computeNotifications } from "./notifications";

function makeBudgetSummary(
  overrides: Partial<BudgetSummary["budget"]> = {},
  totalSpentCents = 0n,
  rolloverCents = 0n,
): BudgetSummary {
  return {
    budget: {
      id: 1n,
      owner: "u1",
      name: "Groceries",
      limitCents: 10000n,
      color: "#000",
      category: "Groceries",
      year: 2026n,
      month: 9n,
      rollover: false,
      createdAt: 0n,
      ...overrides,
    },
    totalSpentCents,
    remainingCents: 0n,
    rolloverCents,
  };
}

describe("computeNotifications", () => {
  it("flags an over-budget summary as danger", () => {
    const items = computeNotifications({
      budgetSummaries: [makeBudgetSummary({}, 15000n)],
      alertThreshold: 80,
      bills: [],
      topInsight: null,
    });
    expect(items).toHaveLength(1);
    expect(items[0].severity).toBe("danger");
    expect(items[0].id).toBe("budget-over-1");
  });

  it("flags a near-limit summary as warning", () => {
    const items = computeNotifications({
      budgetSummaries: [makeBudgetSummary({}, 8500n)],
      alertThreshold: 80,
      bills: [],
      topInsight: null,
    });
    expect(items).toHaveLength(1);
    expect(items[0].severity).toBe("warning");
  });

  it("omits on-track budgets", () => {
    const items = computeNotifications({
      budgetSummaries: [makeBudgetSummary({}, 1000n)],
      alertThreshold: 80,
      bills: [],
      topInsight: null,
    });
    expect(items).toHaveLength(0);
  });

  it("marks overdue bills as danger and upcoming ones as warning", () => {
    const bills: UpcomingBill[] = [
      {
        id: "b1",
        name: "Rent",
        amountCents: 500000n,
        dueDay: 1n,
        budgetName: "Housing",
        daysUntilDue: -2,
      },
      {
        id: "b2",
        name: "Internet",
        amountCents: 80000n,
        dueDay: 15n,
        budgetName: "Utilities",
        daysUntilDue: 2,
      },
    ];
    const items = computeNotifications({
      budgetSummaries: [],
      alertThreshold: 80,
      bills,
      topInsight: null,
    });
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.id === "bill-b1")?.severity).toBe("danger");
    expect(items.find((i) => i.id === "bill-b2")?.severity).toBe("warning");
  });

  it("includes the top insight as an info item when present", () => {
    const items = computeNotifications({
      budgetSummaries: [],
      alertThreshold: 80,
      bills: [],
      topInsight: {
        id: "trending-category",
        type: "trending-category",
        title: "Trending Category",
        value: "Dining Out +40%",
        subtext: "Up from N$500.00 to N$700.00 this month",
        color: "warning",
      },
    });
    expect(items).toHaveLength(1);
    expect(items[0].severity).toBe("info");
    expect(items[0].id).toBe("insight-trending-category");
  });
});
