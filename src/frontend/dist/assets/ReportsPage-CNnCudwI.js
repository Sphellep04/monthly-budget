import { j as jsxRuntimeExports, g as cn, r as reactExports, ag as useGetExpensesInRange, ai as useGetCategoryBreakdownForRange, h as useMonthlySummary, B as Button, S as Skeleton } from "./index-Dp0P1DkE.js";
import { B as Badge } from "./badge-DytHA40_.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-UwCQ0QjW.js";
import { f as formatCents } from "./index-DBqnxCSC.js";
import { D as Download } from "./download-DwR_0FSV.js";
import { R as ResponsiveContainer, I as BarChart, X as XAxis, Y as YAxis, H as Tooltip, J as Bar, s as Cell } from "./BarChart-BCkNrc5Z.js";
import { R as Receipt } from "./receipt-CDKzH6NL.js";
import { F as FileText } from "./file-text-B27dBMp6.js";
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function toIso(date) {
  return date.toISOString().split("T")[0];
}
function formatDisplayDate(iso) {
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
    "Dec"
  ];
  return `${d} ${months[m - 1]} ${y}`;
}
function getDefaultRange() {
  const now = /* @__PURE__ */ new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: toIso(start), end: toIso(end) };
}
function downloadCsv(rows, startDate, endDate) {
  const filename = `${startDate.replace(/-/g, "")}-${endDate.replace(/-/g, "")}-report.csv`;
  const header = "Date,Category,Amount (N$),Notes,Receipt URL\n";
  const body = rows.map((r) => {
    const amount = (Number(r.amountCents) / 100).toFixed(2);
    const notes = (r.notes ?? "").replace(/"/g, '""');
    const receipt = r.receiptUrl ?? "";
    return `"${r.date}","${r.category}","${amount}","${notes}","${receipt}"`;
  }).join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function StatCard({
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-semibold text-foreground", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
  ] }) });
}
function ReportSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-56 rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" })
  ] });
}
function EmptyState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-semibold text-foreground mb-1", children: "No data to display" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: message })
  ] });
}
function ReportsPage() {
  const defaults = reactExports.useMemo(() => getDefaultRange(), []);
  const [startDate, setStartDate] = reactExports.useState(defaults.start);
  const [endDate, setEndDate] = reactExports.useState(defaults.end);
  const hasRange = !!startDate && !!endDate && startDate <= endDate;
  const { data: expenses, isLoading: expLoading } = useGetExpensesInRange(
    startDate,
    endDate,
    hasRange
  );
  const { data: breakdown, isLoading: brkLoading } = useGetCategoryBreakdownForRange(startDate, endDate, hasRange);
  const now = /* @__PURE__ */ new Date();
  const { data: monthlySummary } = useMonthlySummary(
    now.getFullYear(),
    now.getMonth() + 1
  );
  const budgetNameMap = reactExports.useMemo(() => {
    const map = {};
    if (monthlySummary) {
      for (const bs of monthlySummary.budgets) {
        map[bs.budget.id.toString()] = bs.budget.name;
      }
    }
    if (breakdown) {
      for (const bp of breakdown) {
        map[bp.budgetId] = bp.name;
      }
    }
    return map;
  }, [monthlySummary, breakdown]);
  const stats = reactExports.useMemo(() => {
    if (!expenses || expenses.length === 0)
      return { total: 0n, count: 0, avg: 0n, highest: 0n };
    const total = expenses.reduce((s, e) => s + e.amountCents, 0n);
    const count = expenses.length;
    const avg = total / BigInt(count);
    const highest = expenses.reduce(
      (m, e) => e.amountCents > m ? e.amountCents : m,
      0n
    );
    return { total, count, avg, highest };
  }, [expenses]);
  const chartData = reactExports.useMemo(() => {
    if (!breakdown) return [];
    return [...breakdown].sort((a, b) => Number(b.amountCents - a.amountCents)).map((bp) => ({
      name: bp.name.length > 14 ? `${bp.name.slice(0, 13)}…` : bp.name,
      fullName: bp.name,
      amount: Number(bp.amountCents) / 100,
      color: bp.color || "#6366f1"
    }));
  }, [breakdown]);
  const reportTitle = reactExports.useMemo(() => {
    if (!startDate || !endDate) return "Expenses: select a date range";
    return `Expenses: ${formatDisplayDate(startDate)} – ${formatDisplayDate(endDate)}`;
  }, [startDate, endDate]);
  function handleExport() {
    if (!expenses) return;
    const rows = expenses.map((e) => ({
      date: e.date,
      category: budgetNameMap[e.budgetId.toString()] ?? "Unknown",
      amountCents: e.amountCents,
      notes: e.notes,
      receiptUrl: e.receiptUrl
    }));
    downloadCsv(rows, startDate, endDate);
  }
  const isLoading = expLoading || brkLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter p-4 md:p-6 max-w-6xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Custom Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: reportTitle })
      ] }),
      hasRange && expenses && expenses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleExport,
          className: "gap-2 shrink-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
            "Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Date Range" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "start-date",
              className: "text-sm font-medium text-foreground",
              children: "Start Date"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "start-date",
              type: "date",
              value: startDate,
              onChange: (e) => setStartDate(e.target.value),
              className: "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground input-focus w-full"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "end-date",
              className: "text-sm font-medium text-foreground",
              children: "End Date"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "end-date",
              type: "date",
              value: endDate,
              onChange: (e) => setEndDate(e.target.value),
              className: "h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground input-focus w-full"
            }
          )
        ] }),
        startDate && endDate && startDate > endDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive self-end pb-2", children: "End date must be after start date" })
      ] }) })
    ] }),
    !hasRange ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Select a start and end date above to generate your expense report." }) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ReportSkeleton, {}) : !expenses || expenses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No expenses found for the selected date range. Try adjusting the dates." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 slide-up", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Spent", value: formatCents(stats.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Transactions",
            value: stats.count.toString(),
            sub: "in selected range"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Avg Transaction", value: formatCents(stats.avg) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Highest",
            value: formatCents(stats.highest),
            sub: "single transaction"
          }
        )
      ] }),
      chartData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Spending by Category" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 220, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            layout: "vertical",
            margin: { top: 0, right: 40, bottom: 0, left: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  type: "number",
                  tick: {
                    fontSize: 11,
                    fill: "oklch(var(--muted-foreground))"
                  },
                  tickFormatter: (v) => `N$${v.toLocaleString()}`,
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  type: "category",
                  dataKey: "name",
                  width: 110,
                  tick: { fontSize: 12, fill: "oklch(var(--foreground))" },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value) => [
                    `N$${value.toFixed(2)}`,
                    "Spent"
                  ],
                  contentStyle: {
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  },
                  labelFormatter: (label) => {
                    const found = chartData.find((d) => d.name === label);
                    return (found == null ? void 0 : found.fullName) ?? label;
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "amount", radius: [0, 4, 4, 0], maxBarSize: 28, children: chartData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Cell,
                {
                  fill: entry.color,
                  fillOpacity: 0.85
                },
                entry.fullName
              )) })
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Expense Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
            expenses.length,
            " transactions"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-6", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center", children: "Receipt" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: [...expenses].sort((a, b) => b.date.localeCompare(a.date)).map((expense, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "border-b border-border/50 hover:bg-muted/30 transition-colors-fast",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-6 text-sm text-muted-foreground whitespace-nowrap", children: formatDisplayDate(expense.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-block max-w-[140px] truncate",
                    title: budgetNameMap[expense.budgetId.toString()] ?? "Unknown",
                    children: budgetNameMap[expense.budgetId.toString()] ?? "Unknown"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm font-semibold text-foreground text-right tabular-nums whitespace-nowrap", children: formatCents(expense.amountCents) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground hidden sm:table-cell max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: expense.notes ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic", children: "—" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: expense.receiptUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: expense.receiptUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "View receipt",
                    className: "inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors-fast",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-3.5 h-3.5" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-xs", children: "—" }) })
              ]
            },
            expense.id.toString()
          )) })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  ReportsPage
};
