import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBulkCreateExpenses } from "../hooks/useBudget";
import { type CsvParseResult, parseExpensesCsv } from "../lib/csvImport";
import { formatCents } from "../types";

interface Props {
  budgetId: bigint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportExpensesDialog({ budgetId, open, onOpenChange }: Props) {
  const bulkCreate = useBulkCreateExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);

  function reset() {
    setFileName("");
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
    setParseResult(parseExpensesCsv(text));
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
            Import Expenses from CSV
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Upload a CSV with Date and Amount columns (Notes/Description is
            optional) — a bank statement export works too.
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
                Click to choose a CSV file
              </span>
              <span className="text-xs text-muted-foreground">
                .csv up to a few thousand rows
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground truncate">
                {fileName}
              </p>

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
            accept=".csv,text/csv"
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
