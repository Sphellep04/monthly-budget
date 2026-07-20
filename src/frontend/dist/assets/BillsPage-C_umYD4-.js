import { c as createLucideIcon, r as reactExports, al as useListBillPayments, j as jsxRuntimeExports, B as Button, S as Skeleton, am as Bell, an as useListBudgets, $ as useRecurringTemplates, L as Link, ao as useCreateBillPayment, ap as useUpdateBillPayment, z as Dialog, A as DialogContent, C as DialogHeader, E as DialogTitle, v as Label, I as Input, H as ue } from "./index-Dp0P1DkE.js";
import { B as Badge } from "./badge-DytHA40_.js";
import { M as MonthSelector, C as CircleCheck } from "./MonthSelector-Bz-2xN98.js";
import { a as getMonthName, C as CATEGORY_ICONS, f as formatCents } from "./index-DBqnxCSC.js";
import { D as Download } from "./download-DwR_0FSV.js";
import { E as ExternalLink } from "./external-link--FWyuHBj.js";
import { C as CircleAlert } from "./circle-alert-bUiK6-cT.js";
import "./chevron-left-U4T-MH95.js";
import "./chevron-right-xVjoeubR.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function getBillStatus(dueDay, payment, year, month) {
  if ((payment == null ? void 0 : payment.paidDate) != null) return "paid";
  const today = /* @__PURE__ */ new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  if (year < todayYear || year === todayYear && month < todayMonth)
    return "overdue";
  if (year > todayYear || year === todayYear && month > todayMonth)
    return "upcoming";
  if (dueDay < todayDay) return "overdue";
  if (dueDay <= todayDay + 7) return "due-soon";
  return "upcoming";
}
const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 13 })
  },
  "due-soon": {
    label: "Due Soon",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 13 })
  },
  overdue: {
    label: "Overdue",
    badgeClass: "bg-destructive/15 text-destructive border-destructive/25",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 13 })
  },
  upcoming: {
    label: "Upcoming",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 13 })
  }
};
function exportBillsCSV(bills, year, month) {
  const rows = [
    [
      "Name",
      "Category",
      "Amount (N$)",
      "Due Day",
      "Status",
      "Paid Date",
      "Paid Amount (N$)"
    ],
    ...bills.map((b) => {
      var _a, _b;
      const paidDate = ((_a = b.payment) == null ? void 0 : _a.paidDate) ? new Date(Number(b.payment.paidDate) / 1e6).toLocaleDateString(
        "en-ZA"
      ) : "";
      const paidAmt = ((_b = b.payment) == null ? void 0 : _b.paidAmountCents) != null ? (Number(b.payment.paidAmountCents) / 100).toFixed(2) : "";
      return [
        b.template.name,
        b.budgetCategory,
        (Number(b.template.amountCents) / 100).toFixed(2),
        String(Number(b.template.dayOfMonth)),
        STATUS_CONFIG[b.status].label,
        paidDate,
        paidAmt
      ];
    })
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bills-${getMonthName(month)}-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
function MarkPaidDialog({ bill, year, month, onClose }) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [paidDate, setPaidDate] = reactExports.useState(today);
  const [paidAmount, setPaidAmount] = reactExports.useState(
    bill ? String(Number(bill.template.amountCents) / 100) : ""
  );
  const createBill = useCreateBillPayment();
  const updateBill = useUpdateBillPayment();
  const isPending = createBill.isPending || updateBill.isPending;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!bill) return;
    const paidTs = BigInt(new Date(paidDate).getTime()) * BigInt(1e6);
    const paidCents = BigInt(Math.round(Number.parseFloat(paidAmount) * 100));
    const input = {
      recurringTemplateId: String(bill.template.id),
      year: BigInt(year),
      month: BigInt(month),
      dueDay: bill.template.dayOfMonth,
      paidDate: paidTs,
      paidAmountCents: paidCents,
      notes: bill.template.notes
    };
    try {
      if (bill.payment) {
        await updateBill.mutateAsync({ id: bill.payment.id, input });
      } else {
        await createBill.mutateAsync(input);
      }
      ue.success(`${bill.template.name} marked as paid`);
      onClose();
    } catch {
      ue.error("Failed to save payment. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!bill, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-base", children: [
      "Mark as Paid — ",
      bill == null ? void 0 : bill.template.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paid-date", className: "text-xs font-medium", children: "Payment Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "paid-date",
            type: "date",
            value: paidDate,
            max: today,
            onChange: (e) => setPaidDate(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paid-amount", className: "text-xs font-medium", children: "Amount Paid (N$)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "paid-amount",
            type: "number",
            step: "0.01",
            min: "0",
            value: paidAmount,
            onChange: (e) => setPaidAmount(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "flex-1",
            onClick: onClose,
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "flex-1", disabled: isPending, children: isPending ? "Saving…" : "Confirm Payment" })
      ] })
    ] })
  ] }) });
}
function BillCard({ bill, onMarkPaid }) {
  const { template, payment, status, budgetCategory } = bill;
  const cfg = STATUS_CONFIG[status];
  const icon = CATEGORY_ICONS[budgetCategory] ?? "📦";
  const isPaid = status === "paid";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group relative bg-card border border-border rounded-2xl p-4 shadow-subtle hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0 mt-0.5", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate font-display", children: template.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: `text-[10px] font-semibold gap-0.5 py-0 px-1.5 h-5 ${cfg.badgeClass}`,
            children: [
              cfg.icon,
              cfg.label
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: bill.budgetName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Due day ",
          Number(template.dayOfMonth)
        ] }),
        isPaid && (payment == null ? void 0 : payment.paidDate) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
            "Paid",
            " ",
            new Date(
              Number(payment.paidDate) / 1e6
            ).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "short"
            })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-foreground font-display tabular-nums", children: formatCents(template.amountCents) }),
      !isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: status === "overdue" ? "destructive" : "default",
          className: "h-7 text-xs px-3 rounded-lg",
          onClick: () => onMarkPaid(bill),
          children: "Mark Paid"
        }
      ) : (payment == null ? void 0 : payment.paidAmountCents) != null && payment.paidAmountCents !== template.amountCents ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground tabular-nums", children: [
        "Paid ",
        formatCents(payment.paidAmountCents)
      ] }) : null
    ] })
  ] }) });
}
function useAllRecurringTemplates(year, month) {
  const { data: budgets = [], isLoading: budgetsLoading } = useListBudgets(
    year,
    month
  );
  return { budgets, isLoading: budgetsLoading };
}
function BillsPage() {
  const now = /* @__PURE__ */ new Date();
  const [year, setYear] = reactExports.useState(now.getFullYear());
  const [month, setMonth] = reactExports.useState(now.getMonth() + 1);
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [markPaidBill, setMarkPaidBill] = reactExports.useState(null);
  const { budgets, isLoading: budgetsLoading } = useAllRecurringTemplates(
    year,
    month
  );
  const { data: payments = [], isLoading: paymentsLoading } = useListBillPayments(year, month);
  const [allTemplates, setAllTemplates] = reactExports.useState([]);
  const isLoading = budgetsLoading || paymentsLoading;
  const bills = reactExports.useMemo(() => {
    return allTemplates.map(({ template, budgetName, budgetCategory }) => {
      const payment = payments.find(
        (p) => p.recurringTemplateId === String(template.id)
      );
      const status = getBillStatus(
        Number(template.dayOfMonth),
        payment,
        year,
        month
      );
      return { template, payment, status, budgetName, budgetCategory };
    }).sort((a, b) => {
      const order = {
        overdue: 0,
        "due-soon": 1,
        upcoming: 2,
        paid: 3
      };
      return order[a.status] - order[b.status];
    });
  }, [allTemplates, payments, year, month]);
  const filteredBills = reactExports.useMemo(() => {
    if (activeFilter === "all") return bills;
    return bills.filter((b) => b.status === activeFilter);
  }, [bills, activeFilter]);
  const counts = reactExports.useMemo(
    () => ({
      all: bills.length,
      "due-soon": bills.filter((b) => b.status === "due-soon").length,
      overdue: bills.filter((b) => b.status === "overdue").length,
      paid: bills.filter((b) => b.status === "paid").length
    }),
    [bills]
  );
  const filterTabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "due-soon", label: "Due Soon", count: counts["due-soon"] },
    { key: "overdue", label: "Overdue", count: counts.overdue },
    { key: "paid", label: "Paid", count: counts.paid }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-5 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-tight", children: "Bill Reminders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Track upcoming and recurring bills from your budget templates" })
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
        bills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-1.5 h-9 rounded-xl text-xs",
            onClick: () => exportBillsCSV(bills, year, month),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
              "Export CSV"
            ]
          }
        )
      ] })
    ] }),
    budgets.map((budget) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      BudgetTemplateLoader,
      {
        budgetId: budget.id,
        budgetName: budget.name,
        budgetCategory: budget.category,
        onTemplatesLoaded: (items) => {
          setAllTemplates((prev) => {
            const withoutThis = prev.filter(
              (t) => t.budgetName !== budget.name || !items.some((i) => i.template.id === t.template.id)
            );
            return [...withoutThis, ...items];
          });
        }
      },
      budget.id.toString()
    )),
    !isLoading && budgets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-1 bg-muted/50 rounded-xl border border-border w-fit", children: filterTabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveFilter(tab.key),
        className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${activeFilter === tab.key ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`,
        children: [
          tab.label,
          tab.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-[10px] font-bold px-1.5 py-0 rounded-full leading-5 ${activeFilter === tab.key ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
              children: tab.count
            }
          )
        ]
      },
      tab.key
    )) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl" }, k)) }) : budgets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyStateNoTemplates, {}) : filteredBills.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-card/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 22, className: "text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mb-1", children: "No bills match this filter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: 'Try switching to "All" to see everything.' }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "mt-3 text-xs",
          onClick: () => setActiveFilter("all"),
          children: "Clear filter"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredBills.map((bill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      BillCard,
      {
        bill,
        onMarkPaid: (b) => setMarkPaidBill(b)
      },
      bill.template.id.toString()
    )) }),
    bills.length > 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(BillsSummary, { bills }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MarkPaidDialog,
      {
        bill: markPaidBill,
        year,
        month,
        onClose: () => setMarkPaidBill(null)
      }
    )
  ] });
}
function BudgetTemplateLoader({
  budgetId,
  budgetName,
  budgetCategory,
  onTemplatesLoaded
}) {
  const { data: templates = [] } = useRecurringTemplates(budgetId);
  const onTemplatesLoadedRef = reactExports.useRef(onTemplatesLoaded);
  onTemplatesLoadedRef.current = onTemplatesLoaded;
  reactExports.useEffect(() => {
    if (templates.length > 0) {
      onTemplatesLoadedRef.current(
        templates.map((t) => ({ template: t, budgetName, budgetCategory }))
      );
    }
  }, [templates, budgetName, budgetCategory]);
  return null;
}
function EmptyStateNoTemplates() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 26, className: "text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground mb-2 tracking-tight", children: "No recurring templates yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-7 leading-relaxed", children: "Bill reminders are derived from your recurring expense templates. Add a recurring template in a budget to start tracking bills here." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2 rounded-xl h-10 shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 15 }),
      "Go to Budgets"
    ] }) })
  ] });
}
function BillsSummary({ bills }) {
  const totalDue = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + Number(b.template.amountCents), 0);
  const totalPaid = bills.filter((b) => b.status === "paid").reduce(
    (s, b) => {
      var _a;
      return s + Number(((_a = b.payment) == null ? void 0 : _a.paidAmountCents) ?? b.template.amountCents);
    },
    0
  );
  const overdue = bills.filter((b) => b.status === "overdue").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 pt-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 shadow-subtle text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Still Due" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base font-display tabular-nums text-foreground", children: formatCents(totalDue) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 shadow-subtle text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Paid This Month" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base font-display tabular-nums text-emerald-600 dark:text-emerald-400", children: formatCents(totalPaid) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 shadow-subtle text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Overdue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-bold text-base font-display tabular-nums ${overdue > 0 ? "text-destructive" : "text-foreground"}`,
          children: overdue
        }
      )
    ] })
  ] });
}
export {
  BillsPage
};
