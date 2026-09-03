import { describe, expect, it } from "vitest";
import { formatCents } from "./index";

// Mirrors the en-ZA grouping/decimal separators formatCents uses, so these
// assertions don't hardcode a non-breaking space character in source.
const group = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

describe("formatCents", () => {
  it("formats a positive bigint amount", () => {
    expect(formatCents(123456n)).toBe(`N$${group(1234.56)}`);
  });

  it("formats a positive number amount", () => {
    expect(formatCents(500)).toBe(`N$${group(5)}`);
  });

  it("formats zero", () => {
    expect(formatCents(0n)).toBe(`N$${group(0)}`);
  });

  it("formats a negative amount", () => {
    expect(formatCents(-250n)).toBe(`-N$${group(2.5)}`);
  });

  it("adds thousands separators for large amounts", () => {
    expect(formatCents(1250000n)).toBe(`N$${group(12500)}`);
  });
});
