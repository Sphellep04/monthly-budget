import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useAddExpense } from "../hooks/useBudget";

interface ExpenseFormProps {
  budgetId: bigint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({
  budgetId,
  open,
  onOpenChange,
}: ExpenseFormProps) {
  const addExpense = useAddExpense();
  const [date, setDate] = useState(todayISO());
  const [amountStr, setAmountStr] = useState("");
  const [notes, setNotes] = useState("");
  const [amountError, setAmountError] = useState("");

  function reset() {
    setDate(todayISO());
    setAmountStr("");
    setNotes("");
    setAmountError("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function validateAmount(val: string) {
    const n = Number.parseFloat(val);
    if (!val || !Number.isFinite(n) || n <= 0) {
      setAmountError("Please enter a valid amount greater than $0.00");
      return false;
    }
    setAmountError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAmount(amountStr)) return;

    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));

    try {
      await addExpense.mutateAsync({
        budgetId,
        date,
        amountCents,
        notes: notes.trim() || undefined,
      });
      toast.success("Expense added");
      handleClose(false);
    } catch {
      toast.error("Failed to add expense");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-card border-border"
        data-ocid="expense_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-foreground">
            Add Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-date" className="text-sm text-foreground">
              Date
            </Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-input border-border font-mono text-sm"
              data-ocid="expense_form.date.input"
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-amount" className="text-sm text-foreground">
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none">
                $
              </span>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                onBlur={() => validateAmount(amountStr)}
                className="pl-7 bg-input border-border font-mono text-sm"
                data-ocid="expense_form.amount.input"
              />
            </div>
            {amountError && (
              <p
                className="text-xs text-destructive"
                data-ocid="expense_form.amount.field_error"
              >
                {amountError}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="expense-notes" className="text-sm text-foreground">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="expense-notes"
              placeholder="e.g. Weekly grocery run"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-input border-border text-sm resize-none"
              data-ocid="expense_form.notes.textarea"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={() => handleClose(false)}
              data-ocid="expense_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={addExpense.isPending}
              data-ocid="expense_form.submit_button"
            >
              {addExpense.isPending ? "Saving…" : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
