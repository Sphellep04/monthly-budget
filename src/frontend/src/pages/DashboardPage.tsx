import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Download,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import { BudgetCard } from "../components/BudgetCard";
import { MonthSelector } from "../components/MonthSelector";
import { MonthlySummaryHeader } from "../components/MonthlySummaryHeader";
import { useMonthlySummary } from "../hooks/useBudget";
import type { Expense } from "../types";
import { getMonthName } from "../types";

function BudgetGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
        <Skeleton key={k} className="h-36 rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border bg-card/50"
      data-ocid="dashboard.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
        <LayoutDashboard className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-2">
        No budgets yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 font-body leading-relaxed">
        Start tracking your spending by creating your first budget category for
        this month.
      </p>
      <Link to="/budgets">
        <Button
          className="gap-2 font-body"
          data-ocid="dashboard.create_budget_button"
        >
          <PlusCircle className="h-4 w-4" />
          Create your first budget
        </Button>
      </Link>
    </div>
  );
}

/** Exports summary + expense structure as CSV */
function ExportCsvButton({
  year,
  month,
  summary,
}: {
  year: number;
  month: number;
  summary: ReturnType<typeof useMonthlySummary>["data"];
}) {
  const [isExporting, setIsExporting] = useState(false);
  const { actor } = useActor(createActor);

  const handleExport = async () => {
    if (!summary || !actor) return;
    setIsExporting(true);
    try {
      const monthName = getMonthName(month).toLowerCase();
      const filename = `budget-${monthName}-${year}.csv`;
      const lines: string[] = [];

      // Summary section
      lines.push("=== BUDGET SUMMARY ===");
      lines.push("Category,Budget Limit,Amount Spent,Remaining,% Used");
      for (const bs of summary.budgets) {
        const limit = Number(bs.budget.limitCents) / 100;
        const spent = Number(bs.totalSpentCents) / 100;
        const remaining = Number(bs.remainingCents) / 100;
        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        lines.push(
          `"${bs.budget.name}",${limit.toFixed(2)},${spent.toFixed(2)},${remaining.toFixed(2)},${pct}%`,
        );
      }
      const totalLimit = Number(summary.totalBudgetCents) / 100;
      const totalSpent = Number(summary.totalSpentCents) / 100;
      const totalPct =
        totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;
      lines.push(
        `"TOTAL",${totalLimit.toFixed(2)},${totalSpent.toFixed(2)},${(totalLimit - totalSpent).toFixed(2)},${totalPct}%`,
      );
      lines.push("");

      // Fetch all expenses for each budget and filter to selected month
      lines.push("=== DETAILED EXPENSES ===");
      lines.push("Date,Category,Amount,Notes");

      const monthPad = String(month).padStart(2, "0");
      const monthPrefix = `${year}-${monthPad}`;

      for (const bs of summary.budgets) {
        const rawExpenses = await actor.listExpenses(bs.budget.id);
        const expenses = (rawExpenses as unknown as Expense[]).filter((e) =>
          e.date.startsWith(monthPrefix),
        );

        lines.push(`"--- ${bs.budget.name} ---","","",""`);
        if (expenses.length === 0) {
          lines.push(`"(no expenses)","","",""`);
        } else {
          for (const expense of expenses.sort((a, b) =>
            a.date.localeCompare(b.date),
          )) {
            const amount = Number(expense.amountCents) / 100;
            const notes = expense.notes
              ? `"${expense.notes.replace(/"/g, '""')}"`
              : "";
            lines.push(
              `"${expense.date}","${bs.budget.name}",${amount.toFixed(2)},${notes}`,
            );
          }
        }
      }

      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 transition-smooth font-body"
      onClick={handleExport}
      disabled={!summary || !actor || isExporting}
      data-ocid="dashboard.export_csv_button"
    >
      <Download className="h-4 w-4" />
      {isExporting ? "Exporting…" : "Export CSV"}
    </Button>
  );
}

export function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: summary, isLoading } = useMonthlySummary(year, month);
  const budgets = summary?.budgets ?? [];
  const hasBudgets = budgets.length > 0;

  return (
    <div
      className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto"
      data-ocid="dashboard.page"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 md:pt-0">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-body">
            {getMonthName(month)} {year} overview
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
          <ExportCsvButton year={year} month={month} summary={summary} />
          <Link to="/budgets">
            <Button
              size="sm"
              className="gap-1.5 transition-smooth font-body"
              data-ocid="dashboard.add_budget_button"
            >
              <PlusCircle className="h-4 w-4" />
              New Budget
            </Button>
          </Link>
        </div>
      </div>

      {/* Monthly summary header */}
      <MonthlySummaryHeader summary={summary} isLoading={isLoading} />

      {/* Budget grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-semibold text-foreground">
            Budget Categories
          </h2>
          {hasBudgets && (
            <Link
              to="/budgets"
              className="text-xs text-primary hover:underline flex items-center gap-1 transition-smooth"
              data-ocid="dashboard.view_all_link"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <BudgetGridSkeleton />
        ) : hasBudgets ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="dashboard.budget_list"
          >
            {budgets.map((bs, i) => (
              <BudgetCard
                key={bs.budget.id.toString()}
                summary={bs}
                index={i + 1}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
