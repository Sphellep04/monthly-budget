import { c as createLucideIcon, j as jsxRuntimeExports, L as Link, B as Button, S as Skeleton, W as Wallet, T as TrendingUp, r as reactExports, u as useMonthlySummary, A as ArrowRight, a as useActor, b as LayoutDashboard, d as createActor } from "./index-CWkzYjiE.js";
import { g as getBudgetStatus, C as CATEGORY_ICONS, B as Badge, f as formatCents, a as getMonthName } from "./index-D6vMlk8B.js";
import { T as TriangleAlert } from "./triangle-alert-DMGWLQLw.js";
import { C as ChevronLeft, a as ChevronRight } from "./chevron-right-BiU9XRar.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
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
      d: "M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",
      key: "1piglc"
    }
  ],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M2 8v1a2 2 0 0 0 2 2h1", key: "1env43" }]
];
const PiggyBank = createLucideIcon("piggy-bank", __iconNode);
function BudgetCard({ summary, index }) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const pct = limit > 0 ? Math.min(spent / limit * 100, 100) : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;
  const barColor = status === "over-budget" ? "bg-destructive" : status === "warning" ? "bg-warning" : "bg-primary";
  const statusConfig = {
    "on-track": {
      label: "On Track",
      class: "bg-primary/15 text-primary border-primary/25"
    },
    warning: {
      label: "Warning",
      class: "bg-warning/15 text-warning border-warning/25"
    },
    "over-budget": {
      label: "Over Budget",
      class: "bg-destructive/15 text-destructive border-destructive/25"
    }
  };
  const cfg = statusConfig[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/budgets/$id",
      params: { id: budget.id.toString() },
      className: "group block",
      "data-ocid": `budget-card.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-subtle transition-smooth hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-2xl leading-none flex-shrink-0",
                role: "img",
                "aria-label": budget.category,
                children: icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground truncate", children: budget.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: budget.category })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `text-xs flex-shrink-0 ml-2 font-body ${cfg.class}`,
              children: [
                status === "over-budget" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 mr-1" }),
                cfg.label
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-base font-bold tabular-nums text-foreground", children: formatCents(totalSpentCents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground tabular-nums", children: formatCents(budget.limitCents) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full transition-smooth ${barColor}`,
            style: { width: `${pct}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono tabular-nums text-muted-foreground", children: Number(remainingCents) >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: formatCents(remainingCents) }),
          " ",
          "remaining"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-semibold", children: [
          formatCents(Math.abs(Number(remainingCents))),
          " over budget"
        ] }) })
      ] })
    }
  );
}
function MonthSelector({ year, month, onChange }) {
  const now = /* @__PURE__ */ new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  function goBack() {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  }
  function goForward() {
    if (isCurrentMonth) return;
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-1.5 bg-card border border-border rounded-lg px-1 py-1",
      "data-ocid": "month-selector",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 hover:bg-muted transition-smooth",
            onClick: goBack,
            "data-ocid": "month-selector.prev",
            "aria-label": "Previous month",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 14 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 px-2 min-w-[140px] justify-center",
            "data-ocid": "month-selector.label",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 13, className: "text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground font-body", children: [
                getMonthName(month),
                " ",
                year
              ] }),
              isCurrentMonth && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold bg-primary/15 text-primary rounded px-1.5 py-0.5 leading-none", children: "Now" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-7 w-7 hover:bg-muted transition-smooth",
            onClick: goForward,
            disabled: isCurrentMonth,
            "data-ocid": "month-selector.next",
            "aria-label": "Next month",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14 })
          }
        )
      ]
    }
  );
}
function StatCard({
  icon: Icon,
  label,
  value,
  valueClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 bg-card border border-border rounded-xl p-4 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-wider mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-mono text-lg font-bold leading-tight tabular-nums ${valueClass ?? "text-foreground"}`,
          children: value
        }
      )
    ] })
  ] });
}
function MonthlySummaryHeader({
  summary,
  isLoading
}) {
  if (isLoading || !summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6",
        "data-ocid": "summary-header.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] rounded-xl" })
        ]
      }
    );
  }
  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? Math.min(totalSpent / totalBudget * 100, 100) : 0;
  const barColor = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";
  const remainingClass = remaining < 0 ? "text-destructive" : remaining / totalBudget < 0.2 ? "text-warning" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mb-6", "data-ocid": "summary-header", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: Wallet,
          label: "Total Budget",
          value: formatCents(summary.totalBudgetCents)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: TrendingUp,
          label: "Total Spent",
          value: formatCents(summary.totalSpentCents)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: PiggyBank,
          label: "Remaining",
          value: formatCents(Math.abs(remaining)),
          valueClass: remainingClass
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl px-4 py-3 shadow-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Monthly Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-semibold text-muted-foreground tabular-nums", children: [
          pct.toFixed(1),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-2 bg-muted rounded-full overflow-hidden",
          "data-ocid": "summary-header.progress",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-smooth ${barColor}`,
              style: { width: `${pct}%` }
            }
          )
        }
      )
    ] })
  ] });
}
function BudgetGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-xl" }, k)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl border border-dashed border-border bg-card/50",
      "data-ocid": "dashboard.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-8 w-8 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground mb-2", children: "No budgets yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-6 font-body leading-relaxed", children: "Start tracking your spending by creating your first budget category for this month." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2 font-body",
            "data-ocid": "dashboard.create_budget_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
              "Create your first budget"
            ]
          }
        ) })
      ]
    }
  );
}
function ExportCsvButton({
  year,
  month,
  summary
}) {
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const { actor } = useActor(createActor);
  const handleExport = async () => {
    if (!summary || !actor) return;
    setIsExporting(true);
    try {
      const monthName = getMonthName(month).toLowerCase();
      const filename = `budget-${monthName}-${year}.csv`;
      const lines = [];
      lines.push("=== BUDGET SUMMARY ===");
      lines.push("Category,Budget Limit,Amount Spent,Remaining,% Used");
      for (const bs of summary.budgets) {
        const limit = Number(bs.budget.limitCents) / 100;
        const spent = Number(bs.totalSpentCents) / 100;
        const remaining = Number(bs.remainingCents) / 100;
        const pct = limit > 0 ? Math.round(spent / limit * 100) : 0;
        lines.push(
          `"${bs.budget.name}",${limit.toFixed(2)},${spent.toFixed(2)},${remaining.toFixed(2)},${pct}%`
        );
      }
      const totalLimit = Number(summary.totalBudgetCents) / 100;
      const totalSpent = Number(summary.totalSpentCents) / 100;
      const totalPct = totalLimit > 0 ? Math.round(totalSpent / totalLimit * 100) : 0;
      lines.push(
        `"TOTAL",${totalLimit.toFixed(2)},${totalSpent.toFixed(2)},${(totalLimit - totalSpent).toFixed(2)},${totalPct}%`
      );
      lines.push("");
      lines.push("=== DETAILED EXPENSES ===");
      lines.push("Date,Category,Amount,Notes");
      const monthPad = String(month).padStart(2, "0");
      const monthPrefix = `${year}-${monthPad}`;
      for (const bs of summary.budgets) {
        const rawExpenses = await actor.listExpenses(bs.budget.id);
        const expenses = rawExpenses.filter(
          (e) => e.date.startsWith(monthPrefix)
        );
        lines.push(`"--- ${bs.budget.name} ---","","",""`);
        if (expenses.length === 0) {
          lines.push(`"(no expenses)","","",""`);
        } else {
          for (const expense of expenses.sort(
            (a2, b) => a2.date.localeCompare(b.date)
          )) {
            const amount = Number(expense.amountCents) / 100;
            const notes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : "";
            lines.push(
              `"${expense.date}","${bs.budget.name}",${amount.toFixed(2)},${notes}`
            );
          }
        }
      }
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      variant: "outline",
      size: "sm",
      className: "gap-1.5 transition-smooth font-body",
      onClick: handleExport,
      disabled: !summary || !actor || isExporting,
      "data-ocid": "dashboard.export_csv_button",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        isExporting ? "Exporting…" : "Export CSV"
      ]
    }
  );
}
function DashboardPage() {
  const now = /* @__PURE__ */ new Date();
  const [year, setYear] = reactExports.useState(now.getFullYear());
  const [month, setMonth] = reactExports.useState(now.getMonth() + 1);
  const { data: summary, isLoading } = useMonthlySummary(year, month);
  const budgets = (summary == null ? void 0 : summary.budgets) ?? [];
  const hasBudgets = budgets.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 md:pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5 font-body", children: [
              getMonthName(month),
              " ",
              year,
              " overview"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MonthSelector,
              {
                year,
                month,
                onChange: (y, m) => {
                  setYear(y);
                  setMonth(m);
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExportCsvButton, { year, month, summary }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 transition-smooth font-body",
                "data-ocid": "dashboard.add_budget_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
                  "New Budget"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlySummaryHeader, { summary, isLoading }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Budget Categories" }),
            hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/budgets",
                className: "text-xs text-primary hover:underline flex items-center gap-1 transition-smooth",
                "data-ocid": "dashboard.view_all_link",
                children: [
                  "View all ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                ]
              }
            )
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(BudgetGridSkeleton, {}) : hasBudgets ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              "data-ocid": "dashboard.budget_list",
              children: budgets.map((bs, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                BudgetCard,
                {
                  summary: bs,
                  index: i + 1
                },
                bs.budget.id.toString()
              ))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
        ] })
      ]
    }
  );
}
export {
  DashboardPage
};
