import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Plus,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
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
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";

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
      <div
        className="p-4 md:p-8 space-y-5 max-w-2xl mx-auto"
        data-ocid="budget_detail.loading_state"
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div
        className="p-4 md:p-8 max-w-2xl mx-auto text-center py-20"
        data-ocid="budget_detail.error_state"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <ReceiptText className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="text-foreground font-medium mb-1">Budget not found</p>
        <p className="text-muted-foreground text-sm mb-6">
          This budget may have been deleted.
        </p>
        <Link to="/budgets">
          <Button
            variant="outline"
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
      className="p-4 md:p-8 space-y-6 max-w-2xl mx-auto page-enter"
      data-ocid="budget_detail.page"
    >
      {/* Back nav */}
      <Link
        to="/budgets"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors-fast group"
      >
        <ChevronRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-150" />
        <span data-ocid="budget_detail.back_button">All Budgets</span>
      </Link>

      {/* Header card */}
      <div
        className="rounded-2xl border border-border bg-card shadow-elevated space-y-6 overflow-hidden"
        data-ocid="budget_detail.header.card"
      >
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
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-subtle shrink-0"
                style={{ backgroundColor: `${summary.budget.color}20` }}
              >
                {icon}
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl font-bold text-foreground truncate leading-tight">
                  {summary.budget.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {summary.budget.category}
                </p>
              </div>
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
                ocid: "budget_detail.spent_amount",
              },
              {
                label: "Limit",
                value: formatCents(limitCents),
                className: "text-muted-foreground",
                ocid: "budget_detail.limit_amount",
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
                ocid: "budget_detail.remaining_amount",
              },
            ].map(({ label, value, className, ocid }) => (
              <div key={label} className="bg-card px-4 py-3 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                  {label}
                </p>
                <p
                  className={`font-mono text-lg font-bold tabular-nums ${className}`}
                  data-ocid={ocid}
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
          data-ocid="budget_detail.overspent_banner"
        >
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
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
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <ReceiptText className="w-3.5 h-3.5 text-primary" />
            </div>
            <h2 className="font-display text-base font-bold text-foreground">
              Expenses
            </h2>
            <div className="h-px w-12 bg-border" />
          </div>
          <Button
            size="sm"
            className="gap-1.5 button-hover shadow-subtle"
            onClick={() => setExpenseFormOpen(true)}
            data-ocid="budget_detail.add_expense_button"
          >
            <Plus className="w-3.5 h-3.5" />
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
            <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5 text-secondary" />
            </div>
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
            className="gap-1.5 button-hover"
            onClick={() => {
              setEditingTemplate(null);
              setRecurringFormOpen(true);
            }}
            data-ocid="budget_detail.add_recurring_button"
          >
            <Plus className="w-3.5 h-3.5" />
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
