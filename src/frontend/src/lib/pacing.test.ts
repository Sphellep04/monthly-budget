import { describe, expect, it } from "vitest";
import { computeDailyPace } from "./pacing";

describe("computeDailyPace", () => {
  it("computes days left (inclusive of today) and the safe per-day amount", () => {
    const today = new Date(2026, 7, 13); // 13 Aug 2026 (31-day month)
    const result = computeDailyPace(2026, 8, 123300, today);
    expect(result?.daysLeft).toBe(19); // 31 - 13 + 1
    expect(result?.perDayCents).toBeCloseTo(123300 / 19);
  });

  it("returns null for a month other than the real current one", () => {
    const today = new Date(2026, 7, 13);
    expect(computeDailyPace(2026, 7, 50000, today)).toBeNull();
    expect(computeDailyPace(2027, 8, 50000, today)).toBeNull();
  });

  it("floors the per-day amount at zero when already over budget", () => {
    const today = new Date(2026, 7, 13);
    const result = computeDailyPace(2026, 8, -50000, today);
    expect(result?.perDayCents).toBe(0);
  });

  it("treats the last day of the month as 1 day left, not 0", () => {
    const today = new Date(2026, 3, 30); // 30 Apr 2026 (30-day month)
    const result = computeDailyPace(2026, 4, 68500, today);
    expect(result?.daysLeft).toBe(1);
    expect(result?.perDayCents).toBe(68500);
  });
});
