import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, PiggyBank, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteBudget } from "../hooks/useBudget";
import type { Budget } from "../types";
import { CATEGORY_ICONS, formatCents } from "../types";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface BudgetListProps {
  budgets: Budget[];
  isLoading: boolean;
  onAddBudget: () => void;
}

function BudgetRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-subtle">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-20 rounded-full hidden sm:block" />
      <div className="text-right">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-12 ml-auto" />
      </div>
      <Skeleton className="w-8 h-8 rounded-lg" />
    </div>
  );
}

interface BudgetRowProps {
  budget: Budget;
  index: number;
}

function BudgetRow({ budget, index }: BudgetRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const deleteMutation = useDeleteBudget();
  const categoryIcon = CATEGORY_ICONS[budget.category] ?? "📦";

  async function handleDelete() {
    await deleteMutation.mutateAsync(budget.id);
    setConfirmOpen(false);
  }

  return (
    <>
      <div
        className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card card-hover hover:border-primary/20 hover:shadow-elevated"
      >
        {/* Icon + color dot */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-subtle"
          style={{ backgroundColor: `${budget.color}20` }}
        >
          {categoryIcon}
        </div>

        {/* Name + subline */}
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-foreground truncate text-sm leading-tight">
            {budget.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: budget.color }}
              aria-hidden="true"
            />
            <span className="text-xs text-muted-foreground">
              {budget.category}
            </span>
          </div>
        </div>

        {/* Category badge */}
        <Badge
          variant="secondary"
          className="hidden sm:flex items-center gap-1.5 text-[11px] flex-shrink-0 font-medium"
        >
          <span>{categoryIcon}</span>
          <span>{budget.category}</span>
        </Badge>

        {/* Limit */}
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-sm font-bold text-foreground tabular-nums">
            {formatCents(budget.limitCents)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            / month
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link to="/budgets/$id" params={{ id: budget.id.toString() }}>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-smooth text-muted-foreground hover:text-primary"
              aria-label={`View ${budget.name}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmOpen(true)}
            className="w-8 h-8 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-smooth text-muted-foreground hover:text-destructive hover:bg-destructive/8"
            aria-label={`Delete ${budget.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete "${budget.name}"?`}
        description="This will permanently remove this budget and all associated expenses. This action cannot be undone."
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}

export function BudgetList({
  budgets,
  isLoading,
  onAddBudget,
}: BudgetListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <BudgetRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border border-dashed border-border bg-card/40 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-5 shadow-subtle">
          <PiggyBank className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">
          No budgets yet
        </h3>
        <p className="text-muted-foreground text-sm text-center mb-7 max-w-xs leading-relaxed">
          Set up your first monthly budget to start tracking where your money
          goes — and stay in control.
        </p>
        <Button
          onClick={onAddBudget}
          className="gap-2 button-hover shadow-elevated"
        >
          <span>Create Your First Budget</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget, i) => (
        <BudgetRow key={budget.id.toString()} budget={budget} index={i + 1} />
      ))}
    </div>
  );
}
