export interface ParsedExpenseRow {
  date: string;
  amountCents: bigint;
  notes?: string;
}

export interface CsvParseResult {
  rows: ParsedExpenseRow[];
  errors: string[];
}

const DATE_COLUMN_NAMES = ["date", "transaction date", "posted date"];
const AMOUNT_COLUMN_NAMES = ["amount", "amt", "value", "debit"];
const NOTES_COLUMN_NAMES = [
  "notes",
  "note",
  "description",
  "memo",
  "payee",
  "details",
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

/** Accepts ISO YYYY-MM-DD directly, otherwise falls back to native Date parsing. */
function parseDate(raw: string): string | null {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
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

/**
 * Parses a CSV with a header row into expense rows. Recognizes common column
 * name variants (Date/Transaction Date, Amount/Debit, Notes/Description/Memo)
 * in any order/casing. Amount sign is ignored -- every row becomes an expense.
 */
export function parseExpensesCsv(csvText: string): CsvParseResult {
  const lines = csvText
    .split(/\r\n|\r|\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: ["The file is empty."] };
  }

  const header = splitCsvLine(lines[0]);
  const dateIdx = findColumn(header, DATE_COLUMN_NAMES);
  const amountIdx = findColumn(header, AMOUNT_COLUMN_NAMES);
  const notesIdx = findColumn(header, NOTES_COLUMN_NAMES);

  if (dateIdx === -1 || amountIdx === -1) {
    return {
      rows: [],
      errors: [
        'Could not find a "Date" and "Amount" column in the header row.',
      ],
    };
  }

  const rows: ParsedExpenseRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const fields = splitCsvLine(lines[i]);

    const dateRaw = fields[dateIdx];
    const amountRaw = fields[amountIdx];
    if (!dateRaw || !amountRaw) {
      errors.push(`Row ${lineNumber}: missing date or amount.`);
      continue;
    }

    const date = parseDate(dateRaw);
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
