import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { MonthSelector } from "../components/MonthSelector";
import { RecurringIncomeForm } from "../components/RecurringIncomeForm";
import { RecurringIncomeList } from "../components/RecurringIncomeList";
import {
  useCreateIncome,
  useDeleteIncome,
  useIncome,
  useRecurringIncomes,
  useUpdateIncome,
} from "../hooks/useBudget";
import type { Income } from "../types";
import { formatCents } from "../types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Income Form ──────────────────────────────────────────────────────────────

interface IncomeFormProps {
  editing: Income | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function IncomeForm({ editing, open, onOpenChange }: IncomeFormProps) {
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();
  const [source, setSource] = useState(editing?.source ?? "");
  const [amountStr, setAmountStr] = useState(
    editing ? String(Number(editing.amountCents) / 100) : "",
  );
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [amountError, setAmountError] = useState("");

  const isPending = createIncome.isPending || updateIncome.isPending;

  function reset() {
    setSource("");
    setAmountStr("");
    setDate(todayISO());
    setNotes("");
    setAmountError("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number.parseFloat(amountStr);
    if (!amountStr || !Number.isFinite(amount) || amount <= 0) {
      setAmountError("Please enter a valid amount greater than N$0.00");
      return;
    }
    setAmountError("");

    const amountCents = BigInt(Math.round(amount * 100));
    const input = {
      source: source.trim(),
      amountCents,
      date,
      notes: notes.trim() || undefined,
    };

    try {
      if (editing) {
        await updateIncome.mutateAsync({ id: editing.id, input });
        toast.success("Income updated");
      } else {
        await createIncome.mutateAsync(input);
        toast.success("Income added");
      }
      handleClose(false);
    } catch {
      toast.error("Failed to save income");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-premium backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {editing ? "Edit Income" : "Add Income"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div>
            <Label
              htmlFor="income-source"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Source
            </Label>
            <Input
              id="income-source"
              placeholder="e.g. Salary, Freelance, Gift"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              className="input-focus h-10 text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="income-amount"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
                N$
              </span>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className={`pl-9 input-focus h-10 font-mono text-sm ${amountError ? "border-destructive focus:border-destructive" : ""}`}
              />
            </div>
            {amountError && (
              <p className="text-xs text-destructive mt-1">{amountError}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="income-date"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Date
            </Label>
            <Input
              id="income-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-focus h-10 font-mono text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="income-notes"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Notes{" "}
              <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="income-notes"
              placeholder="e.g. April salary"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input-focus text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 button-hover"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-hover shadow-elevated"
              disabled={isPending}
            >
              {isPending ? "Saving…" : editing ? "Save Changes" : "Add Income"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Income Row ───────────────────────────────────────────────────────────────

function IncomeRow({
  income,
  onEdit,
  onDelete,
}: {
  income: Income;
  onEdit: (income: Income) => void;
  onDelete: (income: Income) => void;
}) {
  return (
    <div className="group flex items-center gap-3 bg-card border border-border rounded-2xl p-4 shadow-subtle hover:shadow-elevated transition-all duration-200">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate font-display">
          {income.source}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {new Date(income.date).toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {income.notes ? ` · ${income.notes}` : ""}
        </p>
      </div>
      <span className="font-bold text-sm font-display tabular-nums text-emerald-600 dark:text-emerald-400 flex-shrink-0">
        +{formatCents(income.amountCents)}
      </span>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs rounded-lg"
          onClick={() => onEdit(income)}
          aria-label="Edit income"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs rounded-lg hover:text-destructive"
          onClick={() => onDelete(income)}
          aria-label="Delete income"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function IncomePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [deleting, setDeleting] = useState<Income | null>(null);
  const [recurringFormOpen, setRecurringFormOpen] = useState(false);
  const [editingRecurringIncome, setEditingRecurringIncome] = useState<
    bigint | null
  >(null);

  const { data: income = [], isLoading } = useIncome(year, month);
  const deleteIncome = useDeleteIncome();
  const { data: recurringIncomes = [], isLoading: recurringLoading } =
    useRecurringIncomes();

  const total = income.reduce((sum, i) => sum + Number(i.amountCents), 0);

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteIncome.mutateAsync(deleting.id);
      toast.success("Income deleted");
      setDeleting(null);
    } catch {
      toast.error("Failed to delete income");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Income
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track salary and other income sources for the month
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <MonthSelector
            year={year}
            month={month}
            onChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
          <Button
            className="h-9 rounded-xl text-xs shadow-elevated"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Income
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-subtle">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
          Total Income
        </p>
        <p className="font-display text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatCents(BigInt(total))}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Recurring Income
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0 bg-secondary/8 text-secondary border-secondary/20"
            >
              Auto-monthly
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="button-hover"
            onClick={() => {
              setEditingRecurringIncome(null);
              setRecurringFormOpen(true);
            }}
          >
            Add
          </Button>
        </div>
        <RecurringIncomeList
          templates={recurringIncomes}
          isLoading={recurringLoading}
          onEdit={(incomeId) => {
            setEditingRecurringIncome(incomeId);
            setRecurringFormOpen(true);
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : income.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
          <h3 className="font-display font-bold text-lg text-foreground mb-2 tracking-tight">
            No income logged this month
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-7 leading-relaxed">
            Add your salary or other income sources to track real net savings
            (income minus expenses).
          </p>
          <Button
            className="rounded-xl h-10 shadow-elevated"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Income
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {income
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((entry) => (
              <IncomeRow
                key={entry.id.toString()}
                income={entry}
                onEdit={(i) => {
                  setEditing(i);
                  setFormOpen(true);
                }}
                onDelete={setDeleting}
              />
            ))}
        </div>
      )}

      <IncomeForm
        editing={editing}
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditing(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this income entry?"
        description={`This will permanently remove "${deleting?.source}" from your records.`}
        onConfirm={handleDelete}
        isPending={deleteIncome.isPending}
      />

      <RecurringIncomeForm
        incomeId={editingRecurringIncome}
        templates={recurringIncomes}
        open={recurringFormOpen}
        onOpenChange={(open) => {
          setRecurringFormOpen(open);
          if (!open) setEditingRecurringIncome(null);
        }}
      />
    </div>
  );
}
