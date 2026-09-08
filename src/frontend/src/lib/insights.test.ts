import { describe, expect, it } from "vitest";
import { computeGapComparison, computeTrendingCategory } from "./insights";

describe("computeTrendingCategory", () => {
  it("flags the category with the biggest percentage change", () => {
    const current = [
      { budgetId: "1", name: "Groceries", amountCents: 10000n, color: "#000" },
      { budgetId: "2", name: "Wifi", amountCents: 270000n, color: "#000" },
    ];
    const prev = [
      { budgetId: "1", name: "Groceries", amountCents: 9500n, color: "#000" },
      { budgetId: "2", name: "Wifi", amountCents: 89900n, color: "#000" },
    ];
    const insight = computeTrendingCategory(current, prev);
    expect(insight?.value).toContain("Wifi");
    expect(insight?.direction).toBe("up");
  });

  it("ignores changes under the 10% threshold", () => {
    const current = [
      { budgetId: "1", name: "Groceries", amountCents: 10200n, color: "#000" },
    ];
    const prev = [
      { budgetId: "1", name: "Groceries", amountCents: 10000n, color: "#000" },
    ];
    expect(computeTrendingCategory(current, prev)).toBeNull();
  });

  it("returns null with no prior-month data to compare against", () => {
    const current = [
      { budgetId: "1", name: "Groceries", amountCents: 10000n, color: "#000" },
    ];
    expect(computeTrendingCategory(current, [])).toBeNull();
  });

  it("skips a category with zero prior spend rather than reporting an infinite change", () => {
    const current = [
      { budgetId: "1", name: "NewCat", amountCents: 5000n, color: "#000" },
    ];
    const prev = [
      { budgetId: "1", name: "NewCat", amountCents: 0n, color: "#000" },
    ];
    expect(computeTrendingCategory(current, prev)).toBeNull();
  });
});

describe("computeGapComparison", () => {
  it("computes this month's gap (spent - budget) and the delta from last month", () => {
    const result = computeGapComparison({
      label: "July",
      totalBudgetCents: 320000n,
      totalSpentCents: 335000n, // 1500 over
      prevTotalBudgetCents: 300000n,
      prevTotalSpentCents: 328000n, // 2800 over
    });
    expect(result?.gapCents).toBe(15000);
    expect(result?.prevGapCents).toBe(28000);
    expect(result?.deltaCents).toBe(13000);
    expect(result?.better).toBe(true);
  });

  it("marks a worsening gap as not better", () => {
    const result = computeGapComparison({
      label: "July",
      totalBudgetCents: 300000n,
      totalSpentCents: 320000n,
      prevTotalBudgetCents: 300000n,
      prevTotalSpentCents: 305000n,
    });
    expect(result?.better).toBe(false);
    expect(result?.deltaCents).toBeLessThan(0);
  });

  it("handles a surplus (under budget) as a negative gap", () => {
    const result = computeGapComparison({
      label: "July",
      totalBudgetCents: 300000n,
      totalSpentCents: 250000n,
      prevTotalBudgetCents: 300000n,
      prevTotalSpentCents: 300000n,
    });
    expect(result?.gapCents).toBe(-50000);
  });

  it("returns null when neither month has a budget set", () => {
    const result = computeGapComparison({
      label: "July",
      totalBudgetCents: 0n,
      totalSpentCents: 0n,
      prevTotalBudgetCents: 0n,
      prevTotalSpentCents: 0n,
    });
    expect(result).toBeNull();
  });
});
