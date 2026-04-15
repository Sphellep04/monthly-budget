import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const CHART_COLORS = [
  "oklch(var(--chart-1))",
  "oklch(var(--chart-2))",
  "oklch(var(--chart-3))",
  "oklch(var(--chart-4))",
  "oklch(var(--chart-5))",
  "oklch(var(--chart-6))",
];

function formatMonthLabel(year: bigint, month: bigint) {
  const m = new Date(Number(year), Number(month) - 1, 1);
  return m.toLocaleString("en-US", { month: "short", year: "2-digit" });
}

function SpendingTrendChart() {
  const { data: trend, isLoading } = useMonthlyTrend(12);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
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

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Total Spent"]}
          contentStyle={{
            backgroundColor: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CategoryBreakdownChart({
  budgetId,
  colorIndex,
}: {
  budgetId: bigint;
  budgetName?: string;
  colorIndex: number;
}) {
  const { data: trend, isLoading } = useCategoryTrend(budgetId, 6);

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
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

  const color = CHART_COLORS[colorIndex % CHART_COLORS.length];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-border"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => `$${v.toFixed(0)}`}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={55}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            `$${value.toFixed(2)}`,
            name === "spent" ? "Spent" : "Limit",
          ]}
          contentStyle={{
            backgroundColor: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Bar
          dataKey="limit"
          fill="hsl(var(--muted))"
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
        />
        <Bar
          dataKey="spent"
          fill={color}
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartsPage() {
  const now = new Date();
  const { summaries, isLoading: budgetsLoading } = useBudgets(
    now.getFullYear(),
    now.getMonth() + 1,
  );

  return (
    <div
      className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto"
      data-ocid="charts.page"
    >
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Spending Charts
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-body">
          Visualize your spending trends over time
        </p>
      </div>

      {/* Monthly Trend */}
      <section
        className="rounded-2xl border border-border bg-card p-6 shadow-subtle space-y-4"
        data-ocid="charts.monthly_trend.card"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Total Spending Trend
            </h2>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </div>
        </div>
        <SpendingTrendChart />
      </section>

      {/* Per-Budget Category Charts */}
      <section className="space-y-4" data-ocid="charts.category_trends.section">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">
              Per-Budget Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Last 6 months — bars show spent vs. limit
            </p>
          </div>
        </div>

        {budgetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["a", "b", "c", "d"] as const).map((k) => (
              <Skeleton key={k} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : summaries.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border bg-card/50"
            data-ocid="charts.empty_state"
          >
            <BarChart2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground max-w-xs">
              No budgets found for this month. Create budgets to see charts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {summaries.map((bs, i) => (
              <div
                key={bs.budget.id.toString()}
                className="rounded-2xl border border-border bg-card p-5 shadow-subtle space-y-3"
                data-ocid={`charts.budget_chart.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: bs.budget.color }}
                  />
                  <h3 className="font-display text-sm font-semibold text-foreground truncate">
                    {bs.budget.name}
                  </h3>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {bs.budget.category}
                  </span>
                </div>
                <CategoryBreakdownChart
                  budgetId={bs.budget.id}
                  colorIndex={i}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
