import { Link } from "@tanstack/react-router";
import { useCategoryBreakdown } from "../hooks/useBudget";
import { computeTrendingCategory } from "../lib/insights";
import { shiftMonth } from "../lib/monthMath";

/**
 * Surfaces the single most notable spending-pattern change for the viewed
 * month right on the Dashboard, instead of leaving it for whoever happens to
 * visit the separate Insights page. Reuses the same computation Insights
 * uses (see lib/insights.ts) so the two never disagree.
 */
export function TopInsightBanner({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const { year: prevY, month: prevM } = shiftMonth(year, month, -1);
  const current = useCategoryBreakdown(year, month);
  const prev = useCategoryBreakdown(prevY, prevM);

  if (!current.data || !prev.data) return null;
  const insight = computeTrendingCategory(current.data, prev.data);
  if (!insight) return null;

  return (
    <Link
      to="/insights"
      className="flex items-center justify-between gap-3 rounded-2xl bg-foreground text-background px-5 py-4 shadow-elevated hover:opacity-90 transition-opacity"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight truncate">
          {insight.value}
        </p>
        <p className="text-xs text-background/70 mt-0.5 leading-relaxed">
          {insight.subtext}
        </p>
      </div>
      <span className="text-xs text-background/70 flex-shrink-0">View all</span>
    </Link>
  );
}
