import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ImageIcon, Receipt, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteExpense } from "../hooks/useBudget";
import { formatCents } from "../types";
import type { Expense } from "../types";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onAddFirst: () => void;
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert a base64 data URL to a Blob URL so browsers will open it in a new tab */
function openReceiptInTab(dataUrl: string) {
  try {
    const [header, b64] = dataUrl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, "_blank", "noopener,noreferrer");
    // Revoke after a short delay to allow the tab to load
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    if (!win) {
      toast.error("Popup blocked — please allow popups for this site.");
    }
  } catch {
    toast.error("Could not open receipt.");
  }
}

/** Small receipt badge button for expense rows */
function ReceiptBadge({ url }: { url: string }) {
  return (
    <button
      type="button"
      onClick={() => openReceiptInTab(url)}
      title="View receipt"
      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/8 border border-primary/20 text-primary hover:bg-primary/15 transition-colors text-[10px] font-medium shrink-0"
    >
      <ImageIcon className="w-3 h-3" />
      <span>Receipt</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
    </button>
  );
}

export function ExpenseList({
  expenses,
  isLoading,
  onAddFirst,
}: ExpenseListProps) {
  const deleteExpense = useDeleteExpense();

  async function handleDelete(id: bigint) {
    try {
      await deleteExpense.mutateAsync(id);
      toast.success("Expense removed");
    } catch {
      toast.error("Failed to delete expense");
    }
  }

  const totalCents = expenses.reduce(
    (sum, e) => sum + e.amountCents,
    BigInt(0),
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20">
        <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-subtle flex items-center justify-center">
          <Receipt className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-sm mb-0.5">
            No expenses yet
          </p>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Track your first expense to start monitoring this budget.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddFirst}
          className="mt-1 button-hover text-xs"
        >
          Add First Expense
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        <span>Date &amp; Notes</span>
        <span className="text-right pr-1">Amount</span>
        <span className="w-8" />
      </div>

      {/* Rows */}
      <div className="rounded-2xl border border-border overflow-hidden shadow-subtle bg-card divide-y divide-border">
        {expenses.map((expense, _idx) => (
          <div
            key={expense.id.toString()}
            className="group grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3.5 hover:bg-muted/30 transition-colors-fast"
          >
            {/* Date + notes + receipt badge */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground font-mono leading-tight tabular-nums">
                {formatDate(expense.date)}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {expense.notes && (
                  <p className="text-xs text-muted-foreground truncate">
                    {expense.notes}
                  </p>
                )}
                {expense.receiptUrl && (
                  <ReceiptBadge url={expense.receiptUrl} />
                )}
              </div>
            </div>

            {/* Amount */}
            <span className="font-mono text-sm font-bold text-foreground tabular-nums pr-1">
              {formatCents(expense.amountCents)}
            </span>

            {/* Delete — icon only, appears on hover */}
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-smooth rounded-lg"
              onClick={() => handleDelete(expense.id)}
              disabled={deleteExpense.isPending}
              aria-label="Delete expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs font-medium text-muted-foreground">
          {expenses.length} expense{expenses.length !== 1 ? "s" : ""} total
        </span>
        <span className="font-mono text-sm font-bold text-foreground tabular-nums">
          {formatCents(totalCents)}
        </span>
      </div>
    </div>
  );
}
