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
import { Check, CheckCircle2, PiggyBank, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import {
  useContributeSavingsGoal,
  useCreateSavingsGoal,
  useDeleteSavingsGoal,
  useSavingsGoals,
} from "../hooks/useBudget";
import type { SavingsGoal } from "../types";
import { formatCents } from "../types";

const PRESET_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

// ─── New Goal Dialog ──────────────────────────────────────────────────────────

function NewGoalDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createGoal = useCreateSavingsGoal();
  const [name, setName] = useState("");
  const [targetStr, setTargetStr] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setTargetStr("");
    setTargetDate("");
    setColor(PRESET_COLORS[0]);
    setError("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const target = Number.parseFloat(targetStr);
    if (!name.trim()) {
      setError("Please give your goal a name.");
      return;
    }
    if (!targetStr || !Number.isFinite(target) || target <= 0) {
      setError("Please enter a valid target amount greater than N$0.00");
      return;
    }
    setError("");

    try {
      await createGoal.mutateAsync({
        name: name.trim(),
        targetCents: BigInt(Math.round(target * 100)),
        targetDate: targetDate || undefined,
        color,
      });
      toast.success("Savings goal created");
      handleClose(false);
    } catch {
      toast.error("Failed to create savings goal");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-premium backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            New Savings Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div>
            <Label
              htmlFor="goal-name"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Goal Name
            </Label>
            <Input
              id="goal-name"
              placeholder="e.g. New Laptop, Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-focus h-10 text-sm"
            />
          </div>

          <div>
            <Label
              htmlFor="goal-target"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Target Amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
                N$
              </span>
              <Input
                id="goal-target"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={targetStr}
                onChange={(e) => setTargetStr(e.target.value)}
                className="pl-9 input-focus h-10 font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="goal-date"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Target Date{" "}
              <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input-focus h-10 font-mono text-sm"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Color
            </Label>
            <div className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-spring relative flex items-center justify-center ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-foreground/60 scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                >
                  {color === c && (
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 button-hover"
              onClick={() => handleClose(false)}
              disabled={createGoal.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-hover shadow-elevated"
              disabled={createGoal.isPending}
            >
              {createGoal.isPending ? "Creating…" : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Contribute Dialog ────────────────────────────────────────────────────────

function ContributeDialog({
  goal,
  onClose,
}: { goal: SavingsGoal | null; onClose: () => void }) {
  const contribute = useContributeSavingsGoal();
  const [amountStr, setAmountStr] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    const amount = Number.parseFloat(amountStr);
    if (!amountStr || !Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than N$0.00");
      return;
    }
    setError("");
    try {
      await contribute.mutateAsync({
        id: goal.id,
        amountCents: BigInt(Math.round(amount * 100)),
      });
      toast.success(`Added to ${goal.name}`);
      setAmountStr("");
      onClose();
    } catch {
      toast.error("Failed to add contribution");
    }
  }

  return (
    <Dialog
      open={!!goal}
      onOpenChange={(v) => {
        if (!v) {
          setAmountStr("");
          setError("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            Add to {goal?.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
              N$
            </span>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="pl-9 input-focus h-10 font-mono text-sm"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={contribute.isPending}
            >
              {contribute.isPending ? "Adding…" : "Add Contribution"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Goal Progress Bar ────────────────────────────────────────────────────────

function GoalProgressBar({ pct, color }: { pct: number; color: string }) {
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setMounted(true), 80);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="h-1.5 bg-muted/70 rounded-full overflow-hidden" aria-hidden>
      <div
        className="h-full rounded-full"
        style={{
          width: mounted ? `${Math.min(pct, 100)}%` : "0%",
          background: color,
          transition: "width 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  onContribute,
  onDelete,
}: {
  goal: SavingsGoal;
  onContribute: (goal: SavingsGoal) => void;
  onDelete: (goal: SavingsGoal) => void;
}) {
  const target = Number(goal.targetCents);
  const saved = Number(goal.savedCents);
  const pct = target > 0 ? (saved / target) * 100 : 0;
  const isComplete = !!goal.completedAt;

  return (
    <div className="relative bg-card border border-border/80 rounded-2xl overflow-hidden flex flex-col shadow-subtle hover:shadow-elevated transition-all duration-200">
      <div className="h-[3px] w-full" style={{ background: goal.color }} />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${goal.color}18` }}
          >
            <PiggyBank size={18} style={{ color: goal.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-foreground truncate">
              {goal.name}
            </h3>
            {goal.targetDate && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Target:{" "}
                {new Date(goal.targetDate).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          {isComplete && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold flex-shrink-0">
              <CheckCircle2 size={11} />
              Complete
            </div>
          )}
        </div>

        <div>
          <p className="font-display text-2xl font-bold tabular-nums text-foreground leading-none">
            {formatCents(goal.savedCents)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            of {formatCents(goal.targetCents)} target
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-display text-muted-foreground tabular-nums">
              {Math.min(pct, 100).toFixed(0)}%
            </span>
          </div>
          <GoalProgressBar pct={pct} color={goal.color} />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs rounded-lg"
            onClick={() => onContribute(goal)}
            disabled={isComplete}
          >
            <Plus size={13} className="mr-1" />
            Contribute
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-lg hover:text-destructive"
            onClick={() => onDelete(goal)}
            aria-label="Delete goal"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function SavingsGoalsPage() {
  const { data: goals = [], isLoading } = useSavingsGoals();
  const deleteGoal = useDeleteSavingsGoal();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributing, setContributing] = useState<SavingsGoal | null>(null);
  const [deleting, setDeleting] = useState<SavingsGoal | null>(null);

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteGoal.mutateAsync(deleting.id);
      toast.success("Savings goal deleted");
      setDeleting(null);
    } catch {
      toast.error("Failed to delete savings goal");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Savings Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Set targets and track progress toward what you're saving for
          </p>
        </div>
        <Button
          className="gap-1.5 h-9 rounded-xl text-xs shadow-elevated"
          onClick={() => setNewGoalOpen(true)}
        >
          <Plus size={14} />
          New Goal
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-elevated">
            <PiggyBank size={26} className="text-primary" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2 tracking-tight">
            No savings goals yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-7 leading-relaxed">
            Create a goal for something you're saving toward - a laptop, an
            emergency fund, a trip - and track your progress over time.
          </p>
          <Button
            className="gap-2 rounded-xl h-10 shadow-elevated"
            onClick={() => setNewGoalOpen(true)}
          >
            <Plus size={15} />
            New Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={setContributing}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <NewGoalDialog open={newGoalOpen} onOpenChange={setNewGoalOpen} />
      <ContributeDialog
        goal={contributing}
        onClose={() => setContributing(null)}
      />
      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this savings goal?"
        description={`This will permanently remove "${deleting?.name}" and its progress.`}
        onConfirm={handleDelete}
        isPending={deleteGoal.isPending}
      />
    </div>
  );
}
