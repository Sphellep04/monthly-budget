import { describe, expect, it } from "vitest";
import { shiftMonth } from "./monthMath";

describe("shiftMonth", () => {
  it("shifts forward within the same year", () => {
    expect(shiftMonth(2026, 3, 2)).toEqual({ year: 2026, month: 5 });
  });

  it("shifts backward within the same year", () => {
    expect(shiftMonth(2026, 5, -2)).toEqual({ year: 2026, month: 3 });
  });

  it("wraps backward across a year boundary", () => {
    expect(shiftMonth(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
    expect(shiftMonth(2026, 1, -2)).toEqual({ year: 2025, month: 11 });
  });

  it("wraps forward across a year boundary", () => {
    expect(shiftMonth(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
  });

  it("returns the same month for a zero shift", () => {
    expect(shiftMonth(2026, 6, 0)).toEqual({ year: 2026, month: 6 });
  });
});
