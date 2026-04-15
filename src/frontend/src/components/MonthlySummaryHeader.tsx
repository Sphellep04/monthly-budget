import { Skeleton } from "@/components/ui/skeleton";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatCents } from "../types";
import type { MonthlySummary } from "../types";

interface MonthlySummaryHeaderProps {
  summary?: MonthlySummary;
  isLoading: boolean;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  iconBg?: string;
  iconColor?: string;
  index: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  valueClass,
  iconBg = "bg-primary/15",
  iconColor = "text-primary",
  index,
}: StatCardProps) {
  const staggerClass = `animate-stagger-${index}`;
  return (
    <div
      className={`relative bg-card border border-border rounded-2xl p-4 shadow-subtle overflow-hidden slide-up ${staggerClass}`}
      data-ocid={`summary-header.stat.${index}`}
    >
      {/* Decorative gradient accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04] blur-2xl bg-primary pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-subtle`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground font-body uppercase tracking-widest mb-1">
            {label}
          </p>
          <p
            className={`font-mono text-2xl font-bold leading-none tabular-nums ${valueClass ?? "text-foreground"}`}
          >
            {value}
          </p>
          {sub && (
            <p className="text-[11px] text-muted-foreground font-body mt-1">
              {sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated gradient progress bar */
function GlobalProgressBar({
  pct,
  barColorClass,
}: { pct: number; barColorClass: string }) {
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 120);
    return () => {
      if (timerRef.current !== null)
        clearTimeout(timerRef.current ?? undefined);
    };
  }, []);

  const gradientClass =
    pct >= 100
      ? "from-destructive via-destructive to-destructive/80"
      : pct >= 80
        ? "from-warning via-warning to-warning/70"
        : "from-primary via-primary/70 to-primary/80";

  return (
    <div
      className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner-subtle"
      aria-hidden="true"
      data-ocid="summary-header.progress"
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} ${barColorClass}`}
        style={{
          width: mounted ? `${pct}%` : "0%",
          transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

export function MonthlySummaryHeader({
  summary,
  isLoading,
}: MonthlySummaryHeaderProps) {
  if (isLoading || !summary) {
    return (
      <div className="space-y-3" data-ocid="summary-header.loading_state">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton className="h-[88px] rounded-2xl" />
          <Skeleton className="h-[88px] rounded-2xl" />
          <Skeleton className="h-[88px] rounded-2xl" />
        </div>
        <Skeleton className="h-[72px] rounded-2xl" />
      </div>
    );
  }

  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const barColorClass =
    pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";

  const isOverBudget = remaining < 0;
  const isNearLimit =
    !isOverBudget && remaining / Math.max(totalBudget, 1) < 0.2;

  const remainingValueClass = isOverBudget
    ? "text-destructive"
    : isNearLimit
      ? "text-warning"
      : "text-emerald-700 dark:text-emerald-400";

  const remainingSub = isOverBudget
    ? `${formatCents(Math.abs(remaining))} over budget`
    : isNearLimit
      ? "Approaching limit"
      : "You're doing great";

  const spentPctLabel = `${pct.toFixed(1)}% of budget used`;

  return (
    <div className="space-y-3" data-ocid="summary-header">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          index={1}
          icon={Wallet}
          label="Total Budget"
          value={formatCents(summary.totalBudgetCents)}
          sub={`${summary.budgets.length} categor${summary.budgets.length === 1 ? "y" : "ies"}`}
          iconBg="bg-primary/12"
          iconColor="text-primary"
        />
        <StatCard
          index={2}
          icon={TrendingUp}
          label="Total Spent"
          value={formatCents(summary.totalSpentCents)}
          sub={spentPctLabel}
          iconBg="bg-secondary/12"
          iconColor="text-secondary"
        />
        <StatCard
          index={3}
          icon={isOverBudget ? TrendingDown : PiggyBank}
          label={isOverBudget ? "Over Budget" : "Remaining"}
          value={formatCents(Math.abs(remaining))}
          sub={remainingSub}
          valueClass={remainingValueClass}
          iconBg={
            isOverBudget
              ? "bg-destructive/12"
              : isNearLimit
                ? "bg-warning/12"
                : "bg-emerald-500/12"
          }
          iconColor={
            isOverBudget
              ? "text-destructive"
              : isNearLimit
                ? "text-warning"
                : "text-emerald-700 dark:text-emerald-400"
          }
        />
      </div>

      {/* ── Global progress bar card ── */}
      <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-subtle slide-up animate-stagger-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground font-body uppercase tracking-widest">
              Monthly Progress
            </span>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {formatCents(summary.totalSpentCents)} spent of{" "}
              {formatCents(summary.totalBudgetCents)} budget
            </p>
          </div>
          <span
            className={`font-mono text-lg font-bold tabular-nums ${barColorClass === "bg-destructive" ? "text-destructive" : barColorClass === "bg-warning" ? "text-warning" : "text-primary"}`}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
        <GlobalProgressBar pct={pct} barColorClass={barColorClass} />
        {/* Progress milestones */}
        <div className="flex justify-between mt-1.5">
          {[0, 25, 50, 75, 100].map((m) => (
            <span
              key={m}
              className={`text-[9px] font-mono tabular-nums ${pct >= m ? "text-muted-foreground" : "text-muted-foreground/40"}`}
            >
              {m}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
