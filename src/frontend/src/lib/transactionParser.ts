const MONTHS: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

export interface ParsedTransaction {
  amountCents: bigint | null;
  /** ISO YYYY-MM-DD, or null if nothing recognizable was found (caller should default to today). */
  date: string | null;
  /** Best-guess merchant/description, for both display and category suggestion. */
  merchant: string | null;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Bank SMS/push notification text is free-form and varies by bank, so this
 * is a best-effort extraction, not a guaranteed-correct parse - the caller
 * must always show the result for the user to review and edit before
 * saving anything, never submit it automatically.
 */
export function parseTransactionText(raw: string): ParsedTransaction {
  const text = raw.replace(/\s+/g, " ").trim();

  const amountCents = extractAmountCents(text);
  const date = extractDate(text);
  const merchant = extractMerchant(text);

  return { amountCents, date, merchant };
}

function extractAmountCents(text: string): bigint | null {
  // Currency-prefixed amounts first (N$150.00, NAD 150.00, R150.00) - most
  // specific and least likely to grab a stray number like an account digit.
  const currencyMatch = text.match(
    /(?:N\$|NAD|R)\s?(\d{1,3}(?:[,.\s]\d{3})*(?:\.\d{2})?)/i,
  );
  if (currencyMatch) {
    return toCents(currencyMatch[1]);
  }

  // Fall back to a number near a transaction verb, e.g. "Amt: 150.00" or
  // "debited 150.00". Covers common banking-SMS vocabulary broadly rather
  // than one bank's exact wording, since templates vary bank to bank and
  // aren't publicly documented.
  const contextMatch = text.match(
    /(?:amt|amount|debit(?:ed)?|purchase|spent|paid|withdr(?:aw|ew|awal)|pos|swiped)\D{0,10}?(\d{1,3}(?:[,.\s]\d{3})*\.\d{2})/i,
  );
  if (contextMatch) {
    return toCents(contextMatch[1]);
  }

  return null;
}

function toCents(numStr: string): bigint | null {
  const cleaned = numStr.replace(/[,\s]/g, "");
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return BigInt(Math.round(n * 100));
}

function extractDate(text: string): string | null {
  // DD/MM/YYYY or DD-MM-YYYY or DD/MM/YY
  const numeric = text.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})\b/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const year = numeric[3].length === 2 ? `20${numeric[3]}` : numeric[3];
      return `${year}-${pad2(month)}-${pad2(day)}`;
    }
  }

  // "03 Sep" or "03 Sep 2026" (day-first, matching the region's convention).
  const worded = text.match(
    /\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{4})?\b/i,
  );
  if (worded) {
    const day = Number(worded[1]);
    const month = MONTHS[worded[2].toLowerCase()];
    const year = worded[3] ? Number(worded[3]) : new Date().getFullYear();
    if (day >= 1 && day <= 31) {
      return `${year}-${pad2(month)}-${pad2(day)}`;
    }
  }

  return null;
}

function extractMerchant(text: string): string | null {
  // "at MERCHANT" / "from MERCHANT", stopping before a trailing "on <date>",
  // "approved", balance info, or the end of the string.
  const atMatch = text.match(
    /\b(?:at|from)\s+([A-Z0-9][A-Z0-9 .&'-]{2,40}?)(?=\s+(?:on|approved|avail|bal|ref|\d{1,2}[/-])|[.,]|$)/i,
  );
  if (atMatch) {
    return atMatch[1].trim();
  }
  return null;
}
