import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { formatCents } from "../types";
import type { MonthlySummary } from "../types";

interface MonthlySummaryHeaderProps {
  summary?: MonthlySummary;
  isLoading: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-subtle">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`font-mono text-lg font-bold leading-tight tabular-nums ${valueClass ?? "text-foreground"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function MonthlySummaryHeader({
  summary,
  isLoading,
}: MonthlySummaryHeaderProps) {
  if (isLoading || !summary) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
        data-ocid="summary-header.loading_state"
      >
        <Skeleton className="h-[72px] rounded-xl" />
        <Skeleton className="h-[72px] rounded-xl" />
        <Skeleton className="h-[72px] rounded-xl" />
      </div>
    );
  }

  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const barColor =
    pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";

  const remainingClass =
    remaining < 0
      ? "text-destructive"
      : remaining / totalBudget < 0.2
        ? "text-warning"
        : "text-foreground";

  return (
    <div className="space-y-3 mb-6" data-ocid="summary-header">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={Wallet}
          label="Total Budget"
          value={formatCents(summary.totalBudgetCents)}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Spent"
          value={formatCents(summary.totalSpentCents)}
        />
        <StatCard
          icon={PiggyBank}
          label="Remaining"
          value={formatCents(Math.abs(remaining))}
          valueClass={remainingClass}
        />
      </div>

      {/* Global progress bar */}
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-subtle">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            Monthly Progress
          </span>
          <span className="font-mono text-xs font-semibold text-muted-foreground tabular-nums">
            {pct.toFixed(1)}%
          </span>
        </div>
        <div
          className="h-2 bg-muted rounded-full overflow-hidden"
          data-ocid="summary-header.progress"
        >
          <div
            className={`h-full rounded-full transition-smooth ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
