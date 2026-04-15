import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { RecurringTemplateForm } from "../components/RecurringTemplateForm";
import { RecurringTemplateList } from "../components/RecurringTemplateList";
import {
  useBudgetSummary,
  useExpenses,
  useRecurringTemplates,
} from "../hooks/useBudget";
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";

function BudgetProgressBar({
  spentCents,
  limitCents,
  status,
}: {
  spentCents: bigint;
  limitCents: bigint;
  status: "on-track" | "warning" | "over-budget";
}) {
  const spent = Number(spentCents);
  const limit = Number(limitCents);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const trackColor =
    status === "over-budget"
      ? "bg-destructive/20"
      : status === "warning"
        ? "bg-warning/20"
        : "bg-muted";
  const fillColor =
    status === "over-budget"
      ? "bg-destructive"
      : status === "warning"
        ? "bg-accent"
        : "bg-primary";
  return (
    <div className={`h-2 rounded-full w-full overflow-hidden ${trackColor}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${fillColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  "on-track": "On Track",
  warning: "Warning",
  "over-budget": "Over Budget",
};
const STATUS_BADGE_CLASS: Record<string, string> = {
  "on-track": "bg-primary/15 text-primary border-primary/25",
  warning: "bg-accent/15 text-accent border-accent/25",
  "over-budget": "bg-destructive/15 text-destructive border-destructive/25",
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
      <div
        className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto"
        data-ocid="budget_detail.loading_state"
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div
        className="p-4 md:p-6 max-w-2xl mx-auto text-center py-16"
        data-ocid="budget_detail.error_state"
      >
        <p className="text-muted-foreground mb-4">Budget not found.</p>
        <Link to="/budgets">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            data-ocid="budget_detail.back_button"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Budgets
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
  const icon = CATEGORY_ICONS[summary.budget.category] ?? "📦";

  return (
    <div
      className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto"
      data-ocid="budget_detail.page"
    >
      {/* Back nav */}
      <Link to="/budgets">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
          data-ocid="budget_detail.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          All Budgets
        </Button>
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl border border-border bg-card p-6 shadow-subtle space-y-5"
        data-ocid="budget_detail.header.card"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="text-3xl leading-none"
              role="img"
              aria-label={summary.budget.category}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-semibold text-foreground truncate">
                {summary.budget.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {summary.budget.category}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs font-semibold shrink-0 ${STATUS_BADGE_CLASS[status]}`}
          >
            {STATUS_LABEL[status]}
          </Badge>
        </div>

        {/* Amount stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Spent
            </p>
            <p
              className="font-mono text-lg font-bold text-foreground tabular-nums"
              data-ocid="budget_detail.spent_amount"
            >
              {formatCents(spentCents)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              Limit
            </p>
            <p
              className="font-mono text-lg font-semibold text-muted-foreground tabular-nums"
              data-ocid="budget_detail.limit_amount"
            >
              {formatCents(limitCents)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
              {remainingCents >= BigInt(0) ? "Remaining" : "Over by"}
            </p>
            <p
              className={`font-mono text-lg font-semibold tabular-nums ${
                remainingCents < BigInt(0)
                  ? "text-destructive"
                  : Number(remainingCents) < Number(limitCents) / 4
                    ? "text-accent"
                    : "text-primary"
              }`}
              data-ocid="budget_detail.remaining_amount"
            >
              {remainingCents < BigInt(0)
                ? formatCents(-remainingCents)
                : formatCents(remainingCents)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <BudgetProgressBar
            spentCents={spentCents}
            limitCents={limitCents}
            status={status}
          />
          <p className="text-xs text-muted-foreground text-right font-mono">
            {pctNum}% used
          </p>
        </div>
      </div>

      {/* Overspent warning banner */}
      {isOverBudget && (
        <div
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3"
          role="alert"
          data-ocid="budget_detail.overspent_banner"
        >
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-destructive">
              Over Budget
            </p>
            <p className="text-xs text-destructive/80 mt-0.5">
              You&apos;ve exceeded your {formatCents(limitCents)} limit by{" "}
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
          <h2 className="font-display text-base font-semibold text-foreground">
            Expenses
          </h2>
          <Button
            size="sm"
            className="gap-1.5 transition-smooth"
            onClick={() => setExpenseFormOpen(true)}
            data-ocid="budget_detail.add_expense_button"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>

        <ExpenseList
          expenses={expenses}
          isLoading={expensesLoading}
          onAddFirst={() => setExpenseFormOpen(true)}
        />
      </div>

      {/* Recurring Templates section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-semibold text-foreground">
              Recurring
            </h2>
            <Badge
              variant="outline"
              className="text-xs bg-primary/10 text-primary border-primary/25"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Auto-applied monthly
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 transition-smooth"
            onClick={() => {
              setEditingTemplate(null);
              setRecurringFormOpen(true);
            }}
            data-ocid="budget_detail.add_recurring_button"
          >
            <Plus className="w-4 h-4" />
            Add Recurring
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

      {/* Expense form dialog */}
      <ExpenseForm
        budgetId={budgetId}
        open={expenseFormOpen}
        onOpenChange={setExpenseFormOpen}
      />

      {/* Recurring template form dialog */}
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
