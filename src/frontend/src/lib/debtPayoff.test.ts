import { describe, expect, it } from "vitest";
import { type DebtInput, orderDebts, simulateDebtPayoff } from "./debtPayoff";

describe("orderDebts", () => {
  const debts: DebtInput[] = [
    {
      id: "a",
      balanceCents: 500000n,
      annualRateBps: 1500,
      minimumPaymentCents: 5000n,
    },
    {
      id: "b",
      balanceCents: 100000n,
      annualRateBps: 2400,
      minimumPaymentCents: 3000n,
    },
    {
      id: "c",
      balanceCents: 200000n,
      annualRateBps: 999,
      minimumPaymentCents: 2000n,
    },
  ];

  it("avalanche orders highest interest rate first", () => {
    expect(orderDebts(debts, "avalanche")).toEqual(["b", "a", "c"]);
  });

  it("snowball orders lowest balance first", () => {
    expect(orderDebts(debts, "snowball")).toEqual(["b", "c", "a"]);
  });
});

describe("simulateDebtPayoff", () => {
  it("pays off a single zero-interest debt in balance/payment months", () => {
    const debts: DebtInput[] = [
      {
        id: "a",
        balanceCents: 100000n,
        annualRateBps: 0,
        minimumPaymentCents: 10000n,
      },
    ];
    const plan = simulateDebtPayoff(debts, ["a"], 0n);
    expect(plan).not.toBeNull();
    expect(plan?.totalMonths).toBe(10);
    expect(plan?.entries).toEqual([{ id: "a", monthsToPayoff: 10 }]);
  });

  it("finishes sooner with an extra payment", () => {
    const debts: DebtInput[] = [
      {
        id: "a",
        balanceCents: 100000n,
        annualRateBps: 0,
        minimumPaymentCents: 10000n,
      },
    ];
    const plan = simulateDebtPayoff(debts, ["a"], 10000n);
    expect(plan?.totalMonths).toBe(5);
  });

  it("rolls a paid-off debt's minimum into the next debt's payment", () => {
    const debts: DebtInput[] = [
      {
        id: "small",
        balanceCents: 10000n,
        annualRateBps: 0,
        minimumPaymentCents: 10000n,
      },
      {
        id: "big",
        balanceCents: 200000n,
        annualRateBps: 0,
        minimumPaymentCents: 10000n,
      },
    ];
    // "small" pays off month 1; from month 2 its 10000 minimum rolls into "big"'s
    // extra pool on top of "big"'s own 10000 minimum -> 20000/month after that.
    const plan = simulateDebtPayoff(debts, ["small", "big"], 0n);
    expect(plan?.entries.find((e) => e.id === "small")?.monthsToPayoff).toBe(1);
    // month 1: big pays only its 10000 minimum (190000 left, since small's
    // minimum doesn't roll in until the month after it's paid off). months
    // 2-10: 20000/month (9 * 20000 = 180000 -> 10000 left). month 11: final
    // 10000 minimum payment clears it.
    expect(plan?.entries.find((e) => e.id === "big")?.monthsToPayoff).toBe(11);
  });

  it("returns null when the payment never outpaces interest", () => {
    const debts: DebtInput[] = [
      {
        id: "a",
        balanceCents: 1000000n,
        annualRateBps: 3000,
        minimumPaymentCents: 100n,
      },
    ];
    const plan = simulateDebtPayoff(debts, ["a"], 0n, 24);
    expect(plan).toBeNull();
  });
});
