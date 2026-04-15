import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, n as useAddExpense, r as reactExports, B as Button, m as ue, o as useDeleteExpense, S as Skeleton, p as useCreateRecurringTemplate, q as useUpdateRecurringTemplate, s as useDeleteRecurringTemplate, t as useParams, v as useBudgetSummary, w as useExpenses, x as useRecurringTemplates, L as Link } from "./index-CWkzYjiE.js";
import { f as formatCents, g as getBudgetStatus, C as CATEGORY_ICONS, B as Badge } from "./index-D6vMlk8B.js";
import { l as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, L as Label, I as Input, T as Trash2, j as DeleteConfirmDialog, k as Plus } from "./DeleteConfirmDialog-aFG9-aDG.js";
import { T as TriangleAlert } from "./triangle-alert-DMGWLQLw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function ExpenseForm({
  budgetId,
  open,
  onOpenChange
}) {
  const addExpense = useAddExpense();
  const [date, setDate] = reactExports.useState(todayISO());
  const [amountStr, setAmountStr] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [amountError, setAmountError] = reactExports.useState("");
  function reset() {
    setDate(todayISO());
    setAmountStr("");
    setNotes("");
    setAmountError("");
  }
  function handleClose(v) {
    if (!v) reset();
    onOpenChange(v);
  }
  function validateAmount(val) {
    const n = Number.parseFloat(val);
    if (!val || !Number.isFinite(n) || n <= 0) {
      setAmountError("Please enter a valid amount greater than $0.00");
      return false;
    }
    setAmountError("");
    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAmount(amountStr)) return;
    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));
    try {
      await addExpense.mutateAsync({
        budgetId,
        date,
        amountCents,
        notes: notes.trim() || void 0
      });
      ue.success("Expense added");
      handleClose(false);
    } catch {
      ue.error("Failed to add expense");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md bg-card border-border",
      "data-ocid": "expense_form.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg text-foreground", children: "Add Expense" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expense-date", className: "text-sm text-foreground", children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "expense-date",
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                required: true,
                className: "bg-input border-border font-mono text-sm",
                "data-ocid": "expense_form.date.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expense-amount", className: "text-sm text-foreground", children: "Amount (USD)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none", children: "$" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "expense-amount",
                  type: "number",
                  step: "0.01",
                  min: "0.01",
                  placeholder: "0.00",
                  value: amountStr,
                  onChange: (e) => setAmountStr(e.target.value),
                  onBlur: () => validateAmount(amountStr),
                  className: "pl-7 bg-input border-border font-mono text-sm",
                  "data-ocid": "expense_form.amount.input"
                }
              )
            ] }),
            amountError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "expense_form.amount.field_error",
                children: amountError
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "expense-notes", className: "text-sm text-foreground", children: [
              "Notes",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "expense-notes",
                placeholder: "e.g. Weekly grocery run",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                rows: 3,
                className: "bg-input border-border text-sm resize-none",
                "data-ocid": "expense_form.notes.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 border-border",
                onClick: () => handleClose(false),
                "data-ocid": "expense_form.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1",
                disabled: addExpense.isPending,
                "data-ocid": "expense_form.submit_button",
                children: addExpense.isPending ? "Saving…" : "Add Expense"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function ExpenseList({
  expenses,
  isLoading,
  onAddFirst
}) {
  const deleteExpense = useDeleteExpense();
  async function handleDelete(id, idx) {
    try {
      await deleteExpense.mutateAsync(id);
      ue.success("Expense removed");
    } catch {
      ue.error("Failed to delete expense");
    }
  }
  const totalCents = expenses.reduce(
    (sum, e) => sum + e.amountCents,
    BigInt(0)
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "expense_list.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-lg" }, i)) });
  }
  if (expenses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center gap-4",
        "data-ocid": "expense_list.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-6 h-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "No expenses yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Track your first expense to start monitoring this budget." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onAddFirst,
              className: "border-border mt-1",
              "data-ocid": "expense_list.add_first_button",
              children: "Add First Expense"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", "data-ocid": "expense_list.list", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] gap-4 px-3 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date & Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "Amount" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border rounded-xl border border-border overflow-hidden", children: expenses.map((expense, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-[1fr_auto_auto] gap-4 items-center px-3 py-3.5 bg-card hover:bg-muted/40 transition-smooth",
        "data-ocid": `expense_list.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground font-mono leading-tight", children: formatDate(expense.date) }),
            expense.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: expense.notes })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground tabular-nums", children: formatCents(expense.amountCents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
              onClick: () => handleDelete(expense.id),
              disabled: deleteExpense.isPending,
              "aria-label": "Delete expense",
              "data-ocid": `expense_list.delete_button.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ]
      },
      expense.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-3 pt-4 border-t border-border mt-1",
        "data-ocid": "expense_list.subtotal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
            "Total (",
            expenses.length,
            " expense",
            expenses.length !== 1 ? "s" : "",
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-base font-bold text-foreground tabular-nums", children: formatCents(totalCents) })
        ]
      }
    )
  ] });
}
function RecurringTemplateForm({
  budgetId,
  templateId,
  templates,
  open,
  onOpenChange
}) {
  const isEditing = templateId !== null;
  const existing = templates.find((t) => t.id === templateId) ?? null;
  const [name, setName] = reactExports.useState("");
  const [amountStr, setAmountStr] = reactExports.useState("");
  const [dayOfMonth, setDayOfMonth] = reactExports.useState("1");
  const [notes, setNotes] = reactExports.useState("");
  const createTemplate = useCreateRecurringTemplate();
  const updateTemplate = useUpdateRecurringTemplate();
  const isPending = createTemplate.isPending || updateTemplate.isPending;
  reactExports.useEffect(() => {
    if (existing) {
      setName(existing.name);
      setAmountStr((Number(existing.amountCents) / 100).toFixed(2));
      setDayOfMonth(existing.dayOfMonth.toString());
      setNotes(existing.notes ?? "");
    } else {
      setName("");
      setAmountStr("");
      setDayOfMonth("1");
      setNotes("");
    }
  }, [existing]);
  function handleSubmit(e) {
    e.preventDefault();
    const amountCents = Math.round(Number.parseFloat(amountStr) * 100);
    const day = Number.parseInt(dayOfMonth, 10);
    if (!name.trim()) {
      ue.error("Please enter a name");
      return;
    }
    if (Number.isNaN(amountCents) || amountCents <= 0) {
      ue.error("Please enter a valid amount");
      return;
    }
    if (Number.isNaN(day) || day < 1 || day > 31) {
      ue.error("Day of month must be between 1 and 31");
      return;
    }
    const input = {
      budgetId,
      name: name.trim(),
      amountCents: BigInt(amountCents),
      dayOfMonth: BigInt(day),
      notes: notes.trim() || void 0
    };
    if (isEditing && templateId !== null) {
      updateTemplate.mutate(
        { id: templateId, input },
        {
          onSuccess: () => {
            ue.success("Recurring template updated");
            onOpenChange(false);
          },
          onError: () => ue.error("Failed to update template")
        }
      );
    } else {
      createTemplate.mutate(input, {
        onSuccess: () => {
          ue.success("Recurring template added");
          onOpenChange(false);
        },
        onError: () => ue.error("Failed to create template")
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "recurring_form.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: isEditing ? "Edit Recurring Expense" : "Add Recurring Expense" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rt-name", className: "text-sm font-medium", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "rt-name",
            placeholder: "e.g. Netflix subscription",
            value: name,
            onChange: (e) => setName(e.target.value),
            "data-ocid": "recurring_form.name_input",
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rt-amount", className: "text-sm font-medium", children: "Amount ($)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "rt-amount",
            type: "number",
            inputMode: "decimal",
            min: "0.01",
            step: "0.01",
            placeholder: "0.00",
            value: amountStr,
            onChange: (e) => setAmountStr(e.target.value),
            "data-ocid": "recurring_form.amount_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rt-day", className: "text-sm font-medium", children: "Day of month" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "rt-day",
            type: "number",
            inputMode: "numeric",
            min: "1",
            max: "31",
            placeholder: "1–31",
            value: dayOfMonth,
            onChange: (e) => setDayOfMonth(e.target.value),
            "data-ocid": "recurring_form.day_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "For months with fewer days, the expense will be created on the last day." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "rt-notes", className: "text-sm font-medium", children: [
          "Notes",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "rt-notes",
            placeholder: "e.g. Annual plan, paid monthly",
            rows: 2,
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            "data-ocid": "recurring_form.notes_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            "data-ocid": "recurring_form.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending,
            "data-ocid": "recurring_form.submit_button",
            children: isPending ? "Saving…" : isEditing ? "Save Changes" : "Add Template"
          }
        )
      ] })
    ] })
  ] }) });
}
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}
function RecurringTemplateList({
  templates,
  isLoading,
  budgetId,
  onEdit
}) {
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const deleteTemplate = useDeleteRecurringTemplate();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "recurring.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" })
    ] });
  }
  if (templates.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-8 px-6 text-center rounded-xl border border-dashed border-border bg-card/40",
        "data-ocid": "recurring.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-6 w-6 text-muted-foreground mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "No recurring expenses yet. Add one to auto-create expenses each month." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "recurring.list", children: templates.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-smooth",
        "data-ocid": `recurring.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Every ",
                ordinal(Number(t.dayOfMonth)),
                " of the month",
                t.notes ? ` · ${t.notes}` : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground", children: formatCents(t.amountCents) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                onClick: () => onEdit(t.id),
                "data-ocid": `recurring.edit_button.${i + 1}`,
                "aria-label": `Edit ${t.name}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                onClick: () => setDeleteId(t.id),
                "data-ocid": `recurring.delete_button.${i + 1}`,
                "aria-label": `Delete ${t.name}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ]
      },
      t.id.toString()
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: deleteId !== null,
        onOpenChange: (open) => !open && setDeleteId(null),
        title: "Delete recurring template?",
        description: "This will stop future auto-expenses from this template. Existing expenses are not affected.",
        onConfirm: () => {
          if (deleteId !== null) {
            deleteTemplate.mutate({ id: deleteId, budgetId });
            setDeleteId(null);
          }
        }
      }
    )
  ] });
}
function BudgetProgressBar({
  spentCents,
  limitCents,
  status
}) {
  const spent = Number(spentCents);
  const limit = Number(limitCents);
  const pct = limit > 0 ? Math.min(spent / limit * 100, 100) : 0;
  const trackColor = status === "over-budget" ? "bg-destructive/20" : status === "warning" ? "bg-warning/20" : "bg-muted";
  const fillColor = status === "over-budget" ? "bg-destructive" : status === "warning" ? "bg-accent" : "bg-primary";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 rounded-full w-full overflow-hidden ${trackColor}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-full rounded-full transition-all duration-700 ${fillColor}`,
      style: { width: `${pct}%` }
    }
  ) });
}
const STATUS_LABEL = {
  "on-track": "On Track",
  warning: "Warning",
  "over-budget": "Over Budget"
};
const STATUS_BADGE_CLASS = {
  "on-track": "bg-primary/15 text-primary border-primary/25",
  warning: "bg-accent/15 text-accent border-accent/25",
  "over-budget": "bg-destructive/15 text-destructive border-destructive/25"
};
function BudgetDetailPage() {
  const { id } = useParams({ strict: false });
  const budgetId = BigInt(id ?? "0");
  const now = /* @__PURE__ */ new Date();
  const [year] = reactExports.useState(now.getFullYear());
  const [month] = reactExports.useState(now.getMonth() + 1);
  const [expenseFormOpen, setExpenseFormOpen] = reactExports.useState(false);
  const [recurringFormOpen, setRecurringFormOpen] = reactExports.useState(false);
  const [editingTemplate, setEditingTemplate] = reactExports.useState(null);
  const { data: summary, isLoading: summaryLoading } = useBudgetSummary(
    budgetId,
    year,
    month
  );
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(budgetId);
  const { data: templates = [], isLoading: templatesLoading } = useRecurringTemplates(budgetId);
  if (summaryLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 md:p-6 space-y-5 max-w-2xl mx-auto",
        "data-ocid": "budget_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" })
        ]
      }
    );
  }
  if (!summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 md:p-6 max-w-2xl mx-auto text-center py-16",
        "data-ocid": "budget_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Budget not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "gap-1.5",
              "data-ocid": "budget_detail.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                " Back to Budgets"
              ]
            }
          ) })
        ]
      }
    );
  }
  const status = getBudgetStatus(summary);
  const spentCents = summary.totalSpentCents;
  const limitCents = summary.budget.limitCents;
  const remainingCents = limitCents - spentCents;
  const pctNum = Number(limitCents) > 0 ? Math.round(Number(spentCents) / Number(limitCents) * 100) : 0;
  const isOverBudget = status === "over-budget";
  const icon = CATEGORY_ICONS[summary.budget.category] ?? "📦";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-6 max-w-2xl mx-auto",
      "data-ocid": "budget_detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "gap-1.5 text-muted-foreground hover:text-foreground -ml-2",
            "data-ocid": "budget_detail.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
              "All Budgets"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card p-6 shadow-subtle space-y-5",
            "data-ocid": "budget_detail.header.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-3xl leading-none",
                      role: "img",
                      "aria-label": summary.budget.category,
                      children: icon
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-semibold text-foreground truncate", children: summary.budget.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: summary.budget.category })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs font-semibold shrink-0 ${STATUS_BADGE_CLASS[status]}`,
                    children: STATUS_LABEL[status]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium", children: "Spent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-lg font-bold text-foreground tabular-nums",
                      "data-ocid": "budget_detail.spent_amount",
                      children: formatCents(spentCents)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium", children: "Limit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-lg font-semibold text-muted-foreground tabular-nums",
                      "data-ocid": "budget_detail.limit_amount",
                      children: formatCents(limitCents)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium", children: remainingCents >= BigInt(0) ? "Remaining" : "Over by" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-mono text-lg font-semibold tabular-nums ${remainingCents < BigInt(0) ? "text-destructive" : Number(remainingCents) < Number(limitCents) / 4 ? "text-accent" : "text-primary"}`,
                      "data-ocid": "budget_detail.remaining_amount",
                      children: remainingCents < BigInt(0) ? formatCents(-remainingCents) : formatCents(remainingCents)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BudgetProgressBar,
                  {
                    spentCents,
                    limitCents,
                    status
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right font-mono", children: [
                  pctNum,
                  "% used"
                ] })
              ] })
            ]
          }
        ),
        isOverBudget && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3",
            role: "alert",
            "data-ocid": "budget_detail.overspent_banner",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive", children: "Over Budget" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive/80 mt-0.5", children: [
                  "You've exceeded your ",
                  formatCents(limitCents),
                  " limit by",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: formatCents(-remainingCents) }),
                  ". Consider adjusting your spending or increasing this budget."
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Expenses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 transition-smooth",
                onClick: () => setExpenseFormOpen(true),
                "data-ocid": "budget_detail.add_expense_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Add Expense"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ExpenseList,
            {
              expenses,
              isLoading: expensesLoading,
              onAddFirst: () => setExpenseFormOpen(true)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Recurring" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs bg-primary/10 text-primary border-primary/25",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
                    "Auto-applied monthly"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-1.5 transition-smooth",
                onClick: () => {
                  setEditingTemplate(null);
                  setRecurringFormOpen(true);
                },
                "data-ocid": "budget_detail.add_recurring_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Add Recurring"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecurringTemplateList,
            {
              templates,
              isLoading: templatesLoading,
              budgetId,
              onEdit: (templateId) => {
                setEditingTemplate(templateId);
                setRecurringFormOpen(true);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ExpenseForm,
          {
            budgetId,
            open: expenseFormOpen,
            onOpenChange: setExpenseFormOpen
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RecurringTemplateForm,
          {
            budgetId,
            templateId: editingTemplate,
            templates,
            open: recurringFormOpen,
            onOpenChange: (open) => {
              setRecurringFormOpen(open);
              if (!open) setEditingTemplate(null);
            }
          }
        )
      ]
    }
  );
}
export {
  BudgetDetailPage
};
