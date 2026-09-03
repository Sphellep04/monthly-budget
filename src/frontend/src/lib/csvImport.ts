export interface ParsedExpenseRow {
  date: string;
  amountCents: bigint;
  notes?: string;
}

/**
 * Which field comes first in an ambiguous D/M/Y-style numeric date. Most
 * Namibian and southern African bank exports (FNB, Bank Windhoek, Standard
 * Bank, Nedbank) use day-first dates; some imported/US-formatted files use
 * month-first. There's no reliable way to detect this from the data alone
 * (03/04/2026 is valid either way), so the caller picks.
 */
export type DateFormat = "day-first" | "month-first";

export interface CsvParseResult {
  rows: ParsedExpenseRow[];
  errors: string[];
}

const DATE_COLUMN_NAMES = [
  "date",
  "transaction date",
  "posted date",
  "value date",
];
const AMOUNT_COLUMN_NAMES = ["amount", "amt", "value"];
// Bank exports often split money out/in into two columns instead of one
// signed "amount" - a row with a value in the debit column is an expense,
// one with only a credit value is income and gets skipped (not an error).
const DEBIT_COLUMN_NAMES = ["debit", "withdrawal", "money out", "paid out"];
const CREDIT_COLUMN_NAMES = ["credit", "deposit", "money in", "paid in"];
const NOTES_COLUMN_NAMES = [
  "notes",
  "note",
  "description",
  "memo",
  "payee",
  "details",
  "narrative",
];

/** Splits one CSV line into fields, honoring double-quoted fields with embedded commas/quotes. */
export function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Accepts ISO YYYY-MM-DD directly. Numeric D/M/Y-style dates (03/04/2026,
 * 03-04-2026) are ambiguous, so they're parsed explicitly according to
 * `dateFormat` rather than handed to the native Date constructor, which
 * always assumes US month/day/year ordering and would silently misfile a
 * day-first date into the wrong month. Everything else (e.g. "4 March
 * 2026") falls back to native parsing since it isn't ambiguous that way.
 */
function parseDate(raw: string, dateFormat: DateFormat): string | null {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const numeric = trimmed.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/);
  if (numeric) {
    const [, first, second, yearRaw] = numeric;
    const day = Number(dateFormat === "day-first" ? first : second);
    const month = Number(dateFormat === "day-first" ? second : first);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Accepts "12.50", "N$12.50", "$12.50", "1,234.56", "-12.50" (sign is dropped -- always an expense). */
function parseAmountCents(raw: string): bigint | null {
  const cleaned = raw.trim().replace(/[^0-9.\-]/g, "");
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  if (!Number.isFinite(n) || n === 0) return null;
  return BigInt(Math.round(Math.abs(n) * 100));
}

function findColumn(header: string[], candidates: string[]): number {
  const lower = header.map((h) => h.toLowerCase());
  for (const candidate of candidates) {
    const idx = lower.indexOf(candidate);
    if (idx !== -1) return idx;
  }
  return -1;
}

interface ColumnMap {
  dateIdx: number;
  amountIdx: number;
  debitIdx: number;
  creditIdx: number;
  notesIdx: number;
}

function findHeaderColumns(header: string[]): ColumnMap {
  return {
    dateIdx: findColumn(header, DATE_COLUMN_NAMES),
    amountIdx: findColumn(header, AMOUNT_COLUMN_NAMES),
    debitIdx: findColumn(header, DEBIT_COLUMN_NAMES),
    creditIdx: findColumn(header, CREDIT_COLUMN_NAMES),
    notesIdx: findColumn(header, NOTES_COLUMN_NAMES),
  };
}

function hasUsableColumns(cols: ColumnMap): boolean {
  const hasAmount = cols.amountIdx !== -1 || cols.debitIdx !== -1;
  return cols.dateIdx !== -1 && hasAmount;
}

const MAX_PREAMBLE_LINES = 15;

/**
 * Real bank exports often have a few metadata lines (account number,
 * statement period, an empty line) before the actual header row - scans
 * the first MAX_PREAMBLE_LINES lines for the first one that looks like a
 * real header (has a date column and an amount or debit column) and skips
 * everything before it. Returns null if no such row is found.
 */
function findHeaderRow(
  lines: string[],
): { index: number; columns: ColumnMap } | null {
  const searchLimit = Math.min(lines.length, MAX_PREAMBLE_LINES);
  for (let i = 0; i < searchLimit; i++) {
    const columns = findHeaderColumns(splitCsvLine(lines[i]));
    if (hasUsableColumns(columns)) {
      return { index: i, columns };
    }
  }
  return null;
}

/**
 * Parses a CSV with a header row into expense rows. Recognizes common column
 * name variants (Date/Transaction Date, Amount, Debit/Credit,
 * Notes/Description/Memo) in any order/casing, and skips a handful of
 * preamble rows before the real header if the file has them (account
 * number, statement period, etc. - common in real bank exports). A row with
 * only a credit/deposit value is income, not an expense, and is skipped
 * without being reported as an error. `dateFormat` (default "day-first")
 * controls how ambiguous numeric dates like 03/04/2026 are read - see
 * parseDate above.
 */
export function parseExpensesCsv(
  csvText: string,
  dateFormat: DateFormat = "day-first",
): CsvParseResult {
  const lines = csvText
    .split(/\r\n|\r|\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: ["The file is empty."] };
  }

  const header = findHeaderRow(lines);
  if (!header) {
    return {
      rows: [],
      errors: [
        'Could not find a "Date" and "Amount" (or "Debit") column in the first 15 rows.',
      ],
    };
  }
  const { dateIdx, amountIdx, debitIdx, creditIdx, notesIdx } = header.columns;

  const rows: ParsedExpenseRow[] = [];
  const errors: string[] = [];

  for (let i = header.index + 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const fields = splitCsvLine(lines[i]);

    const dateRaw = fields[dateIdx];
    // Prefer a single combined amount column when present; otherwise fall
    // back to the debit/credit pair.
    const amountRaw = amountIdx !== -1 ? fields[amountIdx] : fields[debitIdx];
    const creditRaw = creditIdx !== -1 ? fields[creditIdx] : undefined;

    if (!dateRaw) {
      errors.push(`Row ${lineNumber}: missing date.`);
      continue;
    }

    if (!amountRaw?.trim()) {
      // Nothing in the debit column - a credit-only row is income, silently
      // skipped rather than reported as a broken row.
      if (creditRaw?.trim()) continue;
      errors.push(`Row ${lineNumber}: missing amount.`);
      continue;
    }

    const date = parseDate(dateRaw, dateFormat);
    if (!date) {
      errors.push(`Row ${lineNumber}: couldn't understand date "${dateRaw}".`);
      continue;
    }

    const amountCents = parseAmountCents(amountRaw);
    if (amountCents == null) {
      errors.push(
        `Row ${lineNumber}: couldn't understand amount "${amountRaw}".`,
      );
      continue;
    }

    const notes =
      notesIdx !== -1 ? fields[notesIdx]?.trim() || undefined : undefined;
    rows.push({ date, amountCents, notes });
  }

  return { rows, errors };
}
