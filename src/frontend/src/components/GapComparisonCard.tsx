import { useMonthlySummary } from "../hooks/useBudget";
import { computeGapComparison } from "../lib/insights";
import { shiftMonth } from "../lib/monthMath";
import { formatCents, getMonthName } from "../types";

/**
 * Shows the gap (spent - budget) for the month before whatever's currently
 * viewed, and how that compares to the month before that - a retrospective
 * check alongside the live current-month tracking above it, so it looks one
 * step back rather than repeating the same month's numbers.
 */
export function GapComparisonCard({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const { year: gapY, month: gapM } = shiftMonth(year, month, -1);
  const { year: prevY, month: prevM } = shiftMonth(year, month, -2);
  const gapSummary = useMonthlySummary(gapY, gapM);
  const prevSummary = useMonthlySummary(prevY, prevM);

  if (!gapSummary.data || !prevSummary.data) return null;

  const gap = computeGapComparison({
    label: getMonthName(gapM),
    totalBudgetCents: gapSummary.data.totalBudgetCents,
    totalSpentCents: gapSummary.data.totalSpentCents,
    prevTotalBudgetCents: prevSummary.data.totalBudgetCents,
    prevTotalSpentCents: prevSummary.data.totalSpentCents,
  });
  if (!gap) return null;

  const isOver = gap.gapCents > 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-subtle">
      <p className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1">
        Last gap · {gap.label}
      </p>
      <p
        className={`font-display text-2xl font-bold tabular-nums leading-none ${isOver ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"}`}
      >
        {isOver ? "-" : "+"}
        {formatCents(Math.abs(gap.gapCents))}
      </p>
      {gap.deltaCents !== 0 && (
        <p className="text-[12px] text-muted-foreground mt-1">
          <span
            className={
              gap.better
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
            }
          >
            {gap.better ? "↓" : "↑"} {formatCents(Math.abs(gap.deltaCents))}
          </span>{" "}
          {gap.better ? "better" : "worse"} than the month before
        </p>
      )}
    </div>
  );
}
