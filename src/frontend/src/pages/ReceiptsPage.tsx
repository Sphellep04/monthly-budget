import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAllBudgets, useReceiptGallery } from "../hooks/useBudget";
import type { Expense } from "../types";
import { formatCents } from "../types";

function ReceiptThumbnail({
  expense,
  budgetName,
  onClick,
}: {
  expense: Expense;
  budgetName: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden border border-border bg-muted/20 aspect-square shadow-subtle hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5"
    >
      <img
        src={expense.receiptUrl}
        alt={`Receipt for ${budgetName}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-2.5 text-left">
        <p className="text-[11px] font-semibold text-white truncate">
          {formatCents(expense.amountCents)}
        </p>
        <p className="text-[10px] text-white/75 truncate">{budgetName}</p>
      </div>
    </button>
  );
}

function ReceiptDetailDialog({
  expense,
  budgetName,
  onClose,
}: {
  expense: Expense | null;
  budgetName: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!expense} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-premium backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Receipt Detail
          </DialogTitle>
        </DialogHeader>
        {expense && (
          <div className="space-y-4 pt-1">
            <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
              <img
                src={expense.receiptUrl}
                alt={`Receipt for ${budgetName}`}
                className="w-full max-h-80 object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Amount
                </p>
                <p className="font-display font-bold text-foreground tabular-nums">
                  {formatCents(expense.amountCents)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Date
                </p>
                <p className="font-medium text-foreground">
                  {new Date(expense.date).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Budget
                </p>
                <p className="font-medium text-foreground">{budgetName}</p>
              </div>
              {expense.notes && (
                <div className="col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-foreground">{expense.notes}</p>
                </div>
              )}
            </div>
            <Link
              to="/budgets/$id"
              params={{ id: expense.budgetId.toString() }}
              className="flex items-center justify-center h-10 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              Go to Budget
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ReceiptsPage() {
  const { data: receipts = [], isLoading: receiptsLoading } =
    useReceiptGallery();
  const { data: budgets = [], isLoading: budgetsLoading } = useAllBudgets();
  const [selected, setSelected] = useState<Expense | null>(null);

  const isLoading = receiptsLoading || budgetsLoading;
  const budgetNameFor = (budgetId: bigint) =>
    budgets.find((b) => b.id === budgetId)?.name ?? "Unknown Budget";

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
          Receipts
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Every receipt photo you've attached to an expense, in one place
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
            <Skeleton key={k} className="aspect-square rounded-2xl" />
          ))}
        </div>
      ) : receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
          <h3 className="font-display font-bold text-lg text-foreground mb-2 tracking-tight">
            No receipts yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Attach a receipt photo (or scan one with the camera) when adding an
            expense, and it'll show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {receipts.map((expense) => (
            <ReceiptThumbnail
              key={expense.id.toString()}
              expense={expense}
              budgetName={budgetNameFor(expense.budgetId)}
              onClick={() => setSelected(expense)}
            />
          ))}
        </div>
      )}

      <ReceiptDetailDialog
        expense={selected}
        budgetName={selected ? budgetNameFor(selected.budgetId) : ""}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
