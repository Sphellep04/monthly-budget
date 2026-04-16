import { c as createLucideIcon, a8 as useMonthlyTrend, aa as useCategoryBreakdown, ab as useDailySpending, i as useMonthlySummary, j as jsxRuntimeExports, aw as Lightbulb, S as Skeleton, h as TrendingUp, T as TriangleAlert } from "./index-5R5ykpDg.js";
import { B as Badge } from "./badge-QuoGU9KW.js";
import { f as formatCents } from "./index-DBqnxCSC.js";
import { m as motion } from "./proxy-C9gbNYb-.js";
import { T as TrendingDown } from "./trending-down-DB1fMm4d.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "m7 7 10 10", key: "1fmybs" }],
  ["path", { d: "M17 7v10H7", key: "6fjiku" }]
];
const ArrowDownRight = createLucideIcon("arrow-down-right", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
function pct(a, b) {
  if (b === 0) return 0;
  return Math.round((a - b) / b * 100);
}
function sign(n) {
  return n >= 0 ? `+${n}` : `${n}`;
}
function computeInsights(input) {
  const insights = [];
  const {
    trend12,
    currentBreakdown,
    prevBreakdown,
    prevPrevBreakdown,
    dailyCurrent,
    dailyPrev,
    currMonth,
    currYear
  } = input;
  const weekendWeekdayInsight = computeWeekendWeekday(
    dailyCurrent,
    dailyPrev,
    currYear,
    currMonth
  );
  if (weekendWeekdayInsight) insights.push(weekendWeekdayInsight);
  const trendingInsight = computeTrendingCategory(
    currentBreakdown,
    prevBreakdown
  );
  if (trendingInsight) insights.push(trendingInsight);
  const overageInsight = computeConsecutiveOverage(
    currentBreakdown,
    prevBreakdown,
    prevPrevBreakdown
  );
  if (overageInsight) insights.push(overageInsight);
  const busiestDay = computeBusiestDay(
    dailyCurrent,
    dailyPrev,
    currYear,
    currMonth
  );
  if (busiestDay) insights.push(busiestDay);
  const momInsight = computeMoMChange(currentBreakdown, prevBreakdown);
  if (momInsight) insights.push(momInsight);
  const trendInsight = computeMonthlyTrend(trend12);
  if (trendInsight) insights.push(trendInsight);
  return insights;
}
function computeWeekendWeekday(dailyCurrent, dailyPrev, year, month) {
  const allDays = [];
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
    color: higher ? "warning" : "success"
  };
}
function computeTrendingCategory(current, prev) {
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
    color: up ? "warning" : "success"
  };
}
function computeConsecutiveOverage(current, prev, prevPrev) {
  const overCategories = [];
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
    color: "danger"
  };
}
function computeBusiestDay(dailyCurrent, dailyPrev, year, month) {
  const dowTotals = new Array(7).fill(0);
  const dowCounts = new Array(7).fill(0);
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
  const avgByDow = dowTotals.map(
    (t, i) => dowCounts[i] > 0 ? t / dowCounts[i] : 0
  );
  const maxIdx = avgByDow.reduce((mi, v, i) => v > avgByDow[mi] ? i : mi, 0);
  const maxPct = Math.round(dowTotals[maxIdx] / totalSpent * 100);
  if (maxPct < 15) return null;
  return {
    id: "busiest-day",
    type: "busiest-day",
    title: "Highest Spending Day",
    value: `${DAY_NAMES[maxIdx]}s`,
    subtext: `${maxPct}% of tracked spending happens on ${DAY_NAMES[maxIdx]}s (avg ${formatCents(Math.round(avgByDow[maxIdx]))} per ${DAY_NAMES[maxIdx]})`,
    direction: "neutral",
    color: "info"
  };
}
function computeMoMChange(current, prev) {
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
    color: up ? "warning" : "success"
  };
}
function computeMonthlyTrend(trend12) {
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
    subtext: `Your overall spending has been ${up ? "climbing" : "declining"} — from ${formatCents(Math.round(first2Avg))} to ${formatCents(Math.round(last2Avg))} avg/month`,
    direction: up ? "up" : "down",
    color: up ? "warning" : "success"
  };
}
const COLOR_CLASSES = {
  primary: "bg-primary/10 border-primary/25 text-primary",
  warning: "bg-[oklch(0.65_0.18_48_/_0.1)] border-[oklch(0.65_0.18_48_/_0.3)] text-[oklch(0.55_0.18_48)]",
  danger: "bg-destructive/10 border-destructive/25 text-destructive",
  success: "bg-[oklch(0.6_0.18_142_/_0.1)] border-[oklch(0.6_0.18_142_/_0.3)] text-[oklch(0.45_0.18_142)]",
  info: "bg-muted/60 border-border text-muted-foreground"
};
const VALUE_COLOR_CLASSES = {
  primary: "text-primary",
  warning: "text-[oklch(0.55_0.18_48)]",
  danger: "text-destructive",
  success: "text-[oklch(0.45_0.18_142)]",
  info: "text-foreground"
};
function InsightIcon({
  color,
  direction,
  type
}) {
  const cls = "w-5 h-5";
  if (type === "consecutive-overage") return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: cls });
  if (type === "busiest-day") return /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: cls });
  if (direction === "up") return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: cls });
  if (direction === "down") return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: cls });
  if (color === "warning") return /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: cls });
  if (color === "success") return /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: cls });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: cls });
}
function InsightCard({
  insight,
  index
}) {
  const iconWrapper = COLOR_CLASSES[insight.color];
  const valueColor = VALUE_COLOR_CLASSES[insight.color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-elevated transition-smooth flex flex-col gap-3",
      "data-ocid": `insights.card.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${iconWrapper}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                InsightIcon,
                {
                  color: insight.color,
                  direction: insight.direction,
                  type: insight.type
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide leading-none mb-1", children: insight.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xl font-bold font-display leading-tight truncate ${valueColor}`,
                children: insight.value
              }
            )
          ] }),
          insight.direction && insight.direction !== "neutral" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `text-[10px] font-bold flex-shrink-0 ${insight.direction === "up" ? "border-destructive/40 text-destructive bg-destructive/8" : "border-[oklch(0.6_0.18_142_/_0.4)] text-[oklch(0.45_0.18_142)] bg-[oklch(0.6_0.18_142_/_0.08)]"}`,
              children: [
                insight.direction === "up" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 10, className: "mr-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 10, className: "mr-0.5" }),
                insight.direction === "up" ? "Rising" : "Falling"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: insight.subtext })
      ]
    }
  );
}
function InsightsLoader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card border border-border rounded-2xl p-5 space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5" })
      ]
    },
    k
  )) });
}
function EmptyInsights() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center py-24 text-center px-6",
      "data-ocid": "insights.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 28, className: "text-primary/70" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold font-display text-foreground mb-2", children: "No insights yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm leading-relaxed", children: "Keep tracking your expenses — insights will appear as patterns emerge across your spending history." })
      ]
    }
  );
}
function InsightsPage() {
  const now = /* @__PURE__ */ new Date();
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
  const monthlySummary = useMonthlySummary(currYear, currMonth);
  const isLoading = trend12.isLoading || breakdownCurr.isLoading || breakdownPrev.isLoading || breakdownPrevPrev.isLoading || dailyCurr.isLoading || dailyPrev.isLoading || monthlySummary.isLoading;
  const insights = !isLoading && trend12.data && breakdownCurr.data && breakdownPrev.data && breakdownPrevPrev.data && dailyCurr.data && dailyPrev.data ? computeInsights({
    trend12: trend12.data,
    currentBreakdown: breakdownCurr.data,
    prevBreakdown: breakdownPrev.data,
    prevPrevBreakdown: breakdownPrevPrev.data,
    dailyCurrent: dailyCurr.data,
    dailyPrev: dailyPrev.data,
    currMonth,
    currYear
  }) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", "data-ocid": "insights.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.3 },
        className: "flex items-center gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { size: 17, className: "text-primary", strokeWidth: 2.2 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground leading-tight", children: "Smart Insights" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Patterns detected from your spending history" })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6 max-w-7xl mx-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(InsightsLoader, {}) : insights.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyInsights, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          insights.length,
          " insight",
          insights.length !== 1 ? "s" : "",
          " ",
          "detected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] border-primary/30 text-primary bg-primary/8",
            children: "Updated now"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
          "data-ocid": "insights.list",
          children: insights.map((insight, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: stable computed list
            /* @__PURE__ */ jsxRuntimeExports.jsx(InsightCard, { insight, index: i }, insight.id)
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: insights.length * 0.07 + 0.15 },
          className: "mt-8 bg-muted/40 border border-border rounded-2xl px-5 py-4 flex items-start gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lightbulb,
              {
                size: 16,
                className: "text-muted-foreground flex-shrink-0 mt-0.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Insights are recalculated every time you visit this page using your latest expense data. Add more expenses across multiple months to unlock richer patterns." })
          ]
        }
      )
    ] }) })
  ] });
}
export {
  InsightsPage
};
