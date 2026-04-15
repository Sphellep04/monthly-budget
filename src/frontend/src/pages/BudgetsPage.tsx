import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BudgetForm, type BudgetFormValues } from "../components/BudgetForm";
import { BudgetList } from "../components/BudgetList";
import { useBudgets, useCreateBudget } from "../hooks/useBudget";
import { formatCents, getMonthName } from "../types";

function useMonthNav() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  function prev() {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function next() {
    const isCurrent =
      year === now.getFullYear() && month === now.getMonth() + 1;
    const isFuture =
      year > now.getFullYear() ||
      (year === now.getFullYear() && month > now.getMonth() + 1);
    if (isCurrent || isFuture) return;
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const isCurrent = year === now.getFullYear() && month === now.getMonth() + 1;

  return { year, month, prev, next, isCurrent };
}

export function BudgetsPage() {
  const { year, month, prev, next, isCurrent } = useMonthNav();
  const { data: budgets, isLoading } = useBudgets(year, month);
  const createBudget = useCreateBudget();
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalLimit = budgets.reduce((acc, b) => acc + Number(b.limitCents), 0);

  async function handleAddBudget(values: BudgetFormValues) {
    try {
      await createBudget.mutateAsync({
        name: values.name,
        limitCents: values.limitCents,
        category: values.category,
        color: values.color,
        year: BigInt(year),
        month: BigInt(month),
      });
      toast.success("Budget added", {
        description: `"${values.name}" has been created.`,
      });
      setDialogOpen(false);
    } catch {
      toast.error("Failed to create budget", {
        description: "Please try again.",
      });
    }
  }

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      data-ocid="budgets.page"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Budgets
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your monthly spending limits
          </p>
        </div>
        <Button
          data-ocid="budgets.add_button"
          onClick={() => setDialogOpen(true)}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </Button>
      </div>

      {/* Month navigator */}
      <div
        data-ocid="budgets.month_nav"
        className="flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-subtle"
      >
        <Button
          variant="ghost"
          size="icon"
          data-ocid="budgets.month_prev"
          onClick={prev}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <p className="font-display font-semibold text-foreground">
            {getMonthName(month)} {year}
          </p>
          {isCurrent && (
            <Badge variant="secondary" className="text-xs mt-0.5">
              Current Month
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          data-ocid="budgets.month_next"
          onClick={next}
          disabled={isCurrent}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary strip */}
      {!isLoading && budgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/40 border border-border px-5 py-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total Budgets
            </p>
            <p className="font-display text-2xl font-bold text-foreground">
              {budgets.length}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 border border-border px-5 py-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Combined Limit
            </p>
            <p className="font-display text-2xl font-bold text-foreground">
              {formatCents(totalLimit)}
            </p>
          </div>
        </div>
      )}

      {/* Budget list */}
      <section>
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {getMonthName(month)} Budgets
        </h2>
        <BudgetList
          budgets={budgets}
          isLoading={isLoading}
          onAddBudget={() => setDialogOpen(true)}
        />
      </section>

      {/* Add Budget Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="budget.dialog"
          className="max-w-md"
          onInteractOutside={(e) => {
            if (createBudget.isPending) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Add Budget
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Create a new spending limit for {getMonthName(month)} {year}.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            onSubmit={handleAddBudget}
            onCancel={() => setDialogOpen(false)}
            isPending={createBudget.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
