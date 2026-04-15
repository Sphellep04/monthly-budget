import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  LineChart as LineChartIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useBudgets,
  useCategoryTrend,
  useMonthlyTrend,
} from "../hooks/useBudget";
import { getMonthName } from "../types";

/* ─── Design-system chart palette ─── */
const CHART_PALETTE = [
  "oklch(0.52 0.15 250)", // primary blue
  "oklch(0.65 0.18 48)", // secondary orange
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
function CustomLineDot(props: { cx?: number; cy?: number; r?: number }) {
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

/* ─── Spending Trend Chart ─── */
function SpendingTrendChart() {
  const { data: trend, isLoading } = useMonthlyTrend(12);

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
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        data-ocid="charts.trend_empty_state"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-7 h-7 text-primary" />
        </div>
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
              stopColor="oklch(0.52 0.15 250)"
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
            fill: "oklch(0.52 0.15 250)",
            stroke: "oklch(var(--card))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Category Breakdown Chart ─── */
function CategoryBreakdownChart({
  budgetId,
  colorIndex,
}: {
  budgetId: bigint;
  colorIndex: number;
}) {
  const { data: trend, isLoading } = useCategoryTrend(budgetId, 6);
  const color = CHART_PALETTE[colorIndex % CHART_PALETTE.length];

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
        <BarChart2 className="w-6 h-6 text-muted-foreground mb-2 opacity-50" />
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
            <CustomTooltip
              valueFormatter={(v, name) =>
                name === "spent" ? `N$${v.toFixed(2)}` : `N$${v.toFixed(2)}`
              }
            />
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

/* ─── Section Header ─── */
function SectionHeader({
  icon,
  title,
  subtitle,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <h2 className="font-display text-base font-semibold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ─── Chart Card skeleton ─── */
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

/* ─── Main ChartsPage ─── */
export function ChartsPage() {
  const now = new Date();
  const { summaries, isLoading: budgetsLoading } = useBudgets(
    now.getFullYear(),
    now.getMonth() + 1,
  );

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto"
      data-ocid="charts.page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary opacity-70" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Analytics
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
            Spending Charts
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            Track your financial patterns with interactive charts — monthly
            totals, per-budget breakdowns, and 6-month trends at a glance.
          </p>
        </div>
      </div>

      {/* ── Monthly Trend ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        data-ocid="charts.monthly_trend.card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Card header strip */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <SectionHeader
            icon={<TrendingUp className="w-4.5 h-4.5" />}
            title="Total Spending Trend"
            subtitle="Your cumulative monthly spend over the past 12 months"
          />
          <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full shrink-0 mt-0.5">
            12 months
          </span>
        </div>
        <SpendingTrendChart />
        {/* Legend */}
        <div className="flex items-center gap-2 pt-1">
          <span
            className="inline-block w-8 h-[2.5px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.52 0.15 250), oklch(0.72 0.16 200))",
            }}
          />
          <span className="text-xs text-muted-foreground">
            Total monthly spend
          </span>
        </div>
      </motion.section>

      {/* ── Per-Budget Category Charts ── */}
      <motion.section
        className="space-y-5"
        data-ocid="charts.category_trends.section"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            icon={<BarChart2 className="w-4.5 h-4.5" />}
            title="Per-Budget Breakdown"
            subtitle="Compare actual spend vs. limit for each budget — last 6 months"
            iconBg="bg-secondary/10"
            iconColor="text-secondary"
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
          <div
            className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20"
            data-ocid="charts.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-5 shadow-inner-subtle">
              <LineChartIcon className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="font-display text-base font-semibold text-foreground mb-2">
              No budgets to visualize
            </p>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Create budget categories and start logging expenses — your
              spending charts will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((bs, i) => (
              <motion.div
                key={bs.budget.id.toString()}
                className="rounded-2xl border border-border bg-card p-5 shadow-subtle card-hover space-y-4"
                data-ocid={`charts.budget_chart.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.15 + i * 0.07,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Card header */}
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
    </motion.div>
  );
}
