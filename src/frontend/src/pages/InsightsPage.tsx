import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Flame,
  Lightbulb,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useCategoryBreakdown,
  useDailySpending,
  useMonthlySummary,
  useMonthlyTrend,
} from "../hooks/useBudget";
import { formatCents } from "../types";

// ─── Insight Types ────────────────────────────────────────────────────────────

interface Insight {
  id: string;
  type:
    | "weekend-spending"
    | "trending-category"
    | "consecutive-overage"
    | "busiest-day"
    | "mom-change";
  title: string;
  value: string;
  subtext: string;
  direction?: "up" | "down" | "neutral";
  color: "primary" | "warning" | "danger" | "success" | "info";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function pct(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round(((a - b) / b) * 100);
}

function sign(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

// ─── Insight computation (pure, client-side) ──────────────────────────────────

interface InsightInput {
  now: { year: number; month: number };
  trend12: Array<{ year: bigint; month: bigint; totalSpentCents: bigint }>;
  currentBreakdown: Array<{
    budgetId: string;
    name: string;
    amountCents: bigint;
    color: string;
  }>;
  prevBreakdown: Array<{
    budgetId: string;
    name: string;
    amountCents: bigint;
    color: string;
  }>;
  prevPrevBreakdown: Array<{
    budgetId: string;
    name: string;
    amountCents: bigint;
    color: string;
  }>;
  dailyCurrent: Array<{ day: bigint; amountCents: bigint }>;
  dailyPrev: Array<{ day: bigint; amountCents: bigint }>;
  currMonth: number;
  currYear: number;
}

function computeInsights(input: InsightInput): Insight[] {
  const insights: Insight[] = [];
  const {
    trend12,
    currentBreakdown,
    prevBreakdown,
    prevPrevBreakdown,
    dailyCurrent,
    dailyPrev,
    currMonth,
    currYear,
  } = input;

  // 1. Weekend vs Weekday spending
  const weekendWeekdayInsight = computeWeekendWeekday(
    dailyCurrent,
    dailyPrev,
    currYear,
    currMonth,
  );
  if (weekendWeekdayInsight) insights.push(weekendWeekdayInsight);

  // 2. Trending category (MoM)
  const trendingInsight = computeTrendingCategory(
    currentBreakdown,
    prevBreakdown,
  );
  if (trendingInsight) insights.push(trendingInsight);

  // 3. Consecutive budget overages
  const overageInsight = computeConsecutiveOverage(
    currentBreakdown,
    prevBreakdown,
    prevPrevBreakdown,
  );
  if (overageInsight) insights.push(overageInsight);

  // 4. Busiest day of week
  const busiestDay = computeBusiestDay(
    dailyCurrent,
    dailyPrev,
    currYear,
    currMonth,
  );
  if (busiestDay) insights.push(busiestDay);

  // 5. Month-over-month change (biggest mover)
  const momInsight = computeMoMChange(currentBreakdown, prevBreakdown);
  if (momInsight) insights.push(momInsight);

  // 6. Monthly spending trend direction
  const trendInsight = computeMonthlyTrend(trend12);
  if (trendInsight) insights.push(trendInsight);

  return insights;
}

function computeWeekendWeekday(
  dailyCurrent: Array<{ day: bigint; amountCents: bigint }>,
  dailyPrev: Array<{ day: bigint; amountCents: bigint }>,
  year: number,
  month: number,
): Insight | null {
  // Combine last 2 months of daily spending
  const allDays: Array<{ date: Date; amount: number }> = [];

  for (const d of dailyCurrent) {
    const date = new Date(year, month - 1, Number(d.day));
    allDays.push({ date, amount: Number(d.amountCents) });
  }
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  for (const d of dailyPrev) {
    const date = new Date(prevYear, prevMonth - 1, Number(d.day));
    allDays.push({ date, amount: Number(d.amountCents) });
  }

  if (allDays.length < 10) return null;

  let weekendTotal = 0;
  let weekendDays = 0;
  let weekdayTotal = 0;
  let weekdayDays = 0;

  for (const { date, amount } of allDays) {
    const dow = date.getDay();
    if (dow === 0 || dow === 6) {
      weekendTotal += amount;
      weekendDays++;
    } else {
      weekdayTotal += amount;
      weekdayDays++;
    }
  }

  if (weekendDays === 0 || weekdayDays === 0) return null;

  const avgWeekend = weekendTotal / weekendDays;
  const avgWeekday = weekdayTotal / weekdayDays;
  const diff = pct(avgWeekend, avgWeekday);

  if (Math.abs(diff) < 15) return null;

  const higher = avgWeekend > avgWeekday;
  return {
    id: "weekend-spending",
    type: "weekend-spending",
    title: "Weekend vs. Weekday Spending",
    value: `${Math.abs(diff)}% ${higher ? "more" : "less"} on weekends`,
    subtext: `Weekend avg: ${formatCents(Math.round(avgWeekend))} · Weekday avg: ${formatCents(Math.round(avgWeekday))} per day`,
    direction: higher ? "up" : "down",
    color: higher ? "warning" : "success",
  };
}

function computeTrendingCategory(
  current: Array<{ budgetId: string; name: string; amountCents: bigint }>,
  prev: Array<{ budgetId: string; name: string; amountCents: bigint }>,
): Insight | null {
  if (current.length === 0 || prev.length === 0) return null;

  let biggestChange = 0;
  let biggestName = "";
  let biggestPrev = 0;
  let biggestCurr = 0;

  for (const curr of current) {
    const prevCat = prev.find((p) => p.name === curr.name);
    if (!prevCat || Number(prevCat.amountCents) === 0) continue;
    const change = pct(Number(curr.amountCents), Number(prevCat.amountCents));
    if (Math.abs(change) > Math.abs(biggestChange)) {
      biggestChange = change;
      biggestName = curr.name;
      biggestPrev = Number(prevCat.amountCents);
      biggestCurr = Number(curr.amountCents);
    }
  }

  if (Math.abs(biggestChange) < 10 || biggestName === "") return null;

  const up = biggestChange > 0;
  return {
    id: "trending-category",
    type: "trending-category",
    title: "Trending Category",
    value: `${biggestName} ${sign(biggestChange)}%`,
    subtext: `${up ? "Up" : "Down"} from ${formatCents(biggestPrev)} to ${formatCents(biggestCurr)} this month`,
    direction: up ? "up" : "down",
    color: up ? "warning" : "success",
  };
}

function computeConsecutiveOverage(
  current: Array<{ budgetId: string; name: string; amountCents: bigint }>,
  prev: Array<{
    budgetId: string;
    name: string;
    amountCents: bigint;
    color: string;
  }>,
  prevPrev: Array<{
    budgetId: string;
    name: string;
    amountCents: bigint;
    color: string;
  }>,
): Insight | null {
  // We don't have budget limits in breakdown, so look for categories present
  // in both current and prev with amountCents > 0, treating "very high" as indicator.
  // Instead, find a category that appears in current, prev, AND prevPrev and is growing
  // each time (proxy for consecutive concern).
  const overCategories: string[] = [];

  for (const curr of current) {
    const p = prev.find((x) => x.name === curr.name);
    const pp = prevPrev.find((x) => x.name === curr.name);
    if (!p || !pp) continue;

    const currAmt = Number(curr.amountCents);
    const prevAmt = Number(p.amountCents);
    const ppAmt = Number(pp.amountCents);

    if (ppAmt > 0 && prevAmt > ppAmt && currAmt > prevAmt) {
      overCategories.push(curr.name);
    }
  }

  if (overCategories.length === 0) return null;

  const name = overCategories[0];
  const months = 3;
  return {
    id: "consecutive-overage",
    type: "consecutive-overage",
    title: "Rising Spend Pattern",
    value: `${name} up ${months} months running`,
    subtext: `Spending in ${name} has increased consecutively for the past ${months} months`,
    direction: "up",
    color: "danger",
  };
}

function computeBusiestDay(
  dailyCurrent: Array<{ day: bigint; amountCents: bigint }>,
  dailyPrev: Array<{ day: bigint; amountCents: bigint }>,
  year: number,
  month: number,
): Insight | null {
  const dowTotals: number[] = new Array(7).fill(0);
  const dowCounts: number[] = new Array(7).fill(0);

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  for (const d of dailyCurrent) {
    const date = new Date(year, month - 1, Number(d.day));
    const dow = date.getDay();
    dowTotals[dow] += Number(d.amountCents);
    dowCounts[dow]++;
  }
  for (const d of dailyPrev) {
    const date = new Date(prevYear, prevMonth - 1, Number(d.day));
    const dow = date.getDay();
    dowTotals[dow] += Number(d.amountCents);
    dowCounts[dow]++;
  }

  const totalSpent = dowTotals.reduce((s, v) => s + v, 0);
  if (totalSpent === 0) return null;

  const avgByDow = dowTotals.map((t, i) =>
    dowCounts[i] > 0 ? t / dowCounts[i] : 0,
  );
  const maxIdx = avgByDow.reduce((mi, v, i) => (v > avgByDow[mi] ? i : mi), 0);
  const maxPct = Math.round((dowTotals[maxIdx] / totalSpent) * 100);

  if (maxPct < 15) return null;

  return {
    id: "busiest-day",
    type: "busiest-day",
    title: "Highest Spending Day",
    value: `${DAY_NAMES[maxIdx]}s`,
    subtext: `${maxPct}% of tracked spending happens on ${DAY_NAMES[maxIdx]}s (avg ${formatCents(Math.round(avgByDow[maxIdx]))} per ${DAY_NAMES[maxIdx]})`,
    direction: "neutral",
    color: "info",
  };
}

function computeMoMChange(
  current: Array<{ budgetId: string; name: string; amountCents: bigint }>,
  prev: Array<{ budgetId: string; name: string; amountCents: bigint }>,
): Insight | null {
  if (current.length === 0 || prev.length === 0) return null;

  const totalCurr = current.reduce((s, c) => s + Number(c.amountCents), 0);
  const totalPrev = prev.reduce((s, c) => s + Number(c.amountCents), 0);
  if (totalPrev === 0) return null;

  const change = pct(totalCurr, totalPrev);
  if (Math.abs(change) < 10) return null;

  const up = change > 0;
  return {
    id: "mom-change",
    type: "mom-change",
    title: "Month-over-Month Spending",
    value: `${sign(change)}% overall`,
    subtext: `Total spending moved from ${formatCents(totalPrev)} to ${formatCents(totalCurr)} vs. last month`,
    direction: up ? "up" : "down",
    color: up ? "warning" : "success",
  };
}

function computeMonthlyTrend(
  trend12: Array<{ year: bigint; month: bigint; totalSpentCents: bigint }>,
): Insight | null {
  const active = trend12.filter((p) => Number(p.totalSpentCents) > 0);
  if (active.length < 4) return null;

  const last4 = active.slice(-4).map((p) => Number(p.totalSpentCents));
  const first2Avg = (last4[0] + last4[1]) / 2;
  const last2Avg = (last4[2] + last4[3]) / 2;
  const change = pct(last2Avg, first2Avg);

  if (Math.abs(change) < 10) return null;

  const up = change > 0;
  return {
    id: "monthly-trend",
    type: "trending-category",
    title: "4-Month Spending Trend",
    value: `${sign(change)}% over 4 months`,
    subtext: `Your overall spending has been ${up ? "climbing" : "declining"} - from ${formatCents(Math.round(first2Avg))} to ${formatCents(Math.round(last2Avg))} avg/month`,
    direction: up ? "up" : "down",
    color: up ? "warning" : "success",
  };
}

// ─── Colour + icon maps ───────────────────────────────────────────────────────

const COLOR_CLASSES: Record<Insight["color"], string> = {
  primary: "bg-primary/10 border-primary/25 text-primary",
  warning:
    "bg-[oklch(0.65_0.18_48_/_0.1)] border-[oklch(0.65_0.18_48_/_0.3)] text-[oklch(0.55_0.18_48)]",
  danger: "bg-destructive/10 border-destructive/25 text-destructive",
  success:
    "bg-[oklch(0.6_0.18_142_/_0.1)] border-[oklch(0.6_0.18_142_/_0.3)] text-[oklch(0.45_0.18_142)]",
  info: "bg-muted/60 border-border text-muted-foreground",
};

const VALUE_COLOR_CLASSES: Record<Insight["color"], string> = {
  primary: "text-primary",
  warning: "text-[oklch(0.55_0.18_48)]",
  danger: "text-destructive",
  success: "text-[oklch(0.45_0.18_142)]",
  info: "text-foreground",
};

function InsightIcon({
  color,
  direction,
  type,
}: {
  color: Insight["color"];
  direction?: Insight["direction"];
  type: Insight["type"];
}) {
  const cls = "w-5 h-5";
  if (type === "consecutive-overage") return <AlertTriangle className={cls} />;
  if (type === "busiest-day") return <Calendar className={cls} />;
  if (direction === "up") return <ArrowUpRight className={cls} />;
  if (direction === "down") return <ArrowDownRight className={cls} />;
  if (color === "warning") return <Flame className={cls} />;
  if (color === "success") return <TrendingDown className={cls} />;
  return <Minus className={cls} />;
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  const iconWrapper = COLOR_CLASSES[insight.color];
  const valueColor = VALUE_COLOR_CLASSES[insight.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-elevated transition-smooth flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${iconWrapper}`}
        >
          <InsightIcon
            color={insight.color}
            direction={insight.direction}
            type={insight.type}
          />
        </div>
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
            {insight.direction === "up" ? (
              <TrendingUp size={10} className="mr-0.5" />
            ) : (
              <TrendingDown size={10} className="mr-0.5" />
            )}
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
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <Lightbulb size={28} className="text-primary/70" />
      </div>
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
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Lightbulb size={17} className="text-primary" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-tight">
              Smart Insights
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Patterns detected from your spending history
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {isLoading ? (
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
              className="mt-8 bg-muted/40 border border-border rounded-2xl px-5 py-4 flex items-start gap-3"
            >
              <Lightbulb
                size={16}
                className="text-muted-foreground flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Insights are recalculated every time you visit this page using
                your latest expense data. Add more expenses across multiple
                months to unlock richer patterns.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}


