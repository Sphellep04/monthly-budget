import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAnnualSummary } from "../hooks/useBudget";
import { formatCents, getMonthName } from "../types";

/* ─── Axis tick styles ─── */
const axisTickStyle = {
  fontSize: 11,
  fill: "oklch(var(--muted-foreground))",
  fontFamily: "var(--font-body)",
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
  "Dec",
];

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
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-border bg-card px-4 py-3 shadow-elevated"
      style={{ minWidth: 140 }}
    >
      {label && (
        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          {label}
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
              {`N$${Number(entry.value).toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
  iconColor: string;
  delay?: number;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  iconBg,
  iconColor,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      className="rounded-2xl border border-border bg-card p-5 shadow-elevated space-y-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="font-display text-2xl font-bold text-foreground leading-tight mt-0.5">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ─── Skeleton Stat Card ─── */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-subtle space-y-3">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-7 w-28 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

/* ─── Annual Bar Chart ─── */
interface MonthBarData {
  month: string;
  spent: number;
  budgeted: number;
  spentRatio: number;
}

function AnnualBarChart({
  data,
  isLoading,
}: { data: MonthBarData[]; isLoading: boolean }) {
  if (isLoading) {
    return <Skeleton className="h-[280px] w-full rounded-xl" />;
  }

  const hasData = data.some((d) => d.spent > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>
        <p className="font-display text-sm font-semibold text-foreground mb-1">
          No spending data
        </p>
        <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
          Log expenses throughout the year to see your annual spending pattern.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        barGap={4}
      >
        <defs>
          {data.map((entry) => {
            const ratio = entry.spentRatio;
            const color =
              ratio > 1
                ? "oklch(0.58 0.20 26)"
                : ratio > 0.75
                  ? "oklch(0.62 0.20 82)"
                  : "oklch(0.52 0.15 250)";
            return (
              <linearGradient
                key={`grad-${entry.month}`}
                id={`bar-grad-${entry.month}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
              </linearGradient>
            );
          })}
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
          width={64}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "oklch(var(--muted) / 0.25)", radius: 6 }}
        />
        <Bar dataKey="spent" radius={[5, 5, 0, 0]} maxBarSize={40} name="spent">
          {data.map((entry) => (
            <Cell
              key={`bar-${entry.month}`}
              fill={`url(#bar-grad-${entry.month})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Month Table Row ─── */
export interface MonthRow {
  monthNum: number;
  year: number;
  totalBudgetCents: number;
  totalSpentCents: number;
  remainingCents: number;
  isOverBudget: boolean;
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
  "dec",
] as const;

function MonthTableSkeleton() {
  return (
    <div className="space-y-2">
      {MONTH_SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/50"
        >
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-20 rounded ml-auto" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function MonthTable({
  rows,
  year,
  isLoading,
}: {
  rows: MonthRow[];
  year: number;
  isLoading: boolean;
}) {
  const navigate = useNavigate();

  if (isLoading) return <MonthTableSkeleton />;

  return (
    <div className="overflow-x-auto -mx-1">
      {/* Header */}
      <div className="min-w-[520px] grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 px-4 py-2 mb-1">
        {["Month", "Budgeted", "Spent", "Remaining", "Status"].map((h) => (
          <span
            key={h}
            className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]"
          >
            {h}
          </span>
        ))}
      </div>
      <div className="min-w-[520px] space-y-1">
        {rows.map((row, i) => {
          const isFuture =
            row.totalBudgetCents === 0 && row.totalSpentCents === 0;
          return (
            <motion.button
              key={row.monthNum}
              type="button"
              className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center px-4 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted/40 hover:border-border transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              onClick={() =>
                navigate({
                  to: "/charts",
                  search: { year: row.year, month: row.monthNum },
                })
              }
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.035,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <span className="font-medium text-sm text-foreground">
                {getMonthName(row.monthNum).slice(0, 3)} {year}
              </span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {isFuture ? "-" : formatCents(row.totalBudgetCents)}
              </span>
              <span
                className={`text-sm tabular-nums font-medium ${
                  row.isOverBudget ? "text-destructive" : "text-foreground"
                }`}
              >
                {isFuture ? "-" : formatCents(row.totalSpentCents)}
              </span>
              <span
                className={`text-sm tabular-nums ${
                  row.remainingCents < 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {isFuture ? "-" : formatCents(Math.abs(row.remainingCents))}
              </span>
              <div className="flex justify-end">
                {isFuture ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium text-muted-foreground/60 border-border/50"
                  >
                    No Data
                  </Badge>
                ) : row.isOverBudget ? (
                  <Badge className="text-[10px] font-semibold bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20">
                    Over Budget
                  </Badge>
                ) : (
                  <Badge className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15 dark:text-emerald-400">
                    On Track
                  </Badge>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Year Totals Section ─── */
function YearTotalsRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          highlight ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Main Page ─── */
export function AnnualSummaryPage() {
  const now = new Date();
  const currentYear = now.getFullYear();

  const search = useSearch({ strict: false }) as { year?: number };
  const rawYear = typeof search?.year === "number" ? search.year : currentYear;
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

  const monthRows = annualData?.monthRows ?? [];
  const stats = annualData?.stats ?? {
    totalYearSpentCents: 0,
    totalYearBudgetedCents: 0,
    avgMonthlySpentCents: 0,
    bestMonth: null,
    worstMonth: null,
    highestOverspendMonth: null,
  };

  const barData: MonthBarData[] = monthRows.map((row) => ({
    month: SHORT_MONTHS[row.monthNum - 1],
    spent: row.totalSpentCents / 100,
    budgeted: row.totalBudgetCents / 100,
    spentRatio:
      row.totalBudgetCents > 0 ? row.totalSpentCents / row.totalBudgetCents : 0,
  }));

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
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-primary opacity-70" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Year in Review
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
            Annual Summary
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md leading-relaxed">
            A full-year overview of your budgets, spending patterns, and
            financial performance for {selectedYear}.
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-1 py-1 shadow-subtle shrink-0 mt-1">
          <button
            type="button"
            onClick={prevYear}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft size={15} className="text-muted-foreground" />
          </button>
          <span className="min-w-[60px] text-center text-[0.8125rem] font-semibold text-foreground px-1 select-none">
            {selectedYear}
          </span>
          <button
            type="button"
            onClick={nextYear}
            disabled={selectedYear >= currentYear}
            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next year"
          >
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ── Stat Cards 2�-2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={<Wallet size={18} />}
              label="Total Spent"
              value={formatCents(stats.totalYearSpentCents)}
              sub={`Across all ${selectedYear} expenses`}
              iconBg="bg-primary/10"
              iconColor="text-primary"
              delay={0.08}
            />
            <StatCard
              icon={<BarChart3 size={18} />}
              label="Avg Monthly Spend"
              value={formatCents(stats.avgMonthlySpentCents)}
              sub="Average across active months"
              iconBg="bg-secondary/10"
              iconColor="text-secondary"
              delay={0.12}
            />
            <StatCard
              icon={<TrendingDown size={18} />}
              label="Best Month"
              value={
                stats.bestMonth ? getMonthName(stats.bestMonth.monthNum) : "-"
              }
              sub={
                stats.bestMonth
                  ? formatCents(stats.bestMonth.totalSpentCents)
                  : "No data yet"
              }
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-600 dark:text-emerald-400"
              delay={0.16}
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Worst Month"
              value={
                stats.worstMonth ? getMonthName(stats.worstMonth.monthNum) : "-"
              }
              sub={
                stats.worstMonth
                  ? formatCents(stats.worstMonth.totalSpentCents)
                  : "No data yet"
              }
              iconBg="bg-destructive/10"
              iconColor="text-destructive"
              delay={0.2}
            />
          </>
        )}
      </div>

      {/* ── 12-Month Bar Chart ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <BarChart3 className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-foreground leading-tight">
                Monthly Spending - {selectedYear}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Total spend per month. Bars turn amber near limit, red when
                over.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              On track
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "oklch(0.62 0.20 82)" }}
              />
              Near limit
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "oklch(0.58 0.20 26)" }}
              />
              Over
            </span>
          </div>
        </div>
        <AnnualBarChart data={barData} isLoading={isLoading} />
      </motion.section>

      {/* ── 12-Month Table ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarDays className="w-4.5 h-4.5 text-secondary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base font-semibold text-foreground leading-tight">
              Month-by-Month Breakdown
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Click any month to view its detailed charts and category
              breakdown.
            </p>
          </div>
        </div>
        <MonthTable
          rows={monthRows}
          year={selectedYear}
          isLoading={isLoading}
        />
      </motion.section>

      {/* ── Yearly Totals ── */}
      <motion.section
        className="rounded-2xl border border-border bg-card p-6 shadow-elevated space-y-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.36, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start gap-3 pb-4 border-b border-border mb-2">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <Award className="w-4.5 h-4.5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground leading-tight">
              Yearly Totals
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Aggregated financial stats across the entire year.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {(
              [
                "total-spent",
                "total-budgeted",
                "avg-monthly",
                "highest-overspend",
              ] as const
            ).map((k) => (
              <div
                key={k}
                className="flex justify-between items-center py-3 border-b border-border/50"
              >
                <Skeleton className="h-4 w-40 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <YearTotalsRow
              label="Year Total Spent"
              value={formatCents(stats.totalYearSpentCents)}
            />
            <YearTotalsRow
              label="Year Total Budgeted"
              value={formatCents(stats.totalYearBudgetedCents)}
            />
            <YearTotalsRow
              label="Year Average Monthly Spend"
              value={formatCents(stats.avgMonthlySpentCents)}
            />
            <YearTotalsRow
              label="Highest Overspend Month"
              value={
                stats.highestOverspendMonth
                  ? `${getMonthName(stats.highestOverspendMonth.monthNum)} (${formatCents(
                      Math.abs(stats.highestOverspendMonth.remainingCents),
                    )} over)`
                  : "None - great job!"
              }
              highlight={!!stats.highestOverspendMonth}
            />
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}


