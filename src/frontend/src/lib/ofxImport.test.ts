import { describe, expect, it } from "vitest";
import { parseExpensesOfx } from "./ofxImport";

function ofxWith(transactions: string): string {
  return `
OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKTRANLIST>
${transactions}
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
`;
}

describe("parseExpensesOfx", () => {
  it("parses a negative-amount debit transaction as an expense", () => {
    const ofx = ofxWith(`
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260903120000
<TRNAMT>-150.00
<NAME>SHOPRITE WINDHOEK
</STMTTRN>
`);
    const result = parseExpensesOfx(ofx);
    expect(result.errors).toEqual([]);
    expect(result.rows).toEqual([
      { date: "2026-09-03", amountCents: 15000n, notes: "SHOPRITE WINDHOEK" },
    ]);
  });

  it("skips a positive-amount credit transaction as income, not an expense", () => {
    const ofx = ofxWith(`
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20260903
<TRNAMT>15000.00
<NAME>SALARY
</STMTTRN>
`);
    const result = parseExpensesOfx(ofx);
    expect(result.rows).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("parses multiple transactions in one file", () => {
    const ofx = ofxWith(`
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260901
<TRNAMT>-45.00
<NAME>ENGEN
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260902
<TRNAMT>-85.50
<NAME>SPAR
</STMTTRN>
`);
    const result = parseExpensesOfx(ofx);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0].amountCents).toBe(4500n);
    expect(result.rows[1].amountCents).toBe(8550n);
  });

  it("combines NAME and MEMO into the notes field", () => {
    const ofx = ofxWith(`
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20260903
<TRNAMT>-20.00
<NAME>SHOP
<MEMO>Card purchase
</STMTTRN>
`);
    const result = parseExpensesOfx(ofx);
    expect(result.rows[0].notes).toBe("SHOP - Card purchase");
  });

  it("returns an error for a file with no transactions", () => {
    const result = parseExpensesOfx("<OFX><BANKMSGSRSV1></BANKMSGSRSV1></OFX>");
    expect(result.rows).toEqual([]);
    expect(result.errors).toHaveLength(1);
  });
});
