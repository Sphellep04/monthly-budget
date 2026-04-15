import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_ICONS, formatCents, getBudgetStatus } from "../types";
import type { BudgetSummary } from "../types";

interface BudgetCardProps {
  summary: BudgetSummary;
  index: number;
}

const STATUS_CONFIG = {
  "on-track": {
    label: "On Track",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
    icon: CheckCircle2,
    barClass: "bg-primary",
    glowClass: "glow-success",
  },
  warning: {
    label: "Near Limit",
    badgeClass: "bg-warning/10 text-warning border-warning/30",
    icon: AlertTriangle,
    barClass: "bg-warning",
    glowClass: "glow-warning",
  },
  "over-budget": {
    label: "Over Budget",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/30",
    icon: AlertCircle,
    barClass: "bg-destructive",
    glowClass: "glow-danger",
  },
} as const;

/** Animated progress bar that fills on mount */
function ProgressBar({ pct, barClass }: { pct: number; barClass: string }) {
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 80);
    return () => {
      if (timerRef.current !== null)
        clearTimeout(timerRef.current ?? undefined);
    };
  }, []);

  return (
    <div
      className="h-1.5 bg-muted rounded-full overflow-hidden shadow-inner-subtle"
      aria-hidden="true"
    >
      <div
        className={`h-full rounded-full ${barClass}`}
        style={{
          width: mounted ? `${pct}%` : "0%",
          transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

export function BudgetCard({ summary, index }: BudgetCardProps) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const remaining = Number(remainingCents);
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;

  // Derive a soft tint from the budget's stored color for the icon bubble
  const iconBg = budget.color ? `${budget.color}20` : undefined;

  const staggerClass = `animate-stagger-${Math.min(index, 6)}`;

  return (
    <Link
      to="/budgets/$id"
      params={{ id: budget.id.toString() }}
      className={`group block slide-up ${staggerClass}`}
      data-ocid={`budget-card.item.${index}`}
    >
      <div className="bg-card border border-border rounded-2xl p-4 card-hover h-full flex flex-col gap-3 hover:border-primary/30">
        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-2">
          {/* Icon bubble + name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-subtle"
              style={{ background: iconBg ?? "oklch(var(--primary)/0.12)" }}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-sm text-foreground truncate leading-tight">
                {budget.name}
              </h3>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {budget.category}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold flex-shrink-0 gap-1 px-2 py-0.5 rounded-full border font-body ${cfg.badgeClass} ${status !== "on-track" ? cfg.glowClass : ""}`}
          >
            <StatusIcon className="h-2.5 w-2.5" />
            {cfg.label}
          </Badge>
        </div>

        {/* ── Amount row ── */}
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-bold tabular-nums text-foreground leading-none">
            {formatCents(totalSpentCents)}
          </span>
          <span className="text-xs text-muted-foreground font-body">of</span>
          <span className="font-mono text-sm text-muted-foreground tabular-nums">
            {formatCents(budget.limitCents)}
          </span>
          <span className="ml-auto font-mono text-xs font-semibold tabular-nums text-muted-foreground">
            {pct.toFixed(0)}%
          </span>
        </div>

        {/* ── Progress bar ── */}
        <ProgressBar pct={pct} barClass={cfg.barClass} />

        {/* ── Remaining + CTA row ── */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xs font-mono tabular-nums">
            {remaining >= 0 ? (
              <>
                <span
                  className={`font-semibold ${status === "warning" ? "text-warning" : "text-emerald-700 dark:text-emerald-400"}`}
                >
                  {formatCents(remainingCents)}
                </span>
                <span className="text-muted-foreground"> left</span>
              </>
            ) : (
              <span className="font-semibold text-destructive">
                {formatCents(Math.abs(remaining))} over
              </span>
            )}
          </p>

          <span className="flex items-center gap-0.5 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200 font-body">
            Details
            <ArrowRight className="h-3 w-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}
