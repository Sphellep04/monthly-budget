import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useBulkCreateExpenses } from "../hooks/useBudget";
import {
  type CsvParseResult,
  type DateFormat,
  parseExpensesCsv,
} from "../lib/csvImport";
import { parseExpensesOfx } from "../lib/ofxImport";
import { formatCents, getMonthName } from "../types";

function isOfxFile(fileName: string): boolean {
  return /\.(ofx|qfx)$/i.test(fileName);
}

interface Props {
  budgetId: bigint;
  year: number;
  month: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportExpensesDialog({
  budgetId,
  year,
  month,
  open,
  onOpenChange,
}: Props) {
  const bulkCreate = useBulkCreateExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [dateFormat, setDateFormat] = useState<DateFormat>("day-first");
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);

  const outOfRangeCount = useMemo(() => {
    if (!parseResult) return 0;
    const target = `${year}-${String(month).padStart(2, "0")}`;
    return parseResult.rows.filter((row) => !row.date.startsWith(target))
      .length;
  }, [parseResult, year, month]);

  function reset() {
    setFileName("");
    setFileText("");
    setDateFormat("day-first");
    setParseResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setFileText(text);
    setParseResult(
      isOfxFile(file.name)
        ? parseExpensesOfx(text)
        : parseExpensesCsv(text, dateFormat),
    );
  }

  function handleDateFormatChange(next: DateFormat) {
    setDateFormat(next);
    if (fileText) setParseResult(parseExpensesCsv(fileText, next));
  }

  async function handleImport() {
    if (!parseResult || parseResult.rows.length === 0) return;
    try {
      await bulkCreate.mutateAsync({ budgetId, rows: parseResult.rows });
      toast.success(
        `Imported ${parseResult.rows.length} expense${parseResult.rows.length !== 1 ? "s" : ""}`,
      );
      handleClose(false);
    } catch {
      toast.error("Failed to import expenses");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg shadow-premium">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            Import Expenses
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload a bank statement — CSV (with Date and Amount, or separate
            Debit/Credit columns) or OFX/QFX. A few header rows before the real
            column headers are handled automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {!parseResult ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors px-4 py-8 flex flex-col items-center gap-1.5"
            >
              <span className="text-sm font-medium text-foreground">
                Click to choose a statement file
              </span>
              <span className="text-xs text-muted-foreground">
                .csv, .ofx or .qfx — up to a few thousand rows
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground truncate">
                {fileName}
              </p>

              {!isOfxFile(fileName) && (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2">
                    <span className="text-xs font-medium text-foreground shrink-0">
                      Dates in this file are
                    </span>
                    <div className="flex gap-1.5">
                      {(
                        [
                          { value: "day-first", label: "Day/Month/Year" },
                          { value: "month-first", label: "Month/Day/Year" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleDateFormatChange(opt.value)}
                          className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors ${
                            dateFormat === opt.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground -mt-1.5">
                    Only affects ambiguous dates like 03/04/2026 — ISO dates
                    (2026-04-03) are always read correctly. Most Namibian and
                    southern African bank statements are Day/Month/Year.
                  </p>
                </>
              )}

              {parseResult.rows.length > 0 && (
                <div className="max-h-56 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                  {parseResult.rows.slice(0, 50).map((row, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static preview list, never reordered
                      key={i}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                    >
                      <span className="text-foreground truncate">
                        {row.date}
                        {row.notes ? ` · ${row.notes}` : ""}
                      </span>
                      <span className="font-mono text-muted-foreground shrink-0">
                        {formatCents(row.amountCents)}
                      </span>
                    </div>
                  ))}
                  {parseResult.rows.length > 50 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      + {parseResult.rows.length - 50} more
                    </p>
                  )}
                </div>
              )}

              {parseResult.errors.length > 0 && (
                <div className="max-h-24 overflow-y-auto rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 space-y-0.5">
                  {parseResult.errors.slice(0, 10).map((err) => (
                    <p key={err} className="text-xs text-destructive">
                      {err}
                    </p>
                  ))}
                  {parseResult.errors.length > 10 && (
                    <p className="text-xs text-destructive">
                      + {parseResult.errors.length - 10} more issues
                    </p>
                  )}
                </div>
              )}

              {outOfRangeCount > 0 && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    {outOfRangeCount} row{outOfRangeCount !== 1 ? "s" : ""}{" "}
                    {outOfRangeCount === 1 ? "has" : "have"} a date outside{" "}
                    {getMonthName(month)} {year}. They'll still be added to this
                    budget, but won't count toward that month's totals.
                  </p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                {parseResult.rows.length} expense
                {parseResult.rows.length !== 1 ? "s" : ""} ready to import
                {parseResult.errors.length > 0
                  ? `, ${parseResult.errors.length} row${parseResult.errors.length !== 1 ? "s" : ""} skipped`
                  : ""}
                .
              </p>

              <button
                type="button"
                onClick={reset}
                className="text-xs font-medium text-primary hover:underline"
              >
                Choose a different file
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.ofx,.qfx,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 button-hover"
            onClick={() => handleClose(false)}
            disabled={bulkCreate.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 button-hover shadow-elevated"
            onClick={handleImport}
            disabled={
              !parseResult ||
              parseResult.rows.length === 0 ||
              bulkCreate.isPending
            }
          >
            {bulkCreate.isPending
              ? "Importing…"
              : parseResult
                ? `Import ${parseResult.rows.length}`
                : "Import"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
