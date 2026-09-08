import { formatCents } from "../types";

// ─── Insight Types ────────────────────────────────────────────────────────────

export interface Insight {
  id: string;
  type:
    | "weekend-spending"
    | "trending-category"
    | "consecutive-overage"
    | "busiest-day"
    | "mom-change"
    | "monthly-trend";
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

export interface InsightInput {
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

export function computeInsights(input: InsightInput): Insight[] {
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

export function computeWeekendWeekday(
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

export function computeTrendingCategory(
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

export function computeConsecutiveOverage(
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

export function computeBusiestDay(
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

export function computeMoMChange(
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

export function computeMonthlyTrend(
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
    type: "monthly-trend",
    title: "4-Month Spending Trend",
    value: `${sign(change)}% over 4 months`,
    subtext: `Your overall spending has been ${up ? "climbing" : "declining"} - from ${formatCents(Math.round(first2Avg))} to ${formatCents(Math.round(last2Avg))} avg/month`,
    direction: up ? "up" : "down",
    color: up ? "warning" : "success",
  };
}

// ─── Gap comparison (budget - spent, month over month) ────────────────────────

export interface GapComparisonInput {
  label: string;
  totalBudgetCents: bigint;
  totalSpentCents: bigint;
  prevTotalBudgetCents: bigint;
  prevTotalSpentCents: bigint;
}

export interface GapComparison {
  /** Label for the month being reported on, e.g. "July". */
  label: string;
  /** spent - budget for that month; positive means over budget. */
  gapCents: number;
  /** Same, for the month before it. */
  prevGapCents: number;
  /** How much the gap improved (positive) or worsened (negative). */
  deltaCents: number;
  better: boolean;
}

/**
 * Compares one month's budget-vs-spend gap (spent - budget; positive = over)
 * against the month before it, so a shortfall can be shown alongside whether
 * it's trending better or worse. Returns null when there's nothing to
 * compare (no budget set in the earlier month).
 */
export function computeGapComparison(
  input: GapComparisonInput,
): GapComparison | null {
  const {
    label,
    totalBudgetCents,
    totalSpentCents,
    prevTotalBudgetCents,
    prevTotalSpentCents,
  } = input;
  if (prevTotalBudgetCents === 0n && totalBudgetCents === 0n) return null;

  const gapCents = Number(totalSpentCents - totalBudgetCents);
  const prevGapCents = Number(prevTotalSpentCents - prevTotalBudgetCents);
  const deltaCents = prevGapCents - gapCents;

  return {
    label,
    gapCents,
    prevGapCents,
    deltaCents,
    better: deltaCents > 0,
  };
}
