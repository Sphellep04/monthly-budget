import { c as createLucideIcon, aq as useQuery, ar as useQueryClient, as as useMutation, k as useActorOrMock, x as useBudgets, r as reactExports, j as jsxRuntimeExports, at as BookDashed, B as Button, S as Skeleton, K as CalendarDays, h as useMonthlySummary, z as Dialog, A as DialogContent, C as DialogHeader, E as DialogTitle, G as DialogDescription, v as Label, I as Input, ac as useNavigate, H as ue } from "./index-Dp0P1DkE.js";
import { B as Badge } from "./badge-DytHA40_.js";
import { D as DeleteConfirmDialog } from "./DeleteConfirmDialog-D0U2vxDW.js";
import { C as CATEGORY_ICONS, f as formatCents, a as getMonthName } from "./index-DBqnxCSC.js";
import { P as Plus, T as Trash2 } from "./alert-dialog-DY_7kFNr.js";
import { P as Pencil } from "./pencil-BmjoHCyX.js";
import { L as LoaderCircle } from "./loader-circle-f19j3rqj.js";
import { C as Check } from "./check-CaZKuxim.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
function useListBudgetTemplates() {
  const { actor } = useActorOrMock();
  return useQuery({
    queryKey: ["budget-templates"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listBudgetTemplates();
      return result;
    },
    enabled: !!actor && true
  });
}
function useCreateBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBudgetTemplate({
        name: input.name,
        categories: input.categories
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    }
  });
}
function useUpdateBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({ id, name }) => {
      if (!actor) throw new Error("Actor not ready");
      const existing = await actor.getBudgetTemplate(id);
      if (!existing) throw new Error("Template not found");
      const tpl = existing;
      return actor.updateBudgetTemplate(id, {
        name,
        categories: tpl.categories
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    }
  });
}
function useDeleteBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBudgetTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    }
  });
}
function useApplyBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      templateId,
      year,
      month
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.applyBudgetTemplate(templateId, BigInt(year), BigInt(month));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
    }
  });
}
function templateTotalCents(tpl) {
  return tpl.categories.reduce((sum, c) => sum + Number(c.limitCents), 0);
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function SaveBudgetDialog({
  open,
  onOpenChange,
  year,
  month
}) {
  const [name, setName] = reactExports.useState("");
  const { data: summary, isLoading } = useMonthlySummary(year, month);
  const createTemplate = useCreateBudgetTemplate();
  const budgets = (summary == null ? void 0 : summary.budgets) ?? [];
  async function handleSave() {
    if (!name.trim()) {
      ue.error("Please enter a template name.");
      return;
    }
    if (budgets.length === 0) {
      ue.error("No budget categories to save for this month.");
      return;
    }
    try {
      await createTemplate.mutateAsync({
        name: name.trim(),
        categories: budgets.map((bs) => ({
          name: bs.budget.name,
          limitCents: bs.budget.limitCents,
          color: bs.budget.color,
          category: bs.budget.category
        }))
      });
      ue.success("Template saved!", {
        description: `"${name.trim()}" is ready to reuse.`
      });
      setName("");
      onOpenChange(false);
    } catch {
      ue.error("Failed to save template. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg shadow-premium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg font-bold", children: "Save Current Budget as Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm text-muted-foreground", children: [
          getMonthName(month),
          " ",
          year,
          " · ",
          budgets.length,
          " categories"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tpl-name", className: "text-sm font-medium", children: "Template name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tpl-name",
            placeholder: "e.g. Monthly Essentials",
            value: name,
            onChange: (e) => setName(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleSave(),
            className: "h-9",
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Categories to save" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 rounded-lg" }, k)) }) : budgets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground py-3 text-center", children: [
          "No budgets found for ",
          getMonthName(month),
          " ",
          year,
          "."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 max-h-52 overflow-y-auto pr-1", children: budgets.map((bs) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/50 border border-border/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-border/40",
                  style: { background: bs.budget.color }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: CATEGORY_ICONS[bs.budget.category] ?? "📦" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-foreground truncate", children: bs.budget.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono flex-shrink-0", children: formatCents(bs.budget.limitCents) })
            ]
          },
          bs.budget.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 justify-end pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onOpenChange(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: handleSave,
            disabled: createTemplate.isPending || !name.trim(),
            className: "min-w-[110px]",
            children: createTemplate.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-1.5 animate-spin" }),
              "Saving…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 14, className: "mr-1.5" }),
              "Save Template"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function RenameDialog({
  template,
  onClose
}) {
  const [name, setName] = reactExports.useState((template == null ? void 0 : template.name) ?? "");
  const updateTemplate = useUpdateBudgetTemplate();
  async function handleRename() {
    if (!template || !name.trim()) return;
    try {
      await updateTemplate.mutateAsync({ id: template.id, name: name.trim() });
      ue.success("Template renamed successfully.");
      onClose();
    } catch {
      ue.error("Failed to rename template. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!template, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm shadow-premium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base font-bold", children: "Rename Template" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm text-muted-foreground", children: [
        'Enter a new name for "',
        template == null ? void 0 : template.name,
        '".'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: name,
          onChange: (e) => setName(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleRename(),
          placeholder: "Template name",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            onClick: handleRename,
            disabled: updateTemplate.isPending || !name.trim(),
            children: updateTemplate.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : "Save"
          }
        )
      ] })
    ] })
  ] }) });
}
function ApplyTemplateDialog({
  template,
  year,
  month,
  onClose
}) {
  const applyTemplate = useApplyBudgetTemplate();
  const navigate = useNavigate();
  async function handleApply() {
    if (!template) return;
    try {
      await applyTemplate.mutateAsync({
        templateId: template.id,
        year,
        month
      });
      ue.success("Template applied!", {
        description: `Budgets for ${getMonthName(month)} ${year} are ready.`
      });
      onClose();
      navigate({ to: "/budgets" });
    } catch {
      ue.error("Failed to apply template. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!template, onOpenChange: () => onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm shadow-premium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base font-bold", children: "Apply Template" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm text-muted-foreground leading-relaxed", children: [
        "This will create new budgets for",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
          getMonthName(month),
          " ",
          year
        ] }),
        " ",
        "using template",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
          '"',
          template == null ? void 0 : template.name,
          '"'
        ] }),
        ". Continue?"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          onClick: handleApply,
          disabled: applyTemplate.isPending,
          className: "min-w-[90px]",
          children: applyTemplate.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "mr-1.5 animate-spin" }),
            "Applying…"
          ] }) : "Apply"
        }
      )
    ] })
  ] }) });
}
function TemplateCard({
  template,
  onApply,
  onRename,
  onDelete
}) {
  const preview = template.categories.slice(0, 3);
  const extra = template.categories.length - 3;
  const totalCents = templateTotalCents(template);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group flex flex-col bg-card border border-border/60 rounded-xl shadow-subtle hover:shadow-elevated transition-shadow duration-200 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 px-4 pt-4 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-[0.9375rem] text-foreground truncate leading-tight", children: template.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 11 }),
          "Saved ",
          formatDate(template.createdAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "flex-shrink-0 text-xs font-mono bg-muted/60 text-muted-foreground",
          children: [
            template.categories.length,
            " categories"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-3 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1", children: [
      preview.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-center gap-2 text-sm text-foreground/80",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-2.5 h-2.5 rounded-full flex-shrink-0",
                style: { background: cat.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: CATEGORY_ICONS[cat.category] ?? "📦" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[0.8125rem]", children: cat.name })
          ]
        },
        cat.name
      )),
      extra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground pl-4", children: [
        "+",
        extra,
        " more…"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2.5 border-t border-border/40 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Total limit:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: formatCents(totalCents) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-4 py-3 border-t border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => onApply(template),
          className: "flex-1 h-8 text-xs font-medium",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 13, className: "mr-1.5" }),
            "Load Template"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onRename(template),
          className: "h-8 w-8 p-0",
          "aria-label": "Rename template",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => onDelete(template),
          className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30",
          "aria-label": "Delete template",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
        }
      )
    ] })
  ] });
}
function TemplatesPage() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { data: templates, isLoading } = useListBudgetTemplates();
  useBudgets(year, month);
  const [saveOpen, setSaveOpen] = reactExports.useState(false);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [applyTarget, setApplyTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const deleteTemplate = useDeleteBudgetTemplate();
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteTemplate.mutateAsync(deleteTarget.id);
      ue.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete template. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border/60 px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookDashed, { size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground tracking-tight", children: "Budget Templates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Save your budget setup and reuse it in future months." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setSaveOpen(true),
          className: "flex items-center gap-2 self-start sm:self-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            "Save Current Budget"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-6 py-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" }, k)) }) : !templates || templates.length === 0 ? (
      /* Empty state */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookDashed, { size: 28 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground mb-2", children: "No templates yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed", children: "Save your current month's budget categories as a reusable template so you can apply them to any future month in seconds." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setSaveOpen(true),
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
              "Save Current Budget"
            ]
          }
        )
      ] })
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: templates.map((tpl, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TemplateCard,
      {
        template: tpl,
        index: i + 1,
        onApply: setApplyTarget,
        onRename: setRenameTarget,
        onDelete: setDeleteTarget
      },
      tpl.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SaveBudgetDialog,
      {
        open: saveOpen,
        onOpenChange: setSaveOpen,
        year,
        month
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RenameDialog,
      {
        template: renameTarget,
        onClose: () => setRenameTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApplyTemplateDialog,
      {
        template: applyTarget,
        year,
        month,
        onClose: () => setApplyTarget(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        title: "Delete Template",
        description: `"${deleteTarget == null ? void 0 : deleteTarget.name}" will be permanently deleted. This cannot be undone.`,
        onConfirm: handleDelete,
        isPending: deleteTemplate.isPending
      }
    )
  ] });
}
export {
  TemplatesPage
};
