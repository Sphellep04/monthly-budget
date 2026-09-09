import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { useGetExpensesInRange } from "../hooks/useBudget";
import type { BudgetSummary } from "../types";
import { UNPLANNED_CATEGORY, formatCents } from "../types";

const VISIBLE_COUNT = 6;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatRelativeDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export function RecentTransactions({
  year,
  month,
  budgets,
}: {
  year: number;
  month: number;
  budgets: BudgetSummary[];
}) {
  const startDate = `${year}-${pad2(month)}-01`;
  const daysInMonth = new Date(year, month, 0).getDate();
  const endDate = `${year}-${pad2(month)}-${pad2(daysInMonth)}`;
  const { data: expenses, isLoading } = useGetExpensesInRange(
    startDate,
    endDate,
  );

  const budgetById = useMemo(
    () => new Map(budgets.map((bs) => [bs.budget.id, bs.budget])),
    [budgets],
  );

  const recent = useMemo(() => {
    if (!expenses) return [];
    return [...expenses]
      .sort((a, b) => {
        const byDate = b.date.localeCompare(a.date);
        return byDate !== 0 ? byDate : Number(b.createdAt - a.createdAt);
      })
      .slice(0, VISIBLE_COUNT);
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((k) => (
          <Skeleton key={k} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (recent.length === 0) return null;

  return (
    <div className="space-y-2">
      {recent.map((expense) => {
        const budget = budgetById.get(expense.budgetId);
        const isUnplanned = budget?.category === UNPLANNED_CATEGORY;
        return (
          <div
            key={expense.id.toString()}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-subtle"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {expense.notes?.trim() || budget?.name || "Expense"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                {isUnplanned ? (
                  <span className="px-1.5 py-0 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-[11px] font-medium">
                    Unplanned
                  </span>
                ) : (
                  budget?.category
                )}
                <span>· {formatRelativeDate(expense.date)}</span>
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-foreground tabular-nums flex-shrink-0">
              -{formatCents(expense.amountCents)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
