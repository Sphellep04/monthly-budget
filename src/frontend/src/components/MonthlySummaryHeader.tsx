import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { formatCents } from "../types";
import type { MonthlySummary } from "../types";

interface MonthlySummaryHeaderProps {
  summary?: MonthlySummary;
  isLoading: boolean;
}

function AnimatedBar({ pct, colorClass }: { pct: number; colorClass: string }) {
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 120);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="h-2 bg-muted/60 rounded-full overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`h-full rounded-full transition-all ${colorClass}`}
        style={{
          width: mounted ? `${Math.min(pct, 100)}%` : "0%",
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
    return <Skeleton className="h-[148px] rounded-2xl" />;
  }

  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const isOverBudget = remaining < 0;
  const isNearLimit =
    !isOverBudget && remaining / Math.max(totalBudget, 1) < 0.2;

  const barColorClass = isOverBudget
    ? "bg-destructive"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-primary";

  const remainingValueClass = isOverBudget
    ? "text-destructive"
    : isNearLimit
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-700 dark:text-emerald-400";

  const remainingSub = isOverBudget
    ? `${formatCents(Math.abs(remaining))} over limit`
    : isNearLimit
      ? "Approaching limit"
      : "You're doing great";

  const totalIncome = Number(summary.totalIncomeCents);
  const netSavings = totalIncome - totalSpent;
  const hasIncome = totalIncome > 0;
  const savingsValueClass = !hasIncome
    ? "text-muted-foreground"
    : netSavings >= 0
      ? "text-emerald-700 dark:text-emerald-400"
      : "text-destructive";
  const savingsSub = !hasIncome
    ? "Log income to track this"
    : netSavings >= 0
      ? "Income minus expenses"
      : "Spending more than you earn";

  const stats = [
    {
      label: "Total Budget",
      value: formatCents(summary.totalBudgetCents),
      sub: `${summary.budgets.length} categor${summary.budgets.length === 1 ? "y" : "ies"}`,
      valueClass: "text-foreground",
    },
    {
      label: "Total Spent",
      value: formatCents(summary.totalSpentCents),
      sub: `${pct.toFixed(1)}% of budget`,
      valueClass: "text-foreground",
    },
    {
      label: "Net Savings",
      value: formatCents(Math.abs(netSavings)),
      sub: savingsSub,
      valueClass: savingsValueClass,
    },
    {
      label: isOverBudget ? "Over Budget" : "Remaining",
      value: formatCents(Math.abs(remaining)),
      sub: remainingSub,
      valueClass: remainingValueClass,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-subtle slide-up animate-stagger-1">
      {/* Stat columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        {stats.map(({ label, value, sub, valueClass }) => (
          <div key={label} className="px-5 py-4">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1">
              {label}
            </p>
            <p
              className={`font-display text-[1.75rem] font-bold tabular-nums leading-none ${valueClass}`}
            >
              {value}
            </p>
            {sub && (
              <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Integrated progress strip */}
      <div className="border-t border-border/60 px-5 py-3 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em]">
            Monthly Progress
          </span>
          <span
            className={`font-mono text-xs font-bold tabular-nums ${isOverBudget ? "text-destructive" : isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-primary"}`}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
        <AnimatedBar pct={pct} colorClass={barColorClass} />
        <div className="flex justify-between mt-1.5">
          {[0, 25, 50, 75, 100].map((m) => (
            <span
              key={m}
              className={`text-[9px] font-mono tabular-nums ${pct >= m ? "text-muted-foreground" : "text-muted-foreground/35"}`}
            >
              {m}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
