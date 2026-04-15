import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
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
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
      <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-5 w-20 rounded-full" />
      <div className="ml-auto">
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="w-8 h-8 rounded-md" />
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

  async function handleDelete() {
    await deleteMutation.mutateAsync(budget.id);
    setConfirmOpen(false);
  }

  const categoryIcon = CATEGORY_ICONS[budget.category] ?? "📦";

  return (
    <>
      <div
        data-ocid={`budget.item.${index}`}
        className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-smooth"
      >
        {/* Color swatch */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm ring-2 ring-offset-2 ring-offset-card"
          style={{ backgroundColor: budget.color }}
          aria-hidden="true"
        />

        {/* Name */}
        <p className="font-display font-medium text-foreground min-w-0 truncate flex-1">
          {budget.name}
        </p>

        {/* Category badge */}
        <Badge
          variant="secondary"
          className="hidden sm:flex items-center gap-1.5 text-xs flex-shrink-0"
        >
          <span>{categoryIcon}</span>
          <span>{budget.category}</span>
        </Badge>

        {/* Limit */}
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-sm font-semibold text-foreground">
            {formatCents(budget.limitCents)}
          </p>
          <p className="text-xs text-muted-foreground">/ month</p>
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          data-ocid={`budget.delete_button.${index}`}
          onClick={() => setConfirmOpen(true)}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive transition-smooth"
          aria-label={`Delete ${budget.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete "${budget.name}"?`}
        description="This will permanently remove this budget and all associated data. This action cannot be undone."
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
      <div className="space-y-3" data-ocid="budget.loading_state">
        {[1, 2, 3].map((i) => (
          <BudgetRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div
        data-ocid="budget.empty_state"
        className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/20"
      >
        <div className="text-5xl mb-4">💰</div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-1">
          No budgets yet
        </h3>
        <p className="text-muted-foreground text-sm text-center mb-6 max-w-xs">
          Set up your first monthly budget to start tracking where your money
          goes.
        </p>
        <Button data-ocid="budget.empty_state_add_button" onClick={onAddBudget}>
          + Add Your First Budget
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="budget.list">
      {budgets.map((budget, i) => (
        <BudgetRow key={budget.id.toString()} budget={budget} index={i + 1} />
      ))}
    </div>
  );
}
