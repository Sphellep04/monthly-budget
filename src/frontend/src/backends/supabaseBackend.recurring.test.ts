import { describe, expect, it } from "vitest";
import { recurringAppliesInMonth } from "./supabaseBackend";

describe("recurringAppliesInMonth", () => {
  it("applies a monthly recurrence in every month, regardless of anchor", () => {
    for (let month = 1; month <= 12; month++) {
      expect(recurringAppliesInMonth("monthly", 5, month)).toBe(true);
    }
  });

  it("applies with no anchor month set, regardless of frequency", () => {
    expect(recurringAppliesInMonth("quarterly", null, 3)).toBe(true);
    expect(recurringAppliesInMonth("annually", null, 11)).toBe(true);
  });

  it("applies an annual recurrence only in its anchor month", () => {
    expect(recurringAppliesInMonth("annually", 6, 6)).toBe(true);
    expect(recurringAppliesInMonth("annually", 6, 5)).toBe(false);
    expect(recurringAppliesInMonth("annually", 6, 7)).toBe(false);
    expect(recurringAppliesInMonth("annually", 6, 12)).toBe(false);
  });

  it("applies a quarterly recurrence every 3 months from the anchor, wrapping across the year", () => {
    // Anchored in March: fires Mar, Jun, Sep, Dec (months 3, 6, 9, 12).
    const expected = [
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
      false,
      false,
      true,
    ];
    for (let month = 1; month <= 12; month++) {
      expect(recurringAppliesInMonth("quarterly", 3, month)).toBe(
        expected[month - 1],
      );
    }
  });

  it("applies a quarterly recurrence anchored late in the year, wrapping correctly", () => {
    // Anchored in November: fires Nov, Feb, May, Aug.
    expect(recurringAppliesInMonth("quarterly", 11, 11)).toBe(true);
    expect(recurringAppliesInMonth("quarterly", 11, 2)).toBe(true);
    expect(recurringAppliesInMonth("quarterly", 11, 5)).toBe(true);
    expect(recurringAppliesInMonth("quarterly", 11, 8)).toBe(true);
    expect(recurringAppliesInMonth("quarterly", 11, 12)).toBe(false);
    expect(recurringAppliesInMonth("quarterly", 11, 1)).toBe(false);
  });
});
