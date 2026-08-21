import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { BudgetForm, type BudgetFormValues } from "../components/BudgetForm";
import { BudgetList } from "../components/BudgetList";
import { MonthSelector } from "../components/MonthSelector";
import { useBudgets, useCreateBudget } from "../hooks/useBudget";
import { formatCents, getMonthName } from "../types";

export function BudgetsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const {
    data: budgets,
    isLoading,
    isError,
    refetch,
  } = useBudgets(year, month);
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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 page-enter">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1.5">
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
          onClick={() => setDialogOpen(true)}
          className="self-start sm:self-auto button-hover shadow-elevated"
        >
          New Budget
        </Button>
      </div>

      {/* Month navigator */}
      <MonthSelector
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* Summary strip */}
      {!isLoading && budgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4 slide-up">
          <div className="rounded-2xl bg-card border border-border px-5 py-4 shadow-subtle relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">
              Total Budgets
            </p>
            <p className="font-display text-3xl font-bold text-foreground tabular-nums">
              {budgets.length}
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border px-5 py-4 shadow-subtle relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">
              Combined Limit
            </p>
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
          isError={isError}
          onRetry={refetch}
          onAddBudget={() => setDialogOpen(true)}
        />
      </section>

      {/* Add Budget Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-md shadow-premium"
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
