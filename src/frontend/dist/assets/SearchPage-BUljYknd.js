import { c as createLucideIcon, r as reactExports, i as useMonthlySummary, al as useSearchExpenses, am as useGetExpensesInRange, j as jsxRuntimeExports, an as Search, B as Button, X, y as Label, I as Input, S as Skeleton } from "./index-Dqswnkm2.js";
import { B as Badge } from "./badge-DgelLSD5.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CG84KrFA.js";
import { C as CATEGORY_ICONS, f as formatCents } from "./index-DBqnxCSC.js";
import { R as Receipt } from "./receipt-CcnoILHR.js";
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
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode);
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function daysAgoISO(days) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}
const DEFAULT_FILTERS = {
  query: "",
  categoryId: "",
  startDate: daysAgoISO(30),
  endDate: todayISO(),
  minAmount: "",
  maxAmount: ""
};
function SearchPage() {
  const [filters, setFilters] = reactExports.useState(DEFAULT_FILTERS);
  const [submitted, setSubmitted] = reactExports.useState(false);
  const now = /* @__PURE__ */ new Date();
  const { data: monthSummary } = useMonthlySummary(
    now.getFullYear(),
    now.getMonth() + 1
  );
  const allBudgets = reactExports.useMemo(
    () => (monthSummary == null ? void 0 : monthSummary.budgets.map((b) => b.budget)) ?? [],
    [monthSummary]
  );
  const searchParams = reactExports.useMemo(() => {
    const minAmt = filters.minAmount !== "" ? Number.parseFloat(filters.minAmount) : void 0;
    const maxAmt = filters.maxAmount !== "" ? Number.parseFloat(filters.maxAmount) : void 0;
    const catId = filters.categoryId !== "" ? BigInt(filters.categoryId) : void 0;
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      query: filters.query.trim() || void 0,
      categoryId: catId,
      minAmountCents: minAmt,
      maxAmountCents: maxAmt
    };
  }, [filters]);
  const hasActiveFilters = filters.query !== "" || filters.categoryId !== "" || filters.startDate !== DEFAULT_FILTERS.startDate || filters.endDate !== DEFAULT_FILTERS.endDate || filters.minAmount !== "" || filters.maxAmount !== "";
  const shouldSearch = hasActiveFilters || submitted;
  const { data: searchResults, isLoading: searchLoading } = useSearchExpenses(
    shouldSearch ? searchParams : null
  );
  const { data: defaultResults, isLoading: defaultLoading } = useGetExpensesInRange(
    DEFAULT_FILTERS.startDate,
    DEFAULT_FILTERS.endDate,
    !shouldSearch
  );
  const results = shouldSearch ? searchResults ?? [] : defaultResults ?? [];
  const isLoading = shouldSearch ? searchLoading : defaultLoading;
  const budgetMap = reactExports.useMemo(() => {
    const map = {};
    for (const b of allBudgets) {
      map[b.id.toString()] = {
        name: b.name,
        category: b.category,
        color: b.color
      };
    }
    return map;
  }, [allBudgets]);
  const totalCents = reactExports.useMemo(
    () => results.reduce((sum, e) => sum + Number(e.amountCents), 0),
    [results]
  );
  const set = reactExports.useCallback(
    (key, val) => {
      setFilters((prev) => ({ ...prev, [key]: val }));
      setSubmitted(true);
    },
    []
  );
  const clearFilters = reactExports.useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSubmitted(false);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-6 py-5 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 18, strokeWidth: 2.2 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground leading-tight", children: "Search Expenses" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Filter by name, category, date range, or amount" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl shadow-subtle p-5 space-y-4",
          "data-ocid": "search.filter_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 14 }),
                "Filters"
              ] }),
              hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: clearFilters,
                  "data-ocid": "search.clear_filters_button",
                  className: "h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }),
                    "Clear all"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "search-query",
                  className: "text-xs text-muted-foreground font-medium",
                  children: "Keyword"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    size: 14,
                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "search-query",
                    "data-ocid": "search.search_input",
                    placeholder: "Search by notes or description…",
                    value: filters.query,
                    onChange: (e) => set("query", e.target.value),
                    className: "pl-8 h-9 text-sm bg-background border-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "search-category",
                    className: "text-xs text-muted-foreground font-medium",
                    children: "Category"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "search-category",
                    "data-ocid": "search.category_select",
                    value: filters.categoryId,
                    onChange: (e) => set("categoryId", e.target.value),
                    className: "w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All categories" }),
                      allBudgets.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: b.id.toString(), children: [
                        CATEGORY_ICONS[b.category] ?? "📦",
                        " ",
                        b.name
                      ] }, b.id.toString()))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "search-start",
                    className: "text-xs text-muted-foreground font-medium",
                    children: "From date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "search-start",
                    "data-ocid": "search.start_date_input",
                    type: "date",
                    value: filters.startDate,
                    max: filters.endDate,
                    onChange: (e) => set("startDate", e.target.value),
                    className: "h-9 text-sm bg-background border-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "search-end",
                    className: "text-xs text-muted-foreground font-medium",
                    children: "To date"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "search-end",
                    "data-ocid": "search.end_date_input",
                    type: "date",
                    value: filters.endDate,
                    min: filters.startDate,
                    max: todayISO(),
                    onChange: (e) => set("endDate", e.target.value),
                    className: "h-9 text-sm bg-background border-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-medium", children: "Amount (N$)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "search.min_amount_input",
                      placeholder: "Min",
                      type: "number",
                      min: 0,
                      value: filters.minAmount,
                      onChange: (e) => set("minAmount", e.target.value),
                      className: "h-9 text-sm bg-background border-input w-full"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 text-xs flex-shrink-0", children: "–" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "search.max_amount_input",
                      placeholder: "Max",
                      type: "number",
                      min: 0,
                      value: filters.maxAmount,
                      onChange: (e) => set("maxAmount", e.target.value),
                      className: "h-9 text-sm bg-background border-input w-full"
                    }
                  )
                ] })
              ] })
            ] })
          ]
        }
      ),
      !isLoading && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid grid-cols-2 gap-4",
          "data-ocid": "search.summary_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-subtle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1", children: "Results" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: results.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "expenses found" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 shadow-subtle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1", children: "Total Spent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-primary", children: formatCents(totalCents) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "across all results" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-xl shadow-subtle overflow-hidden",
          "data-ocid": "search.results_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-b border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: hasActiveFilters || submitted ? "Search Results" : "Last 30 Days" }),
              !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                results.length,
                " expense",
                results.length !== 1 ? "s" : ""
              ] })
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-3", "data-ocid": "search.loading_state", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)) }) : results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center py-16 px-6 text-center",
                "data-ocid": "search.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-2xl", children: "🔍" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-base text-foreground mb-1", children: "No expenses found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: hasActiveFilters ? "Try adjusting your filters — change the date range, clear the keyword, or select a different category." : "No expenses were recorded in the last 30 days. Start adding expenses to your budgets!" }),
                  hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: clearFilters,
                      "data-ocid": "search.empty_clear_button",
                      className: "mt-4 gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
                        "Clear filters"
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold text-muted-foreground w-28", children: "Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold text-muted-foreground", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold text-muted-foreground", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold text-muted-foreground text-right w-28", children: "Amount" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-semibold text-muted-foreground w-16 text-center", children: "Receipt" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: results.map((expense, idx) => {
                const budget = budgetMap[expense.budgetId.toString()];
                const icon = budget ? CATEGORY_ICONS[budget.category] ?? "📦" : "📦";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    "data-ocid": `search.result.item.${idx + 1}`,
                    className: "hover:bg-muted/30 transition-colors duration-150",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground font-mono", children: formatDate(expense.date) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none flex-shrink-0", children: icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: (budget == null ? void 0 : budget.name) ?? "Unknown" }),
                          budget && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 truncate", children: budget.category })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs", children: expense.notes ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm text-foreground/80 truncate",
                          title: expense.notes,
                          children: expense.notes
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/40 italic", children: "No notes" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-sm text-foreground", children: formatCents(expense.amountCents) }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: expense.receiptUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: expense.receiptUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "data-ocid": `search.receipt_link.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Badge,
                            {
                              variant: "secondary",
                              className: "text-[10px] gap-1 px-1.5 py-0.5 cursor-pointer hover:bg-primary/10 transition-colors",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 9 }),
                                "View"
                              ]
                            }
                          )
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-xs", children: "—" }) })
                    ]
                  },
                  expense.id.toString()
                );
              }) })
            ] }) })
          ]
        }
      )
    ] })
  ] });
}
export {
  SearchPage
};
