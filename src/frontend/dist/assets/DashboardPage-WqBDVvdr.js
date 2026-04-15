import { c as createLucideIcon, C as CircleCheck, j as jsxRuntimeExports, L as Link, A as ArrowRight, r as reactExports, B as Button, S as Skeleton, W as Wallet, T as TrendingUp, u as useMonthlySummary, a as useActor, b as LoaderCircle, d as createActor } from "./index-BYRpzxol.js";
import { g as getBudgetStatus, C as CATEGORY_ICONS, a as CircleAlert, T as TriangleAlert, B as Badge, f as formatCents, b as getMonthName, c as ChevronRight } from "./index-DPeRZWL7.js";
import { C as ChevronLeft, P as PiggyBank } from "./piggy-bank-BtSEmwet.js";
import { S as Sparkles } from "./sparkles-DATtRbBG.js";
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
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
const STATUS_CONFIG = {
  "on-track": {
    label: "On Track",
    badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
    icon: CircleCheck,
    barClass: "bg-primary",
    glowClass: "glow-success"
  },
  warning: {
    label: "Near Limit",
    badgeClass: "bg-warning/10 text-warning border-warning/30",
    icon: TriangleAlert,
    barClass: "bg-warning",
    glowClass: "glow-warning"
  },
  "over-budget": {
    label: "Over Budget",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/30",
    icon: CircleAlert,
    barClass: "bg-destructive",
    glowClass: "glow-danger"
  }
};
function ProgressBar({ pct, barClass }) {
  const [mounted, setMounted] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 80);
    return () => {
      if (timerRef.current !== null)
        clearTimeout(timerRef.current ?? void 0);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-1.5 bg-muted rounded-full overflow-hidden shadow-inner-subtle",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full ${barClass}`,
          style: {
            width: mounted ? `${pct}%` : "0%",
            transition: "width 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
          }
        }
      )
    }
  );
}
function BudgetCard({ summary, index }) {
  const { budget, totalSpentCents, remainingCents } = summary;
  const status = getBudgetStatus(summary);
  const limit = Number(budget.limitCents);
  const spent = Number(totalSpentCents);
  const remaining = Number(remainingCents);
  const pct = limit > 0 ? Math.min(spent / limit * 100, 100) : 0;
  const icon = CATEGORY_ICONS[budget.category] ?? CATEGORY_ICONS.Other;
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const iconBg = budget.color ? `${budget.color}20` : void 0;
  const staggerClass = `animate-stagger-${Math.min(index, 6)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/budgets/$id",
      params: { id: budget.id.toString() },
      className: `group block slide-up ${staggerClass}`,
      "data-ocid": `budget-card.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 card-hover h-full flex flex-col gap-3 hover:border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-subtle",
                style: { background: iconBg ?? "oklch(var(--primary)/0.12)" },
                "aria-hidden": "true",
                children: icon
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground truncate leading-tight", children: budget.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: budget.category })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `text-[10px] font-semibold flex-shrink-0 gap-1 px-2 py-0.5 rounded-full border font-body ${cfg.badgeClass} ${status !== "on-track" ? cfg.glowClass : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-2.5 w-2.5" }),
                cfg.label
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xl font-bold tabular-nums text-foreground leading-none", children: formatCents(totalSpentCents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: "of" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground tabular-nums", children: formatCents(budget.limitCents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-mono text-xs font-semibold tabular-nums text-muted-foreground", children: [
            pct.toFixed(0),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { pct, barClass: cfg.barClass }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono tabular-nums", children: remaining >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `font-semibold ${status === "warning" ? "text-warning" : "text-emerald-700 dark:text-emerald-400"}`,
                children: formatCents(remainingCents)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: " left" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-destructive", children: [
            formatCents(Math.abs(remaining)),
            " over"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200 font-body", children: [
            "Details",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" })
          ] })
        ] })
      ] })
    }
  );
}
function MonthSelector({ year, month, onChange }) {
  const now = /* @__PURE__ */ new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
  const [direction, setDirection] = reactExports.useState(null);
  function goBack() {
    setDirection("left");
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
    setTimeout(() => setDirection(null), 300);
  }
  function goForward() {
    if (isCurrentMonth) return;
    setDirection("right");
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
    setTimeout(() => setDirection(null), 300);
  }
  const labelAnim = direction === "left" ? "animate-[slide-up_0.22s_ease_both]" : direction === "right" ? "animate-[slide-up_0.22s_ease_both]" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-0.5 bg-card border border-border rounded-xl px-1 py-1 shadow-subtle",
      "data-ocid": "month-selector",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-lg hover:bg-muted transition-spring active:scale-95",
            onClick: goBack,
            "data-ocid": "month-selector.prev",
            "aria-label": "Previous month",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 15, className: "text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-2 px-3 min-w-[156px] justify-center overflow-hidden",
            "data-ocid": "month-selector.label",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 ${labelAnim}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center leading-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground font-display tracking-tight", children: getMonthName(month) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono tabular-nums mt-0.5", children: year })
              ] }),
              isCurrentMonth && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 leading-none uppercase tracking-wide shadow-subtle", children: "Now" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-lg hover:bg-muted transition-spring active:scale-95 disabled:opacity-30",
            onClick: goForward,
            disabled: isCurrentMonth,
            "data-ocid": "month-selector.next",
            "aria-label": "Next month",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 15, className: "text-muted-foreground" })
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
  sub,
  valueClass,
  iconBg = "bg-primary/15",
  iconColor = "text-primary",
  index
}) {
  const staggerClass = `animate-stagger-${index}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `relative bg-card border border-border rounded-2xl p-4 shadow-subtle overflow-hidden slide-up ${staggerClass}`,
      "data-ocid": `summary-header.stat.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.04] blur-2xl bg-primary pointer-events-none",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex-shrink-0 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shadow-subtle`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 ${iconColor}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground font-body uppercase tracking-widest mb-1", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `font-mono text-2xl font-bold leading-none tabular-nums ${valueClass ?? "text-foreground"}`,
                children: value
              }
            ),
            sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-body mt-1", children: sub })
          ] })
        ] })
      ]
    }
  );
}
function GlobalProgressBar({
  pct,
  barColorClass
}) {
  const [mounted, setMounted] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timerRef.current = setTimeout(() => setMounted(true), 120);
    return () => {
      if (timerRef.current !== null)
        clearTimeout(timerRef.current ?? void 0);
    };
  }, []);
  const gradientClass = pct >= 100 ? "from-destructive via-destructive to-destructive/80" : pct >= 80 ? "from-warning via-warning to-warning/70" : "from-primary via-primary/70 to-primary/80";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-2.5 bg-muted rounded-full overflow-hidden shadow-inner-subtle",
      "aria-hidden": "true",
      "data-ocid": "summary-header.progress",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full bg-gradient-to-r ${gradientClass} ${barColorClass}`,
          style: {
            width: mounted ? `${pct}%` : "0%",
            transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
          }
        }
      )
    }
  );
}
function MonthlySummaryHeader({
  summary,
  isLoading
}) {
  if (isLoading || !summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "summary-header.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[88px] rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[88px] rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[88px] rounded-2xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] rounded-2xl" })
    ] });
  }
  const totalBudget = Number(summary.totalBudgetCents);
  const totalSpent = Number(summary.totalSpentCents);
  const remaining = totalBudget - totalSpent;
  const pct = totalBudget > 0 ? Math.min(totalSpent / totalBudget * 100, 100) : 0;
  const barColorClass = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-warning" : "bg-primary";
  const isOverBudget = remaining < 0;
  const isNearLimit = !isOverBudget && remaining / Math.max(totalBudget, 1) < 0.2;
  const remainingValueClass = isOverBudget ? "text-destructive" : isNearLimit ? "text-warning" : "text-emerald-700 dark:text-emerald-400";
  const remainingSub = isOverBudget ? `${formatCents(Math.abs(remaining))} over budget` : isNearLimit ? "Approaching limit" : "You're doing great";
  const spentPctLabel = `${pct.toFixed(1)}% of budget used`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "summary-header", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          index: 1,
          icon: Wallet,
          label: "Total Budget",
          value: formatCents(summary.totalBudgetCents),
          sub: `${summary.budgets.length} categor${summary.budgets.length === 1 ? "y" : "ies"}`,
          iconBg: "bg-primary/12",
          iconColor: "text-primary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          index: 2,
          icon: TrendingUp,
          label: "Total Spent",
          value: formatCents(summary.totalSpentCents),
          sub: spentPctLabel,
          iconBg: "bg-secondary/12",
          iconColor: "text-secondary"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          index: 3,
          icon: isOverBudget ? TrendingDown : PiggyBank,
          label: isOverBudget ? "Over Budget" : "Remaining",
          value: formatCents(Math.abs(remaining)),
          sub: remainingSub,
          valueClass: remainingValueClass,
          iconBg: isOverBudget ? "bg-destructive/12" : isNearLimit ? "bg-warning/12" : "bg-emerald-500/12",
          iconColor: isOverBudget ? "text-destructive" : isNearLimit ? "text-warning" : "text-emerald-700 dark:text-emerald-400"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl px-5 py-4 shadow-subtle slide-up animate-stagger-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground font-body uppercase tracking-widest", children: "Monthly Progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: [
            formatCents(summary.totalSpentCents),
            " spent of",
            " ",
            formatCents(summary.totalBudgetCents),
            " budget"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-mono text-lg font-bold tabular-nums ${barColorClass === "bg-destructive" ? "text-destructive" : barColorClass === "bg-warning" ? "text-warning" : "text-primary"}`,
            children: [
              pct.toFixed(1),
              "%"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalProgressBar, { pct, barColorClass }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-1.5", children: [0, 25, 50, 75, 100].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `text-[9px] font-mono tabular-nums ${pct >= m ? "text-muted-foreground" : "text-muted-foreground/40"}`,
          children: [
            m,
            "%"
          ]
        },
        m
      )) })
    ] })
  ] });
}
function BudgetGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-2xl" }, k)) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle",
      "data-ocid": "dashboard.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-10 w-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-2xl bg-primary/5 blur-xl scale-125 pointer-events-none",
              "aria-hidden": "true"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground mb-2 tracking-tight", children: "No budgets set up yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-8 font-body leading-relaxed", children: "Take control of your spending by creating your first budget category. It only takes a minute — you'll get instant insight into where your money goes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", "data-ocid": "dashboard.create_budget_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 font-body px-6 h-10 rounded-xl shadow-elevated button-hover transition-spring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-4 w-4" }),
          "Create your first budget"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mt-8 opacity-30", "aria-hidden": "true", children: ["d1", "d2", "d3", "d4", "d5"].map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-1.5 h-1.5 rounded-full bg-muted-foreground"
          },
          id
        )) })
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
      lines.push(
        "Category,Budget Limit (N$),Amount Spent (N$),Remaining (N$),% Used"
      );
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
      lines.push("Date,Category,Amount (N$),Notes");
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
      className: "gap-2 font-body h-9 px-3.5 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth shadow-subtle",
      onClick: handleExport,
      disabled: !summary || !actor || isExporting,
      "data-ocid": "dashboard.export_csv_button",
      children: [
        isExporting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
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
      className: "p-5 md:p-7 space-y-7 max-w-7xl mx-auto page-enter",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight leading-none", children: [
                getMonthName(month),
                " Budget"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-lg text-muted-foreground font-medium tabular-nums leading-none mt-0.5", children: year })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Track spending and stay on top of your finances" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [
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
                className: "gap-2 font-body h-9 px-4 rounded-xl shadow-elevated button-hover transition-spring",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground leading-none", children: "Budget Categories" }),
              hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-1", children: [
                budgets.length,
                " categor",
                budgets.length === 1 ? "y" : "ies",
                " ",
                "this month"
              ] })
            ] }),
            hasBudgets && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/budgets",
                className: "inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium font-body transition-colors duration-200 group",
                "data-ocid": "dashboard.view_all_link",
                children: [
                  "Manage budgets",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" })
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
