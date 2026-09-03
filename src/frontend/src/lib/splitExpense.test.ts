import { describe, expect, it } from "vitest";
import { computeSplitTotals, validateSplitExpense } from "./splitExpense";

describe("computeSplitTotals", () => {
  it("subtracts split rows from the total to get the primary remainder", () => {
    const { splitTotalCents, primaryRemainingCents } = computeSplitTotals(
      10000,
      [{ budgetId: "1", amountStr: "30.00" }],
    );
    expect(splitTotalCents).toBe(3000);
    expect(primaryRemainingCents).toBe(7000);
  });

  it("ignores rows with invalid or non-positive amounts", () => {
    const { splitTotalCents } = computeSplitTotals(10000, [
      { budgetId: "1", amountStr: "abc" },
      { budgetId: "2", amountStr: "-5.00" },
      { budgetId: "3", amountStr: "0" },
    ]);
    expect(splitTotalCents).toBe(0);
  });

  it("returns the full total as the primary remainder with no split rows", () => {
    const { primaryRemainingCents } = computeSplitTotals(5000, []);
    expect(primaryRemainingCents).toBe(5000);
  });
});

describe("validateSplitExpense", () => {
  it("passes with no split rows", () => {
    expect(validateSplitExpense([], 5000)).toBeNull();
  });

  it("requires a budget on every row", () => {
    const error = validateSplitExpense(
      [{ budgetId: "", amountStr: "10.00" }],
      5000,
    );
    expect(error).toMatch(/budget/i);
  });

  it("requires a positive amount on every row", () => {
    const error = validateSplitExpense(
      [{ budgetId: "1", amountStr: "0" }],
      5000,
    );
    expect(error).toMatch(/amount/i);
  });

  it("rejects splits that consume the entire total, leaving nothing for the primary budget", () => {
    const error = validateSplitExpense(
      [{ budgetId: "1", amountStr: "100.00" }],
      0,
    );
    expect(error).toMatch(/add up/i);
  });

  it("rejects splits that exceed the total", () => {
    const error = validateSplitExpense(
      [{ budgetId: "1", amountStr: "150.00" }],
      -5000,
    );
    expect(error).toMatch(/add up/i);
  });

  it("accepts a valid split that leaves a positive remainder", () => {
    const error = validateSplitExpense(
      [
        { budgetId: "1", amountStr: "20.00" },
        { budgetId: "2", amountStr: "10.00" },
      ],
      7000,
    );
    expect(error).toBeNull();
  });
});
