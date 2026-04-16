import { c as createLucideIcon, as as useSearch, at as useNavigate, au as useAnnualSummary, j as jsxRuntimeExports, U as CalendarDays, W as Wallet, av as ChartColumn, h as TrendingUp, S as Skeleton } from "./index-5R5ykpDg.js";
import { B as Badge } from "./badge-QuoGU9KW.js";
import { f as formatCents, a as getMonthName } from "./index-DBqnxCSC.js";
import { m as motion } from "./proxy-C9gbNYb-.js";
import { C as ChevronLeft } from "./chevron-left-BPKu9cGl.js";
import { C as ChevronRight } from "./chevron-right-B-fg7cii.js";
import { T as TrendingDown } from "./trending-down-DB1fMm4d.js";
import { R as ResponsiveContainer, I as BarChart, X as XAxis, Y as YAxis, H as Tooltip, J as Bar, s as Cell } from "./BarChart-DIUej5HJ.js";
import { C as CartesianGrid } from "./CartesianGrid-C_0NrP2f.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode);
const axisTickStyle = {
  fontSize: 11,
  fill: "oklch(var(--muted-foreground))",
  fontFamily: "var(--font-body)"
};
const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function formatCurrency(v) {
  return `N$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function CustomTooltip({ active, payload, label }) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card px-4 py-3 shadow-elevated",
      style: { minWidth: 140 },
      children: [
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: payload.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2 h-2 rounded-full shrink-0",
                    style: { background: entry.color ?? "oklch(var(--primary))" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground capitalize", children: entry.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground tabular-nums", children: `N$${Number(entry.value).toFixed(2)}` })
            ]
          },
          entry.name
        )) })
      ]
    }
  );
}
function StatCard({
  icon,
  label,
  value,
  sub,
  iconBg,
  iconColor,
  delay = 0,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "rounded-2xl border border-border bg-card p-5 shadow-elevated space-y-3",
      "data-ocid": ocid,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: iconColor, children: icon })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground leading-tight mt-0.5", children: value }),
          sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: sub })
        ] })
      ]
    }
  );
}
function StatCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-subtle space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 rounded" })
    ] })
  ] });
}
function AnnualBarChart({
  data,
  isLoading
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[280px] w-full rounded-xl" });
  }
  const hasData = data.some((d) => d.spent > 0);
  if (!hasData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "annual.chart_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-foreground mb-1", children: "No spending data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[220px] leading-relaxed", children: "Log expenses throughout the year to see your annual spending pattern." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    BarChart,
    {
      data,
      margin: { top: 8, right: 16, left: 0, bottom: 4 },
      barGap: 4,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: data.map((entry) => {
          const ratio = entry.spentRatio;
          const color = ratio > 1 ? "oklch(0.58 0.20 26)" : ratio > 0.75 ? "oklch(0.62 0.20 82)" : "oklch(0.52 0.15 250)";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "linearGradient",
            {
              id: `bar-grad-${entry.month}`,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: 0.95 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: 0.7 })
              ]
            },
            `grad-${entry.month}`
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartesianGrid,
          {
            strokeDasharray: "3 6",
            stroke: "oklch(var(--border))",
            opacity: 0.6,
            vertical: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "month",
            tick: axisTickStyle,
            tickLine: false,
            axisLine: false,
            dy: 6
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            tickFormatter: formatCurrency,
            tick: axisTickStyle,
            tickLine: false,
            axisLine: false,
            width: 64
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}),
            cursor: { fill: "oklch(var(--muted) / 0.25)", radius: 6 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "spent", radius: [5, 5, 0, 0], maxBarSize: 40, name: "spent", children: data.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Cell,
          {
            fill: `url(#bar-grad-${entry.month})`
          },
          `bar-${entry.month}`
        )) })
      ]
    }
  ) });
}
const MONTH_SKELETON_KEYS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];
function MonthTableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: MONTH_SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 rounded ml-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full" })
      ]
    },
    k
  )) });
}
function MonthTable({
  rows,
  year,
  isLoading
}) {
  const navigate = useNavigate();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(MonthTableSkeleton, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto -mx-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[520px] grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 mb-1", children: ["Month", "Budgeted", "Spent", "Remaining", "Status"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]",
        children: h
      },
      h
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-[520px] space-y-1", "data-ocid": "annual.month_table", children: rows.map((row, i) => {
      const isFuture = row.totalBudgetCents === 0 && row.totalSpentCents === 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          type: "button",
          "data-ocid": `annual.month_row.${i + 1}`,
          className: "w-full grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center px-4 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted/40 hover:border-border transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
          onClick: () => navigate({
            to: "/charts",
            search: { year: row.year, month: row.monthNum }
          }),
          initial: { opacity: 0, x: -6 },
          animate: { opacity: 1, x: 0 },
          transition: {
            duration: 0.3,
            delay: i * 0.035,
            ease: [0.4, 0, 0.2, 1]
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-sm text-foreground", children: [
              getMonthName(row.monthNum).slice(0, 3),
              " ",
              year
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm tabular-nums text-muted-foreground", children: isFuture ? "—" : formatCents(row.totalBudgetCents) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm tabular-nums font-medium ${row.isOverBudget ? "text-destructive" : "text-foreground"}`,
                children: isFuture ? "—" : formatCents(row.totalSpentCents)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm tabular-nums ${row.remainingCents < 0 ? "text-destructive" : "text-muted-foreground"}`,
                children: isFuture ? "—" : formatCents(Math.abs(row.remainingCents))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: isFuture ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] font-medium text-muted-foreground/60 border-border/50",
                children: "No Data"
              }
            ) : row.isOverBudget ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] font-semibold bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20", children: "Over Budget" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15 dark:text-emerald-400", children: "On Track" }) })
          ]
        },
        row.monthNum
      );
    }) })
  ] });
}
function YearTotalsRow({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 border-b border-border/50 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-sm font-semibold tabular-nums ${highlight ? "text-destructive" : "text-foreground"}`,
        children: value
      }
    )
  ] });
}
function AnnualSummaryPage() {
  const now = /* @__PURE__ */ new Date();
  const currentYear = now.getFullYear();
  const search = useSearch({ strict: false });
  const rawYear = typeof (search == null ? void 0 : search.year) === "number" ? search.year : currentYear;
  const selectedYear = Math.min(rawYear, currentYear);
  const navigate = useNavigate();
  function prevYear() {
    navigate({ to: "/annual-summary", search: { year: selectedYear - 1 } });
  }
  function nextYear() {
    if (selectedYear >= currentYear) return;
    navigate({ to: "/annual-summary", search: { year: selectedYear + 1 } });
  }
  const { data: annualData, isLoading } = useAnnualSummary(selectedYear);
  const monthRows = (annualData == null ? void 0 : annualData.monthRows) ?? [];
  const stats = (annualData == null ? void 0 : annualData.stats) ?? {
    totalYearSpentCents: 0,
    totalYearBudgetedCents: 0,
    avgMonthlySpentCents: 0,
    bestMonth: null,
    worstMonth: null,
    highestOverspendMonth: null
  };
  const barData = monthRows.map((row) => ({
    month: SHORT_MONTHS[row.monthNum - 1],
    spent: row.totalSpentCents / 100,
    budgeted: row.totalBudgetCents / 100,
    spentRatio: row.totalBudgetCents > 0 ? row.totalSpentCents / row.totalBudgetCents : 0
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto",
      "data-ocid": "annual.page",
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4 text-primary opacity-70" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary uppercase tracking-wider", children: "Year in Review" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground leading-tight", children: "Annual Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed", children: [
              "A full-year overview of your budgets, spending patterns, and financial performance for ",
              selectedYear,
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 rounded-xl border border-border bg-card px-1 py-1 shadow-subtle shrink-0 mt-1",
              "data-ocid": "annual.year_selector",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: prevYear,
                    className: "flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted transition-colors",
                    "aria-label": "Previous year",
                    "data-ocid": "annual.year_prev",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 15, className: "text-muted-foreground" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-[60px] text-center text-[0.8125rem] font-semibold text-foreground px-1 select-none", children: selectedYear }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: nextYear,
                    disabled: selectedYear >= currentYear,
                    className: "flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                    "aria-label": "Next year",
                    "data-ocid": "annual.year_next",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "text-muted-foreground" })
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
            "data-ocid": "annual.stats_section",
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {})
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  ocid: "annual.stat_total_spent",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 18 }),
                  label: "Total Spent",
                  value: formatCents(stats.totalYearSpentCents),
                  sub: `Across all ${selectedYear} expenses`,
                  iconBg: "bg-primary/10",
                  iconColor: "text-primary",
                  delay: 0.08
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  ocid: "annual.stat_avg_monthly",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 18 }),
                  label: "Avg Monthly Spend",
                  value: formatCents(stats.avgMonthlySpentCents),
                  sub: "Average across active months",
                  iconBg: "bg-secondary/10",
                  iconColor: "text-secondary",
                  delay: 0.12
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  ocid: "annual.stat_best_month",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 18 }),
                  label: "Best Month",
                  value: stats.bestMonth ? getMonthName(stats.bestMonth.monthNum) : "—",
                  sub: stats.bestMonth ? formatCents(stats.bestMonth.totalSpentCents) : "No data yet",
                  iconBg: "bg-emerald-500/10",
                  iconColor: "text-emerald-600 dark:text-emerald-400",
                  delay: 0.16
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  ocid: "annual.stat_worst_month",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
                  label: "Worst Month",
                  value: stats.worstMonth ? getMonthName(stats.worstMonth.monthNum) : "—",
                  sub: stats.worstMonth ? formatCents(stats.worstMonth.totalSpentCents) : "No data yet",
                  iconBg: "bg-destructive/10",
                  iconColor: "text-destructive",
                  delay: 0.2
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.section,
          {
            className: "rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5",
            "data-ocid": "annual.bar_chart.section",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.24, ease: [0.4, 0, 0.2, 1] },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 pb-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4.5 h-4.5 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-base font-semibold text-foreground leading-tight", children: [
                      "Monthly Spending — ",
                      selectedYear
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: "Total spend per month. Bars turn amber near limit, red when over." })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0 mt-0.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary" }),
                    "On track"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-2 h-2 rounded-full",
                        style: { background: "oklch(0.62 0.20 82)" }
                      }
                    ),
                    "Near limit"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "w-2 h-2 rounded-full",
                        style: { background: "oklch(0.58 0.20 26)" }
                      }
                    ),
                    "Over"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnnualBarChart, { data: barData, isLoading })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.section,
          {
            className: "rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5",
            "data-ocid": "annual.month_table.section",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pb-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4.5 h-4.5 text-secondary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground leading-tight", children: "Month-by-Month Breakdown" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: "Click any month to view its detailed charts and category breakdown." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MonthTable,
                {
                  rows: monthRows,
                  year: selectedYear,
                  isLoading
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.section,
          {
            className: "rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-2",
            "data-ocid": "annual.yearly_totals.section",
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.36, ease: [0.4, 0, 0.2, 1] },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pb-4 border-b border-border mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4.5 h-4.5 text-accent-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground leading-tight", children: "Yearly Totals" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed", children: "Aggregated financial stats across the entire year." })
                ] })
              ] }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
                "total-spent",
                "total-budgeted",
                "avg-monthly",
                "highest-overspend"
              ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex justify-between items-center py-3 border-b border-border/50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 rounded" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 rounded" })
                  ]
                },
                k
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YearTotalsRow,
                  {
                    label: "Year Total Spent",
                    value: formatCents(stats.totalYearSpentCents)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YearTotalsRow,
                  {
                    label: "Year Total Budgeted",
                    value: formatCents(stats.totalYearBudgetedCents)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YearTotalsRow,
                  {
                    label: "Year Average Monthly Spend",
                    value: formatCents(stats.avgMonthlySpentCents)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  YearTotalsRow,
                  {
                    label: "Highest Overspend Month",
                    value: stats.highestOverspendMonth ? `${getMonthName(stats.highestOverspendMonth.monthNum)} (${formatCents(
                      Math.abs(stats.highestOverspendMonth.remainingCents)
                    )} over)` : "None — great job!",
                    highlight: !!stats.highestOverspendMonth
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  AnnualSummaryPage
};
