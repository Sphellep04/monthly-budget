import { describe, expect, it } from "vitest";
import { formatCents } from "./index";

describe("formatCents", () => {
  it("formats a positive bigint amount", () => {
    expect(formatCents(123456n)).toBe("N$1234.56");
  });

  it("formats a positive number amount", () => {
    expect(formatCents(500)).toBe("N$5.00");
  });

  it("formats zero", () => {
    expect(formatCents(0n)).toBe("N$0.00");
  });

  it("formats a negative amount", () => {
    expect(formatCents(-250n)).toBe("N$-2.50");
  });
});
