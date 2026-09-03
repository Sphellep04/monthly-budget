import { describe, expect, it } from "vitest";
import { parseTransactionText } from "./transactionParser";

describe("parseTransactionText", () => {
  it("extracts an N$-prefixed amount, a slash date, and a merchant after 'at'", () => {
    const result = parseTransactionText(
      "FNB: Your acc was debited with N$150.00 at SHOPRITE WINDHOEK on 03/09/2026. Avail bal N$2,450.32",
    );
    expect(result.amountCents).toBe(15000n);
    expect(result.date).toBe("2026-09-03");
    expect(result.merchant).toBe("SHOPRITE WINDHOEK");
  });

  it("extracts a Rand-prefixed amount", () => {
    const result = parseTransactionText(
      "Purchase of R85.50 at ENGEN on 03-09-2026",
    );
    expect(result.amountCents).toBe(8550n);
  });

  it("handles a thousands-separated amount", () => {
    const result = parseTransactionText(
      "Debit of N$1,234.56 at TAKEALOT on 03/09/2026",
    );
    expect(result.amountCents).toBe(123456n);
  });

  it("falls back to an amount near a transaction verb when there's no currency symbol", () => {
    const result = parseTransactionText(
      "Amt: 320.00 debited from your account",
    );
    expect(result.amountCents).toBe(32000n);
  });

  it("extracts a worded date", () => {
    const result = parseTransactionText(
      "Purchase of N$45.00 at SPAR on 03 Sep 2026",
    );
    expect(result.date).toBe("2026-09-03");
  });

  it("returns nulls for text with nothing recognizable", () => {
    const result = parseTransactionText("hello there, how are you?");
    expect(result.amountCents).toBeNull();
    expect(result.date).toBeNull();
    expect(result.merchant).toBeNull();
  });
});
