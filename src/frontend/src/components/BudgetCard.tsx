import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";
import type { BudgetSummary } from "../types";

interface BudgetCardProps {
  summary: BudgetSummary;
  index: number;
}

export function BudgetCard({ summary, index }: BudgetCardProps) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;

  const barColor =
    status === "over-budget"
      ? "bg-destructive"
      : status === "warning"
        ? "bg-warning"
        : "bg-primary";

  const statusConfig = {
    "on-track": {
      label: "On Track",
      class: "bg-primary/15 text-primary border-primary/25",
    },
    warning: {
      label: "Warning",
      class: "bg-warning/15 text-warning border-warning/25",
    },
    "over-budget": {
      label: "Over Budget",
      class: "bg-destructive/15 text-destructive border-destructive/25",
    },
  };

  const cfg = statusConfig[status];

  return (
    <Link
      to="/budgets/$id"
      params={{ id: budget.id.toString() }}
      className="group block"
      data-ocid={`budget-card.item.${index}`}
    >
      <div className="bg-card border border-border rounded-xl p-4 shadow-subtle transition-smooth hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="text-2xl leading-none flex-shrink-0"
              role="img"
              aria-label={budget.category}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-sm text-foreground truncate">
                {budget.name}
              </h3>
              <p className="text-xs text-muted-foreground font-body">
                {budget.category}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-xs flex-shrink-0 ml-2 font-body ${cfg.class}`}
          >
            {status === "over-budget" && (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {cfg.label}
          </Badge>
        </div>

        {/* Amounts */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="font-mono text-base font-bold tabular-nums text-foreground">
            {formatCents(totalSpentCents)}
          </span>
          <span className="text-xs text-muted-foreground font-mono">/</span>
          <span className="font-mono text-sm text-muted-foreground tabular-nums">
            {formatCents(budget.limitCents)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-smooth ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Remaining */}
        <p className="text-xs font-mono tabular-nums text-muted-foreground">
          {Number(remainingCents) >= 0 ? (
            <>
              <span className="text-foreground font-semibold">
                {formatCents(remainingCents)}
              </span>{" "}
              remaining
            </>
          ) : (
            <span className="text-destructive font-semibold">
              {formatCents(Math.abs(Number(remainingCents)))} over budget
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
