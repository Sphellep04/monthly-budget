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
});
