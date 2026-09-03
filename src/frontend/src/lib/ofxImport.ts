import type { CsvParseResult, ParsedExpenseRow } from "./csvImport";

/**
 * Minimal OFX (Open Financial Exchange) parser, covering what bank exports
 * actually use: a flat list of <STMTTRN> blocks. OFX 1.x is SGML (tags
 * often unclosed), OFX 2.x is real XML - this reads both the same way by
 * treating each tag as "value up to the next '<'", which works for both
 * since neither nests text content inside a <STMTTRN>'s leaf tags.
 */
export function parseExpensesOfx(ofxText: string): CsvParseResult {
  const blocks = ofxText.match(
    /<STMTTRN>[\s\S]*?(?=<STMTTRN>|<\/BANKTRANLIST>|$)/gi,
  );

  if (!blocks || blocks.length === 0) {
    return {
      rows: [],
      errors: [
        "Couldn't find any transactions (<STMTTRN> entries) in this OFX file.",
      ],
    };
  }

  const rows: ParsedExpenseRow[] = [];
  const errors: string[] = [];

  blocks.forEach((block, i) => {
    const lineNumber = i + 1;
    const trnType = extractTag(block, "TRNTYPE");
    const amountRaw = extractTag(block, "TRNAMT");
    const dateRaw = extractTag(block, "DTPOSTED");
    const name = extractTag(block, "NAME");
    const memo = extractTag(block, "MEMO");

    if (amountRaw == null) {
      errors.push(`Transaction ${lineNumber}: missing amount.`);
      return;
    }
    const amount = Number.parseFloat(amountRaw);
    if (!Number.isFinite(amount) || amount === 0) {
      errors.push(
        `Transaction ${lineNumber}: couldn't understand amount "${amountRaw}".`,
      );
      return;
    }
    // OFX convention: negative TRNAMT is money out (an expense); positive is
    // money in. A CREDIT/DEP/DIRECTDEP type is income even if the sign is
    // ambiguous in a particular export, so skip those rather than guess.
    const isIncome =
      amount > 0 || /^(CREDIT|DEP|DIRECTDEP|INT)$/i.test(trnType ?? "");
    if (isIncome) return;

    if (dateRaw == null) {
      errors.push(`Transaction ${lineNumber}: missing date.`);
      return;
    }
    const date = parseOfxDate(dateRaw);
    if (!date) {
      errors.push(
        `Transaction ${lineNumber}: couldn't understand date "${dateRaw}".`,
      );
      return;
    }

    const notes = [name, memo].filter(Boolean).join(" - ") || undefined;
    rows.push({
      date,
      amountCents: BigInt(Math.round(Math.abs(amount) * 100)),
      notes,
    });
  });

  return { rows, errors };
}

function extractTag(block: string, tag: string): string | null {
  const match = block.match(new RegExp(`<${tag}>\\s*([^\\r\\n<]+)`, "i"));
  return match ? match[1].trim() : null;
}

/** OFX dates are YYYYMMDD or YYYYMMDDHHMMSS[.sss][timezone] - always unambiguous, unlike CSV. */
function parseOfxDate(raw: string): string | null {
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  const m = Number(month);
  const d = Number(day);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${year}-${month}-${day}`;
}
