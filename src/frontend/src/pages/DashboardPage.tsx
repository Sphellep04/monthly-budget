import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertsPanel } from "../components/AlertsPanel";
import { BudgetCard } from "../components/BudgetCard";
import { MonthSelector } from "../components/MonthSelector";
import { MonthlySummaryHeader } from "../components/MonthlySummaryHeader";
import { QueryErrorState } from "../components/QueryErrorState";
import { useActorOrMock } from "../hooks/useActorOrMock";
import { useMonthlySummary, useUserSettings } from "../hooks/useBudget";
import type { Expense } from "../types";
import { getMonthName } from "../types";

function BudgetGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
        <Skeleton key={k} className="h-44 rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
      <h3 className="font-display font-bold text-xl text-foreground mb-2 tracking-tight">
        No budgets set up yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8 font-body leading-relaxed">
        Create your first budget category to start tracking spending. It only
        takes a minute, and you'll see exactly where your money goes.
      </p>

      <Link to="/budgets">
        <Button className="font-body px-6 h-10 rounded-xl shadow-elevated button-hover transition-spring">
          Create your first budget
        </Button>
      </Link>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-8 opacity-30" aria-hidden="true">
        {["d1", "d2", "d3", "d4", "d5"].map((id) => (
          <div
            key={id}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
          />
        ))}
      </div>
    </div>
  );
}

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
  const { actor } = useActorOrMock();

  const handleExport = async () => {
    if (!summary || !actor) return;
    setIsExporting(true);
    try {
      const monthName = getMonthName(month).toLowerCase();
      const filename = `budget-${monthName}-${year}.csv`;
      const lines: string[] = [];

      lines.push("=== BUDGET SUMMARY ===");
      lines.push(
        "Category,Budget Limit (N$),Amount Spent (N$),Remaining (N$),% Used",
      );
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
      lines.push("=== DETAILED EXPENSES ===");
      lines.push("Date,Category,Amount (N$),Notes");

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
      className="gap-2 font-body h-9 px-3.5 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth shadow-subtle"
      onClick={handleExport}
      disabled={!summary || !actor || isExporting}
    >
      {isExporting && <Spinner className="h-4 w-4" />}
      {isExporting ? "Exporting…" : "Export CSV"}
    </Button>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useMonthlySummary(year, month);
  const { data: userSettings, isError: settingsError } = useUserSettings();
  const alertThreshold = userSettings?.alertThresholdPercent ?? 80;

  useEffect(() => {
    if (settingsError) {
      console.error("Failed to load user settings, using defaults");
      toast.error("Couldn't load your settings", {
        description: "Using default alert thresholds for now.",
      });
    }
  }, [settingsError]);

  const budgets = summary?.budgets ?? [];
  const hasBudgets = budgets.length > 0;

  return (
    <div className="p-5 md:p-7 space-y-7 max-w-7xl mx-auto page-enter">
      {/* ── Page hero header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1.5">
            {getGreeting()}
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight leading-none">
              {getMonthName(month)}
            </h1>
            <span className="font-mono text-xl text-muted-foreground/60 font-medium tabular-nums leading-none">
              {year}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Track spending and stay on top of your finances
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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
              className="font-body h-9 px-4 rounded-xl shadow-elevated button-hover transition-spring"
            >
              New Budget
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Monthly summary ── */}
      <MonthlySummaryHeader summary={summary} isLoading={isLoading} />

      {/* ── Alerts panel ── */}
      {hasBudgets && (
        <AlertsPanel summaries={budgets} alertThreshold={alertThreshold} />
      )}

      {/* ── Budget grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground leading-none">
              Budget Categories
            </h2>
            {hasBudgets && (
              <p className="text-xs text-muted-foreground font-body mt-1">
                {budgets.length} categor{budgets.length === 1 ? "y" : "ies"}{" "}
                this month
              </p>
            )}
          </div>
          {hasBudgets && (
            <Link
              to="/budgets"
              className="text-xs text-primary hover:text-primary/80 font-medium font-body transition-colors duration-200"
            >
              Manage budgets
            </Link>
          )}
        </div>

        {isError ? (
          <QueryErrorState onRetry={refetch} />
        ) : isLoading ? (
          <BudgetGridSkeleton />
        ) : hasBudgets ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((bs, i) => (
              <BudgetCard
                key={bs.budget.id.toString()}
                summary={bs}
                index={i + 1}
                alertThreshold={alertThreshold}
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
