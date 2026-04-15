import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Plus,
  Wallet,
} from "lucide-react";
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
    } else setMonth((m) => m - 1);
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
    } else setMonth((m) => m + 1);
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
      toast.success("Budget created", {
        description: `"${values.name}" is ready.`,
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
      className="max-w-3xl mx-auto px-4 py-8 space-y-8 page-enter"
      data-ocid="budgets.page"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" />
            Monthly Tracker
          </p>
          <h1 className="font-display text-4xl font-bold text-foreground tracking-tight leading-none">
            Budgets
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Manage your spending limits for {getMonthName(month)} {year}
          </p>
        </div>
        <Button
          data-ocid="budgets.add_button"
          onClick={() => setDialogOpen(true)}
          className="gap-2 self-start sm:self-auto button-hover shadow-elevated"
        >
          <Plus className="w-4 h-4" />
          New Budget
        </Button>
      </div>

      {/* Month navigator */}
      <div
        data-ocid="budgets.month_nav"
        className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border shadow-subtle"
      >
        <Button
          variant="ghost"
          size="icon"
          data-ocid="budgets.month_prev"
          onClick={prev}
          aria-label="Previous month"
          className="h-9 w-9 rounded-xl hover:bg-muted transition-colors-fast"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <p className="font-display font-semibold text-foreground text-lg leading-tight">
            {getMonthName(month)} {year}
          </p>
          {isCurrent && (
            <Badge
              variant="secondary"
              className="text-[10px] mt-1 px-2 py-0 bg-primary/10 text-primary border-primary/20"
            >
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
          className="h-9 w-9 rounded-xl hover:bg-muted transition-colors-fast disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Summary strip */}
      {!isLoading && budgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4 slide-up">
          <div className="rounded-2xl bg-card border border-border px-5 py-4 shadow-subtle relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                Total Budgets
              </p>
            </div>
            <p className="font-display text-3xl font-bold text-foreground tabular-nums">
              {budgets.length}
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border px-5 py-4 shadow-subtle relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-3.5 h-3.5 text-secondary" />
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
                Combined Limit
              </p>
            </div>
            <p className="font-display text-3xl font-bold text-foreground tabular-nums">
              {formatCents(totalLimit)}
            </p>
          </div>
        </div>
      )}

      {/* Budget list */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {getMonthName(month)} Budgets
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>
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
          className="max-w-md shadow-premium backdrop-blur-md"
          onInteractOutside={(e) => {
            if (createBudget.isPending) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              New Budget
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Create a spending limit for {getMonthName(month)} {year}.
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
