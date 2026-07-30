import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { RecurringTemplateForm } from "../components/RecurringTemplateForm";
import { RecurringTemplateList } from "../components/RecurringTemplateList";
import {
  useBudgetSummary,
  useExpenses,
  useRecurringTemplates,
} from "../hooks/useBudget";
import { formatCents, getBudgetStatus } from "../types";

function AnimatedProgressBar({
  spentCents,
  limitCents,
  status,
  pctNum,
}: {
  spentCents: bigint;
  limitCents: bigint;
  status: "on-track" | "warning" | "over-budget";
  pctNum: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRendered(true), 60);
    return () => clearTimeout(t);
  }, []);

  const trackColor =
    status === "over-budget"
      ? "bg-destructive/15"
      : status === "warning"
        ? "bg-warning/15"
        : "bg-muted";

  const fillGradient =
    status === "over-budget"
      ? "from-destructive to-destructive/80"
      : status === "warning"
        ? "from-accent to-amber-400"
        : "from-primary to-blue-400";

  const pct = Math.min(pctNum, 100);

  return (
    <div className="space-y-2">
      <div
        className={`h-3 rounded-full w-full overflow-hidden ${trackColor} shadow-inner-subtle`}
      >
        <div
          ref={barRef}
          className={`h-full rounded-full bg-gradient-to-r ${fillGradient} transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: rendered ? `${pct}%` : "0%" }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-mono">
          {formatCents(spentCents)} of {formatCents(limitCents)}
        </span>
        <span
          className={`font-mono font-semibold tabular-nums ${
            status === "over-budget"
              ? "text-destructive"
              : status === "warning"
                ? "text-accent"
                : "text-primary"
          }`}
        >
          {pctNum}%
        </span>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  "on-track": "On Track",
  warning: "Near Limit",
  "over-budget": "Over Budget",
};
const STATUS_BADGE_CLASS: Record<string, string> = {
  "on-track": "bg-primary/10 text-primary border-primary/20",
  warning: "bg-accent/10 text-accent border-accent/20",
  "over-budget": "bg-destructive/10 text-destructive border-destructive/20",
};

export function BudgetDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const budgetId = BigInt(id ?? "0");
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [recurringFormOpen, setRecurringFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<bigint | null>(null);

  const { data: summary, isLoading: summaryLoading } = useBudgetSummary(
    budgetId,
    year,
    month,
  );
  const { data: expenses = [], isLoading: expensesLoading } =
    useExpenses(budgetId);
  const { data: templates = [], isLoading: templatesLoading } =
    useRecurringTemplates(budgetId);

  if (summaryLoading) {
    return (
      <div className="p-4 md:p-8 space-y-5 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto text-center py-16">
        <p className="text-foreground font-medium mb-1">Budget not found</p>
        <p className="text-muted-foreground text-sm mb-6">
          This budget may have been deleted.
        </p>
        <Link to="/budgets">
          <Button variant="outline" size="sm">
            Back to Budgets
          </Button>
        </Link>
      </div>
    );
  }

  const status = getBudgetStatus(summary);
  const spentCents = summary.totalSpentCents;
  const limitCents = summary.budget.limitCents;
  const remainingCents = limitCents - spentCents;
  const pctNum =
    Number(limitCents) > 0
      ? Math.round((Number(spentCents) / Number(limitCents)) * 100)
      : 0;
  const isOverBudget = status === "over-budget";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto page-enter">
      {/* Back nav */}
      <Link
        to="/budgets"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors-fast"
      >
        All Budgets
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-card shadow-elevated space-y-6 overflow-hidden">
        {/* Top accent band */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${summary.budget.color}, transparent)`,
          }}
        />

        <div className="px-6 pb-6 space-y-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold text-foreground truncate leading-tight">
                {summary.budget.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {summary.budget.category}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs font-semibold shrink-0 px-2.5 py-1 ${STATUS_BADGE_CLASS[status]}`}
            >
              {STATUS_LABEL[status]}
            </Badge>
          </div>

          {/* Amount stats */}
          <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden shadow-inner-subtle">
            {[
              {
                label: "Spent",
                value: formatCents(spentCents),
                className: "text-foreground",
              },
              {
                label: "Limit",
                value: formatCents(limitCents),
                className: "text-muted-foreground",
              },
              {
                label: remainingCents >= BigInt(0) ? "Remaining" : "Over by",
                value: formatCents(
                  remainingCents < BigInt(0) ? -remainingCents : remainingCents,
                ),
                className:
                  remainingCents < BigInt(0)
                    ? "text-destructive"
                    : Number(remainingCents) < Number(limitCents) / 4
                      ? "text-accent"
                      : "text-primary",
              },
            ].map(({ label, value, className }) => (
              <div key={label} className="bg-card px-4 py-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                  {label}
                </p>
                <p
                  className={`font-mono text-lg font-bold tabular-nums ${className}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <AnimatedProgressBar
            spentCents={spentCents}
            limitCents={limitCents}
            status={status}
            pctNum={pctNum}
          />
        </div>
      </div>

      {/* Overspent warning */}
      {isOverBudget && (
        <div
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 shadow-subtle"
          role="alert"
        >
          <div>
            <p className="text-sm font-semibold text-destructive">
              Over budget
            </p>
            <p className="text-xs text-destructive/80 mt-0.5">
              You've exceeded the {formatCents(limitCents)} limit by{" "}
              <span className="font-mono font-semibold">
                {formatCents(-remainingCents)}
              </span>
              . Consider adjusting your spending or increasing this budget.
            </p>
          </div>
        </div>
      )}

      {/* Expenses section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Expenses
            </h2>
            <div className="h-px w-12 bg-border" />
          </div>
          <Button
            size="sm"
            className="button-hover shadow-subtle"
            onClick={() => setExpenseFormOpen(true)}
          >
            Add
          </Button>
        </div>
        <ExpenseList
          expenses={expenses}
          isLoading={expensesLoading}
          onAddFirst={() => setExpenseFormOpen(true)}
        />
      </div>

      {/* Recurring section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-bold text-foreground">
              Recurring
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
              setEditingTemplate(null);
              setRecurringFormOpen(true);
            }}
          >
            Add
          </Button>
        </div>
        <RecurringTemplateList
          templates={templates}
          isLoading={templatesLoading}
          budgetId={budgetId}
          onEdit={(templateId) => {
            setEditingTemplate(templateId);
            setRecurringFormOpen(true);
          }}
        />
      </div>

      <ExpenseForm
        budgetId={budgetId}
        open={expenseFormOpen}
        onOpenChange={setExpenseFormOpen}
      />
      <RecurringTemplateForm
        budgetId={budgetId}
        templateId={editingTemplate}
        templates={templates}
        open={recurringFormOpen}
        onOpenChange={(open) => {
          setRecurringFormOpen(open);
          if (!open) setEditingTemplate(null);
        }}
      />
    </div>
  );
}
