import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { QueryErrorState } from "../components/QueryErrorState";
import {
  useCategoryBreakdown,
  useDailySpending,
  useMonthlySummary,
  useMonthlyTrend,
} from "../hooks/useBudget";
import type { Insight } from "../lib/insights";
import { computeInsights } from "../lib/insights";

// ─── Colour maps ──────────────────────────────────────────────────────────────

const VALUE_COLOR_CLASSES: Record<Insight["color"], string> = {
  primary: "text-primary",
  warning: "text-[oklch(0.55_0.18_48)]",
  danger: "text-destructive",
  success: "text-[oklch(0.45_0.18_142)]",
  info: "text-foreground",
};

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  const valueColor = VALUE_COLOR_CLASSES[insight.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-elevated transition-smooth flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-none mb-1">
            {insight.title}
          </p>
          <p
            className={`text-xl font-bold font-display leading-tight truncate ${valueColor}`}
          >
            {insight.value}
          </p>
        </div>
        {insight.direction && insight.direction !== "neutral" && (
          <Badge
            variant="outline"
            className={`text-[10px] font-bold flex-shrink-0 ${insight.direction === "up" ? "border-destructive/40 text-destructive bg-destructive/8" : "border-[oklch(0.6_0.18_142_/_0.4)] text-[oklch(0.45_0.18_142)] bg-[oklch(0.6_0.18_142_/_0.08)]"}`}
          >
            {insight.direction === "up" ? "Rising" : "Falling"}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {insight.subtext}
      </p>
    </motion.div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function InsightsLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
        <div
          key={k}
          className="bg-card border border-border rounded-2xl p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <h3 className="text-lg font-semibold font-display text-foreground mb-2">
        No insights yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Keep tracking your expenses - insights will appear as patterns emerge
        across your spending history.
      </p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function InsightsPage() {
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth() + 1;
  const prevMonth = currMonth === 1 ? 12 : currMonth - 1;
  const prevYear = currMonth === 1 ? currYear - 1 : currYear;
  const prevPrevMonth = prevMonth === 1 ? 12 : prevMonth - 1;
  const prevPrevYear = prevMonth === 1 ? prevYear - 1 : prevYear;

  const trend12 = useMonthlyTrend(12);
  const breakdownCurr = useCategoryBreakdown(currYear, currMonth);
  const breakdownPrev = useCategoryBreakdown(prevYear, prevMonth);
  const breakdownPrevPrev = useCategoryBreakdown(prevPrevYear, prevPrevMonth);
  const dailyCurr = useDailySpending(currYear, currMonth);
  const dailyPrev = useDailySpending(prevYear, prevMonth);

  // We use monthly summary to check we have actual data
  const monthlySummary = useMonthlySummary(currYear, currMonth);

  const isLoading =
    trend12.isLoading ||
    breakdownCurr.isLoading ||
    breakdownPrev.isLoading ||
    breakdownPrevPrev.isLoading ||
    dailyCurr.isLoading ||
    dailyPrev.isLoading ||
    monthlySummary.isLoading;

  const isError =
    trend12.isError ||
    breakdownCurr.isError ||
    breakdownPrev.isError ||
    breakdownPrevPrev.isError ||
    dailyCurr.isError ||
    dailyPrev.isError ||
    monthlySummary.isError;

  const retryAll = () => {
    trend12.refetch();
    breakdownCurr.refetch();
    breakdownPrev.refetch();
    breakdownPrevPrev.refetch();
    dailyCurr.refetch();
    dailyPrev.refetch();
    monthlySummary.refetch();
  };

  const insights =
    !isLoading &&
    trend12.data &&
    breakdownCurr.data &&
    breakdownPrev.data &&
    breakdownPrevPrev.data &&
    dailyCurr.data &&
    dailyPrev.data
      ? computeInsights({
          now: { year: currYear, month: currMonth },
          trend12: trend12.data,
          currentBreakdown: breakdownCurr.data,
          prevBreakdown: breakdownPrev.data,
          prevPrevBreakdown: breakdownPrevPrev.data,
          dailyCurrent: dailyCurr.data,
          dailyPrev: dailyPrev.data,
          currMonth,
          currYear,
        })
      : [];

  return (
    <div className="min-h-full bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-bold font-display text-foreground leading-tight">
            Smart Insights
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Patterns detected from your spending history
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {isError ? (
          <QueryErrorState onRetry={retryAll} />
        ) : isLoading ? (
          <InsightsLoader />
        ) : insights.length === 0 ? (
          <EmptyInsights />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm text-muted-foreground">
                {insights.length} insight{insights.length !== 1 ? "s" : ""}{" "}
                detected
              </span>
              <Badge
                variant="outline"
                className="text-[10px] border-primary/30 text-primary bg-primary/8"
              >
                Updated now
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {insights.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} />
              ))}
            </div>

            {/* Callout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: insights.length * 0.07 + 0.15 }}
              className="mt-8 bg-muted/40 border border-border rounded-2xl px-5 py-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                Insights are recalculated every time you visit this page using
                your latest expense data. Add more expenses across multiple
                months to see more detailed patterns.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
