import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useGetCategoryBreakdownForRange,
  useGetExpensesInRange,
  useMonthlySummary,
} from "../hooks/useBudget";
import { formatCents } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toIso(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
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
  return `${d} ${months[m - 1]} ${y}`;
}

function getDefaultRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toIso(start), end: toIso(end) };
}

function downloadCsv(
  rows: {
    date: string;
    category: string;
    amountCents: bigint;
    notes?: string;
    receiptUrl?: string;
  }[],
  startDate: string,
  endDate: string,
) {
  const filename = `${startDate.replace(/-/g, "")}-${endDate.replace(/-/g, "")}-report.csv`;
  const header = "Date,Category,Amount (N$),Notes,Receipt URL\n";
  const body = rows
    .map((r) => {
      const amount = (Number(r.amountCents) / 100).toFixed(2);
      const notes = (r.notes ?? "").replace(/"/g, '""');
      const receipt = r.receiptUrl ?? "";
      return `"${r.date}","${r.category}","${amount}","${notes}","${receipt}"`;
    })
    .join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="shadow-subtle">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-display font-semibold text-foreground">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function ReportSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-56 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-display font-semibold text-foreground mb-1">
        No data to display
      </p>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function ReportsPage() {
  const defaults = useMemo(() => getDefaultRange(), []);
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);

  const hasRange = !!startDate && !!endDate && startDate <= endDate;

  // Fetch both datasets only when range is valid
  const { data: expenses, isLoading: expLoading } = useGetExpensesInRange(
    startDate,
    endDate,
    hasRange,
  );

  const { data: breakdown, isLoading: brkLoading } =
    useGetCategoryBreakdownForRange(startDate, endDate, hasRange);

  // We need budget names for the expense list - use current month as reference
  const now = new Date();
  const { data: monthlySummary } = useMonthlySummary(
    now.getFullYear(),
    now.getMonth() + 1,
  );

  const budgetNameMap = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (monthlySummary) {
      for (const bs of monthlySummary.budgets) {
        map[bs.budget.id.toString()] = bs.budget.name;
      }
    }
    // Also pull names from breakdown (which covers past months)
    if (breakdown) {
      for (const bp of breakdown) {
        map[bp.budgetId] = bp.name;
      }
    }
    return map;
  }, [monthlySummary, breakdown]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!expenses || expenses.length === 0)
      return { total: 0n, count: 0, avg: 0n, highest: 0n };
    const total = expenses.reduce((s, e) => s + e.amountCents, 0n);
    const count = expenses.length;
    const avg = total / BigInt(count);
    const highest = expenses.reduce(
      (m, e) => (e.amountCents > m ? e.amountCents : m),
      0n,
    );
    return { total, count, avg, highest };
  }, [expenses]);

  // ── Chart data ─────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!breakdown) return [];
    return [...breakdown]
      .sort((a, b) => Number(b.amountCents - a.amountCents))
      .map((bp) => ({
        name: bp.name.length > 14 ? `${bp.name.slice(0, 13)}…` : bp.name,
        fullName: bp.name,
        amount: Number(bp.amountCents) / 100,
        color: bp.color || "#6366f1",
      }));
  }, [breakdown]);

  // ── Report title ───────────────────────────────────────────────────────────
  const reportTitle = useMemo(() => {
    if (!startDate || !endDate) return "Expenses: select a date range";
    return `Expenses: ${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
  }, [startDate, endDate]);

  // ── CSV export ─────────────────────────────────────────────────────────────
  function handleExport() {
    if (!expenses) return;
    const rows = expenses.map((e) => ({
      date: e.date,
      category: budgetNameMap[e.budgetId.toString()] ?? "Unknown",
      amountCents: e.amountCents,
      notes: e.notes,
      receiptUrl: e.receiptUrl,
    }));
    downloadCsv(rows, startDate, endDate);
  }

  const isLoading = expLoading || brkLoading;

  return (
    <div className="page-enter p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Custom Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{reportTitle}</p>
        </div>
        {hasRange && expenses && expenses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="shrink-0"
          >
            Export CSV
          </Button>
        )}
      </div>

      {/* ── Date range picker ── */}
      <Card className="shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <label
                htmlFor="start-date"
                className="text-sm font-medium text-foreground"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground input-focus w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label
                htmlFor="end-date"
                className="text-sm font-medium text-foreground"
              >
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground input-focus w-full"
              />
            </div>
            {startDate && endDate && startDate > endDate && (
              <p className="text-xs text-destructive self-end pb-2">
                End date must be after start date
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Content ── */}
      {!hasRange ? (
        <EmptyState message="Select a start and end date above to generate your expense report." />
      ) : isLoading ? (
        <ReportSkeleton />
      ) : !expenses || expenses.length === 0 ? (
        <EmptyState message="No expenses found for the selected date range. Try adjusting the dates." />
      ) : (
        <div className="space-y-6 slide-up">
          {/* ── Summary stats ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Spent" value={formatCents(stats.total)} />
            <StatCard
              label="Transactions"
              value={stats.count.toString()}
              sub="in selected range"
            />
            <StatCard label="Avg Transaction" value={formatCents(stats.avg)} />
            <StatCard
              label="Highest"
              value={formatCents(stats.highest)}
              sub="single transaction"
            />
          </div>

          {/* ── Category breakdown chart ── */}
          {chartData.length > 0 && (
            <Card className="shadow-subtle">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 11,
                        fill: "oklch(var(--muted-foreground))",
                      }}
                      tickFormatter={(v) =>
                        `N$${(v as number).toLocaleString()}`
                      }
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 12, fill: "oklch(var(--foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `N$${(value as number).toFixed(2)}`,
                        "Spent",
                      ]}
                      contentStyle={{
                        background: "oklch(var(--card))",
                        border: "1px solid oklch(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelFormatter={(label) => {
                        const found = chartData.find((d) => d.name === label);
                        return found?.fullName ?? label;
                      }}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={28}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.fullName}
                          fill={entry.color}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* ── Expense table ── */}
          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Expense Details
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {expenses.length} transactions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-6">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                        Notes
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                        Receipt
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...expenses]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((expense, _idx) => (
                        <TableRow
                          key={expense.id.toString()}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors-fast"
                        >
                          <TableCell className="pl-6 text-sm text-muted-foreground whitespace-nowrap">
                            {formatDisplayDate(expense.date)}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-foreground">
                            <span
                              className="inline-block max-w-[140px] truncate"
                              title={
                                budgetNameMap[expense.budgetId.toString()] ??
                                "Unknown"
                              }
                            >
                              {budgetNameMap[expense.budgetId.toString()] ??
                                "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-foreground text-right tabular-nums whitespace-nowrap">
                            {formatCents(expense.amountCents)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell max-w-[200px]">
                            <span className="line-clamp-1">
                              {expense.notes ?? (
                                <span className="text-muted-foreground/50 italic">
                                  -
                                </span>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {expense.receiptUrl ? (
                              <a
                                href={expense.receiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="View receipt"
                                className="inline-flex items-center justify-center h-7 px-2 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors-fast text-xs font-medium"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-muted-foreground/30 text-xs">
                                -
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
