import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthSelector } from "../components/MonthSelector";
import { QueryErrorState } from "../components/QueryErrorState";
import {
  useBudgets,
  useCategoryBreakdown,
  useCategoryTrend,
  useDailySpending,
  useMonthlyTrend,
} from "../hooks/useBudget";
import { formatCents, getMonthName } from "../types";

/* ─── Design-system chart palette ─── */
const CHART_PALETTE = [
  "oklch(0.42 0.12 150)", // primary forest green
  "oklch(0.58 0.14 35)", // secondary terracotta
  "oklch(0.6 0.18 142)", // success green
  "oklch(0.62 0.20 82)", // warm yellow
  "oklch(0.55 0.22 300)", // violet
  "oklch(0.58 0.20 26)", // red-orange
];

/* ─── Helpers ─── */
function formatMonthLabel(year: bigint, month: bigint) {
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function formatCurrency(v: number) {
  return `N$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/* ─── Custom Tooltip ─── */
interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number, name: string) => string;
}

function CustomTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter ? labelFormatter(label ?? "") : label;

  return (
    <div
      className="rounded-xl border border-border bg-card px-4 py-3 shadow-elevated"
      style={{ minWidth: 140 }}
    >
      {displayLabel && (
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          {displayLabel}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: entry.color ?? "oklch(var(--primary))" }}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {valueFormatter
                ? valueFormatter(entry.value, entry.name)
                : `N$${Number(entry.value).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Axis tick styles ─── */
const axisTickStyle = {
  fontSize: 11,
  fill: "oklch(var(--muted-foreground))",
  fontFamily: "var(--font-body)",
};

/* ─── Custom Line Dot ─── */
function CustomLineDot(props: { cx?: number; cy?: number }) {
  const { cx = 0, cy = 0 } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="oklch(var(--primary))"
      stroke="oklch(var(--card))"
      strokeWidth={2}
    />
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-foreground leading-tight">
        {title}
      </h2>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

/* ─── Chart Card Skeleton ─── */
function ChartCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-subtle space-y-4">
      <div className="flex items-center gap-2.5">
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-3 w-16 rounded ml-auto" />
      </div>
      <Skeleton className="h-[180px] w-full rounded-xl" />
    </div>
  );
}

/* ─── Spending Trend Chart (12 months global) ─── */
function SpendingTrendChart() {
  const { data: trend, isLoading, isError, refetch } = useMonthlyTrend(12);

  if (isError) {
    return <QueryErrorState onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-[260px] w-full rounded-xl" />
      </div>
    );
  }

  const chartData = (trend ?? [])
    .sort((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      return Number(a.month) - Number(b.month);
    })
    .map((p) => ({
      month: formatMonthLabel(p.year, p.month),
      total: Number(p.totalSpentCents) / 100,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-display text-sm font-semibold text-foreground mb-1">
          No trend data yet
        </p>
        <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
          Start logging expenses to see your spending trend over the past 12
          months.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor="oklch(0.42 0.12 150)"
              stopOpacity={0.9}
            />
            <stop
              offset="100%"
              stopColor="oklch(0.72 0.16 200)"
              stopOpacity={0.9}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="oklch(var(--border))"
          opacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          dy={6}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          width={62}
        />
        <Tooltip
          content={
            <CustomTooltip valueFormatter={(v) => `N$${v.toFixed(2)}`} />
          }
          cursor={{
            stroke: "oklch(var(--border))",
            strokeWidth: 1,
            strokeDasharray: "4 3",
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="url(#lineGradient)"
          strokeWidth={2.5}
          dot={<CustomLineDot />}
          activeDot={{
            r: 6,
            fill: "oklch(0.42 0.12 150)",
            stroke: "oklch(var(--card))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Per-Budget 6-Month Trend Chart ─── */
function CategoryBreakdownChart({
  budgetId,
  colorIndex,
}: {
  budgetId: bigint;
  colorIndex: number;
}) {
  const {
    data: trend,
    isLoading,
    isError,
    refetch,
  } = useCategoryTrend(budgetId, 6);
  const color = CHART_PALETTE[colorIndex % CHART_PALETTE.length];

  if (isError) {
    return <QueryErrorState onRetry={refetch} />;
  }

  if (isLoading) {
    return <Skeleton className="h-[180px] w-full rounded-xl" />;
  }

  const chartData = (trend ?? [])
    .sort((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      return Number(a.month) - Number(b.month);
    })
    .map((p) => ({
      month: formatMonthLabel(p.year, p.month),
      spent: Number(p.spentCents) / 100,
      limit: Number(p.limitCents) / 100,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[160px] text-center">
        <p className="text-xs text-muted-foreground">No history yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, left: 0, bottom: 4 }}
        barGap={3}
      >
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="oklch(var(--border))"
          opacity={0.55}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ ...axisTickStyle, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          dy={4}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ ...axisTickStyle, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          content={
            <CustomTooltip valueFormatter={(v) => `N$${v.toFixed(2)}`} />
          }
          cursor={{ fill: "oklch(var(--muted) / 0.35)", radius: 6 }}
        />
        <Bar
          dataKey="limit"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
          fill="oklch(var(--muted))"
        >
          {chartData.map((entry) => (
            <Cell
              key={`limit-${entry.month}`}
              fill="oklch(var(--muted))"
              opacity={0.8}
            />
          ))}
        </Bar>
        <Bar dataKey="spent" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {chartData.map((entry) => (
            <Cell key={`spent-${entry.month}`} fill={color} opacity={0.9} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Donut/Pie Chart for selected month ─── */
function MonthlyPieChart({ year, month }: { year: number; month: number }) {
  const {
    data: breakdown,
    isLoading,
    isError,
    refetch,
  } = useCategoryBreakdown(year, month);

  if (isError) {
    return <QueryErrorState onRetry={refetch} />;
  }

  if (isLoading) {
    return <Skeleton className="h-[260px] w-full rounded-xl" />;
  }

  const chartData = (breakdown ?? [])
    .filter((p) => Number(p.amountCents) > 0)
    .map((p, i) => ({
      name: p.name,
      value: Number(p.amountCents) / 100,
      color: p.color || CHART_PALETTE[i % CHART_PALETTE.length],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-display text-sm font-semibold text-foreground mb-1">
          No spending this month
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
          Log expenses to see how your spending is distributed across
          categories.
        </p>
      </div>
    );
  }

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative shrink-0">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={`cell-${entry.name}-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={
                <CustomTooltip valueFormatter={(v) => `N$${v.toFixed(2)}`} />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Total
          </span>
          <span className="font-display text-base font-bold text-foreground leading-tight">
            {formatCents(Math.round(total * 100))}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-foreground truncate flex-1 min-w-0">
              {entry.name}
            </span>
            <span className="text-xs font-semibold text-foreground tabular-nums shrink-0">
              {formatCents(Math.round(entry.value * 100))}
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 w-10 text-right">
              {total > 0
                ? `${((entry.value / total) * 100).toFixed(0)}%`
                : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Budget vs Actual side-by-side bar chart ─── */
function BudgetVsActualChart({ year, month }: { year: number; month: number }) {
  const {
    summaries,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useBudgets(year, month);
  const {
    data: breakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
    refetch: refetchBreakdown,
  } = useCategoryBreakdown(year, month);

  if (summaryError || breakdownError) {
    return (
      <QueryErrorState
        onRetry={() => {
          refetchSummary();
          refetchBreakdown();
        }}
      />
    );
  }

  if (summaryLoading || breakdownLoading) {
    return <Skeleton className="h-[260px] w-full rounded-xl" />;
  }

  const breakdownMap = new Map(
    (breakdown ?? []).map((p) => [p.budgetId, Number(p.amountCents) / 100]),
  );

  const chartData = summaries.map((bs) => ({
    name:
      bs.budget.name.length > 10
        ? `${bs.budget.name.slice(0, 10)}…`
        : bs.budget.name,
    Budget: Number(bs.budget.limitCents) / 100,
    Spent:
      breakdownMap.get(bs.budget.id.toString()) ??
      Number(bs.totalSpentCents) / 100,
    color: bs.budget.color || CHART_PALETTE[0],
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-display text-sm font-semibold text-foreground mb-1">
          No budgets this month
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
          Create budgets for this month to compare limits with actual spending.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="oklch(var(--border))"
          opacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          dy={6}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          width={62}
        />
        <Tooltip
          content={
            <CustomTooltip valueFormatter={(v) => `N$${v.toFixed(2)}`} />
          }
          cursor={{ fill: "oklch(var(--muted) / 0.25)", radius: 6 }}
        />
        <Legend
          wrapperStyle={{
            fontSize: 11,
            color: "oklch(var(--muted-foreground))",
          }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey="Budget"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          fill="oklch(var(--muted))"
          opacity={0.8}
        />
        <Bar dataKey="Spent" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {chartData.map((entry, i) => (
            <Cell
              key={`spent-${entry.name}-${i}`}
              fill={entry.color}
              opacity={0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Daily Spending Line Chart ─── */
function DailySpendingChart({ year, month }: { year: number; month: number }) {
  const {
    data: daily,
    isLoading,
    isError,
    refetch,
  } = useDailySpending(year, month);

  if (isError) {
    return <QueryErrorState onRetry={refetch} />;
  }

  if (isLoading) {
    return <Skeleton className="h-[260px] w-full rounded-xl" />;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const spendMap = new Map(
    (daily ?? []).map((p) => [Number(p.day), Number(p.amountCents) / 100]),
  );

  const chartData = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    spent: spendMap.get(i + 1) ?? 0,
  }));

  const hasData = chartData.some((d) => d.spent > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="font-display text-sm font-semibold text-foreground mb-1">
          No daily data yet
        </p>
        <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
          Log expenses this month to see your day-by-day spending pattern.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
      >
        <defs>
          <linearGradient id="dailyGradient" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor="oklch(0.6 0.18 142)"
              stopOpacity={0.9}
            />
            <stop
              offset="100%"
              stopColor="oklch(0.42 0.12 150)"
              stopOpacity={0.9}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 6"
          stroke="oklch(var(--border))"
          opacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          dy={6}
          tickFormatter={(v: number) =>
            v % 5 === 1 || v === daysInMonth ? String(v) : ""
          }
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={axisTickStyle}
          tickLine={false}
          axisLine={false}
          width={62}
        />
        <Tooltip
          content={
            <CustomTooltip
              labelFormatter={(label) => `Day ${label}`}
              valueFormatter={(v) => `N$${v.toFixed(2)}`}
            />
          }
          cursor={{
            stroke: "oklch(var(--border))",
            strokeWidth: 1,
            strokeDasharray: "4 3",
          }}
        />
        <Line
          type="monotone"
          dataKey="spent"
          stroke="url(#dailyGradient)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: "oklch(0.6 0.18 142)",
            stroke: "oklch(var(--card))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Main ChartsPage ─── */
export function ChartsPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const { summaries, isLoading: budgetsLoading } = useBudgets(
    now.getFullYear(),
    now.getMonth() + 1,
  );

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Analytics
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
            Spending Charts
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            Track your financial patterns - monthly totals, per-budget
            breakdowns, daily trends, and more.
          </p>
        </div>
        <div className="shrink-0 mt-1">
          <MonthSelector
            year={selectedYear}
            month={selectedMonth}
            onChange={(y, m) => {
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
          />
        </div>
      </div>

      {/* ── Monthly Trend (always 12-month global) ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <SectionHeader
            title="Total Spending Trend"
            subtitle="Your cumulative monthly spend over the past 12 months"
          />
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full shrink-0 mt-0.5">
            12 months
          </span>
        </div>
        <SpendingTrendChart />
        <div className="flex items-center gap-2 pt-1">
          <span
            className="inline-block w-8 h-[2.5px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.42 0.12 150), oklch(0.72 0.16 200))",
            }}
          />
          <span className="text-xs text-muted-foreground">
            Total monthly spend
          </span>
        </div>
      </motion.section>

      {/* ── Per-Budget Category Trends ── */}
      <motion.section
        className="space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            title="Per-Budget Breakdown"
            subtitle="Compare actual spend vs. limit for each budget - last 6 months"
          />
          <div className="flex items-center gap-3 shrink-0 mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-muted opacity-80" />
              <span className="text-xs text-muted-foreground">Limit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">Spent</span>
            </div>
          </div>
        </div>

        {budgetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["a", "b", "c", "d"] as const).map((k) => (
              <ChartCardSkeleton key={k} />
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20">
            <p className="font-display text-base font-semibold text-foreground mb-2">
              No budgets to visualize
            </p>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Create budget categories and start logging expenses - your
              spending charts will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((bs, i) => (
              <motion.div
                key={bs.budget.id.toString()}
                className="rounded-2xl border border-border bg-card p-5 shadow-subtle card-hover space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.15 + i * 0.07,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: bs.budget.color }}
                  />
                  <h3 className="font-display text-sm font-semibold text-foreground truncate min-w-0">
                    {bs.budget.name}
                  </h3>
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full ml-auto shrink-0 capitalize">
                    {bs.budget.category}
                  </span>
                </div>
                <CategoryBreakdownChart
                  budgetId={bs.budget.id}
                  colorIndex={i}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Donut: Category Spending Breakdown ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <SectionHeader
            title="Category Spending Breakdown"
            subtitle={`How your spending is distributed across categories - ${getMonthName(selectedMonth)} ${selectedYear}`}
          />
        </div>
        <MonthlyPieChart year={selectedYear} month={selectedMonth} />
      </motion.section>

      {/* ── Budget vs Actual ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <SectionHeader
            title="Budget vs Actual"
            subtitle={`Side-by-side comparison of limits vs real spend - ${getMonthName(selectedMonth)} ${selectedYear}`}
          />
        </div>
        <BudgetVsActualChart year={selectedYear} month={selectedMonth} />
      </motion.section>

      {/* ── Daily Spending ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <SectionHeader
            title="Daily Spending"
            subtitle={`Day-by-day spending pattern - ${getMonthName(selectedMonth)} ${selectedYear}`}
          />
        </div>
        <DailySpendingChart year={selectedYear} month={selectedMonth} />
        <div className="flex items-center gap-2 pt-1">
          <span
            className="inline-block w-8 h-[2.5px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.6 0.18 142), oklch(0.42 0.12 150))",
            }}
          />
          <span className="text-xs text-muted-foreground">Daily spend</span>
        </div>
      </motion.section>
    </motion.div>
  );
}
