import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Trash2 } from "lucide-react";
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

export function ExpenseList({
  expenses,
  isLoading,
  onAddFirst,
}: ExpenseListProps) {
  const deleteExpense = useDeleteExpense();

  async function handleDelete(id: bigint, idx: number) {
    try {
      await deleteExpense.mutateAsync(id);
      toast.success("Expense removed");
    } catch {
      toast.error("Failed to delete expense");
    }
    void idx;
  }

  const totalCents = expenses.reduce(
    (sum, e) => sum + e.amountCents,
    BigInt(0),
  );

  if (isLoading) {
    return (
      <div className="space-y-2" data-ocid="expense_list.loading_state">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center gap-4"
        data-ocid="expense_list.empty_state"
      >
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <Receipt className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-foreground font-medium mb-1">No expenses yet</p>
          <p className="text-sm text-muted-foreground">
            Track your first expense to start monitoring this budget.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddFirst}
          className="border-border mt-1"
          data-ocid="expense_list.add_first_button"
        >
          Add First Expense
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0" data-ocid="expense_list.list">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Date &amp; Notes</span>
        <span className="text-right">Amount</span>
        <span className="w-8" />
      </div>

      {/* Expense rows */}
      <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
        {expenses.map((expense, idx) => (
          <div
            key={expense.id.toString()}
            className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-3.5 bg-card hover:bg-muted/40 transition-smooth"
            data-ocid={`expense_list.item.${idx + 1}`}
          >
            {/* Date + notes */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground font-mono leading-tight">
                {formatDate(expense.date)}
              </p>
              {expense.notes && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {expense.notes}
                </p>
              )}
            </div>

            {/* Amount */}
            <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
              {formatCents(expense.amountCents)}
            </span>

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              onClick={() => handleDelete(expense.id, idx)}
              disabled={deleteExpense.isPending}
              aria-label="Delete expense"
              data-ocid={`expense_list.delete_button.${idx + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      {/* Running subtotal */}
      <div
        className="flex items-center justify-between px-3 pt-4 border-t border-border mt-1"
        data-ocid="expense_list.subtotal"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Total ({expenses.length} expense{expenses.length !== 1 ? "s" : ""})
        </span>
        <span className="font-mono text-base font-bold text-foreground tabular-nums">
          {formatCents(totalCents)}
        </span>
      </div>
    </div>
  );
}
