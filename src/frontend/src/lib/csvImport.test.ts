import { describe, expect, it } from "vitest";
import { parseExpensesCsv, splitCsvLine } from "./csvImport";

describe("splitCsvLine", () => {
  it("splits plain comma-separated fields", () => {
    expect(splitCsvLine("2026-08-01,12.50,Groceries")).toEqual([
      "2026-08-01",
      "12.50",
      "Groceries",
    ]);
  });

  it("handles quoted fields with embedded commas", () => {
    expect(splitCsvLine('2026-08-01,12.50,"Shoprite, Windhoek"')).toEqual([
      "2026-08-01",
      "12.50",
      "Shoprite, Windhoek",
    ]);
  });

  it("handles escaped double quotes inside a quoted field", () => {
    expect(splitCsvLine('1,"She said ""hi""",3')).toEqual([
      "1",
      'She said "hi"',
      "3",
    ]);
  });
});

describe("parseExpensesCsv", () => {
  it("parses a well-formed CSV with a standard header", () => {
    const csv = [
      "Date,Amount,Notes",
      "2026-08-01,12.50,Groceries",
      "2026-08-03,45.00,Fuel",
    ].join("\n");

    const result = parseExpensesCsv(csv);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([
      { date: "2026-08-01", amountCents: 1250n, notes: "Groceries" },
      { date: "2026-08-03", amountCents: 4500n, notes: "Fuel" },
    ]);
  });

  it("recognizes bank-style column name variants in any order", () => {
    const csv = [
      "Description,Transaction Date,Debit",
      "Coffee shop,2026-08-05,4.75",
    ].join("\n");

    const result = parseExpensesCsv(csv);
    expect(result.rows).toEqual([
      { date: "2026-08-05", amountCents: 475n, notes: "Coffee shop" },
    ]);
  });

  it("strips currency symbols and takes the absolute value of negative amounts", () => {
    const csv = ["Date,Amount", "2026-08-01,N$-99.99"].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.rows[0].amountCents).toBe(9999n);
  });

  it("collects per-row errors without failing the whole file", () => {
    const csv = [
      "Date,Amount,Notes",
      "2026-08-01,12.50,Good row",
      "not-a-date,5.00,Bad date",
      "2026-08-02,not-a-number,Bad amount",
      "2026-08-03,,Missing amount",
    ].join("\n");

    const result = parseExpensesCsv(csv);
    expect(result.rows).toHaveLength(1);
    expect(result.errors).toHaveLength(3);
  });

  it("reports an error when required columns are missing", () => {
    const csv = ["Foo,Bar", "1,2"].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.rows).toEqual([]);
    expect(result.errors[0]).toMatch(/Date.*Amount/);
  });

  it("returns an error for an empty file", () => {
    const result = parseExpensesCsv("");
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual(["The file is empty."]);
  });

  it("reads ambiguous numeric dates as day-first by default", () => {
    const csv = ["Date,Amount", "03/04/2026,10.00"].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.rows[0].date).toBe("2026-04-03");
  });

  it("reads ambiguous numeric dates as month-first when requested", () => {
    const csv = ["Date,Amount", "03/04/2026,10.00"].join("\n");
    const result = parseExpensesCsv(csv, "month-first");
    expect(result.rows[0].date).toBe("2026-03-04");
  });

  it("handles dash-separated dates and 2-digit years under both formats", () => {
    const csv = ["Date,Amount", "03-04-26,10.00"].join("\n");
    expect(parseExpensesCsv(csv, "day-first").rows[0].date).toBe("2026-04-03");
    expect(parseExpensesCsv(csv, "month-first").rows[0].date).toBe(
      "2026-03-04",
    );
  });

  it("rejects numeric dates with an out-of-range month", () => {
    const csv = ["Date,Amount", "13/13/2026,10.00"].join("\n");
    const result = parseExpensesCsv(csv, "day-first");
    expect(result.rows).toEqual([]);
    expect(result.errors).toHaveLength(1);
  });

  it("skips preamble rows before the real header, like real bank exports have", () => {
    const csv = [
      "Account Number: 123456789",
      "Statement Period: 01 Aug 2026 - 31 Aug 2026",
      "",
      "Date,Amount,Description",
      "2026-08-01,12.50,Groceries",
    ].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([
      { date: "2026-08-01", amountCents: 1250n, notes: "Groceries" },
    ]);
  });

  it("reads separate Debit/Credit columns, treating a debit as an expense", () => {
    const csv = [
      "Date,Description,Debit,Credit",
      "2026-08-01,Shoprite,45.00,",
      "2026-08-02,Salary,,15000.00",
    ].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([
      { date: "2026-08-01", amountCents: 4500n, notes: "Shoprite" },
    ]);
  });

  it("silently skips a credit-only row rather than reporting it as an error", () => {
    const csv = [
      "Date,Description,Debit,Credit",
      "2026-08-02,Salary,,15000.00",
    ].join("\n");
    const result = parseExpensesCsv(csv);
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([]);
  });
});
