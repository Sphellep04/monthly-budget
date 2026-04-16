import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";
import type { BudgetSummary } from "../types";

interface AlertsPanelProps {
  summaries: BudgetSummary[];
  alertThreshold?: number;
}

export function AlertsPanel({
  summaries,
  alertThreshold = 80,
}: AlertsPanelProps) {
  const alerts = summaries.filter((s) => {
    const status = getBudgetStatus(s, alertThreshold);
    return status === "warning" || status === "over-budget";
  });

  if (alerts.length === 0) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20"
        data-ocid="alerts-panel.empty_state"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 font-display leading-none">
            All budgets on track!
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 font-body mt-0.5">
            You're within your limits across all categories this month.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border bg-card shadow-subtle overflow-hidden"
      data-ocid="alerts-panel.panel"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/30">
        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
        <h3 className="text-sm font-semibold font-display text-foreground leading-none">
          Budget Alerts
        </h3>
        <Badge
          variant="outline"
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border bg-warning/10 text-warning border-warning/30 font-mono"
        >
          {alerts.length}
        </Badge>
      </div>

      {/* Alert list */}
      <ScrollArea className="max-h-56">
        <div className="divide-y divide-border/60">
          {alerts.map((s, i) => {
            const status = getBudgetStatus(s, alertThreshold);
            const limit = Number(s.budget.limitCents);
            const spent = Number(s.totalSpentCents);
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const icon =
              CATEGORY_ICONS[s.budget.category] ?? CATEGORY_ICONS.Other;
            const isOver = status === "over-budget";

            return (
              <div
                key={s.budget.id.toString()}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors duration-150"
                data-ocid={`alerts-panel.item.${i + 1}`}
              >
                {/* Category icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    background: s.budget.color
                      ? `${s.budget.color}20`
                      : "oklch(var(--primary)/0.10)",
                  }}
                  aria-hidden="true"
                >
                  {icon}
                </div>

                {/* Name + amounts */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold font-display text-foreground truncate leading-none">
                    {s.budget.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 tabular-nums">
                    {formatCents(s.totalSpentCents)}{" "}
                    <span className="text-muted-foreground/60">of</span>{" "}
                    {formatCents(s.budget.limitCents)}
                  </p>
                </div>

                {/* % badge + status icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`font-mono text-xs font-bold tabular-nums ${isOver ? "text-destructive" : "text-warning"}`}
                  >
                    {pct}%
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border gap-1 font-body ${
                      isOver
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-warning/10 text-warning border-warning/30"
                    }`}
                  >
                    {isOver ? (
                      <AlertCircle className="h-2.5 w-2.5" />
                    ) : (
                      <AlertTriangle className="h-2.5 w-2.5" />
                    )}
                    {isOver ? "Over" : "Near"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
