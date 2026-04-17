import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";
import type { BudgetSummary } from "../types";

interface BudgetCardProps {
  summary: BudgetSummary;
  index: number;
  alertThreshold?: number;
}

const STATUS_CONFIG = {
  "on-track": {
    label: "On Track",
    dot: "bg-emerald-500",
    labelClass: "text-emerald-700 dark:text-emerald-400",
    barClass: "bg-emerald-500",
    remainingClass: "text-emerald-700 dark:text-emerald-400",
  },
  warning: {
    label: "Near Limit",
    dot: "bg-amber-500",
    labelClass: "text-amber-600 dark:text-amber-400",
    barClass: "bg-amber-500",
    remainingClass: "text-amber-600 dark:text-amber-400",
  },
  "over-budget": {
    label: "Over Budget",
    dot: "bg-destructive",
    labelClass: "text-destructive",
    barClass: "bg-destructive",
    remainingClass: "text-destructive",
  },
} as const;

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setMounted(true), 80);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  return (
    <div className="h-1.5 bg-muted/70 rounded-full overflow-hidden" aria-hidden>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: mounted ? `${Math.min(pct, 100)}%` : "0%",
          background: color,
          transition: "width 0.75s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: pct > 80 ? `0 0 6px ${color}60` : undefined,
        }}
      />
    </div>
  );
}

export function BudgetCard({ summary, index, alertThreshold = 80 }: BudgetCardProps) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary, alertThreshold);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const remaining = Number(remainingCents);
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;
  const cfg = STATUS_CONFIG[status];
  const accentColor = budget.color ?? "#6366f1";
  const staggerClass = `animate-stagger-${Math.min(index + 1, 6)}`;

  return (
    <Link
      to="/budgets/$id"
      params={{ id: budget.id.toString() }}
      className={cn("group block slide-up", staggerClass)}
    >
      <div className="relative bg-card border border-border/80 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-border hover:shadow-elevated hover:-translate-y-0.5">

        {/* Top color accent */}
        <div className="h-[3px] w-full flex-shrink-0" style={{ background: accentColor }} />

        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* Header: icon + name + status */}
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${accentColor}18` }}
              aria-hidden
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-[0.875rem] text-foreground truncate leading-tight">
                {budget.name}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{budget.category}</p>
            </div>
            {/* Status pill */}
            <div className={cn("flex items-center gap-1.5 flex-shrink-0 px-2 py-1 rounded-full bg-muted/60 text-[10px] font-semibold", cfg.labelClass)}>
              <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
              {cfg.label}
            </div>
          </div>

          {/* Hero number: remaining / over */}
          <div className="flex-1">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.14em] mb-1.5">
              {remaining >= 0 ? "Remaining" : "Over budget"}
            </p>
            <p className={cn("font-mono text-[1.75rem] font-bold tabular-nums leading-none", cfg.remainingClass)}>
              {formatCents(remaining < 0 ? BigInt(Math.abs(remaining)) : remainingCents)}
            </p>
          </div>

          {/* Progress + stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-muted-foreground tabular-nums">
                {formatCents(totalSpentCents)}
                <span className="text-muted-foreground/40 mx-1">/</span>
                {formatCents(budget.limitCents)}
              </span>
              <span className={cn("font-mono font-semibold tabular-nums", cfg.labelClass)}>
                {Math.min(pct, 999).toFixed(0)}%
              </span>
            </div>
            <ProgressBar pct={pct} color={pct >= 100 ? "#ef4444" : pct >= alertThreshold ? "#f59e0b" : accentColor} />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-3 border-t border-border/40 bg-muted/20">
          <span className="flex items-center justify-end gap-1 text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors duration-150">
            View details
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-150" />
          </span>
        </div>
      </div>
    </Link>
  );
}
