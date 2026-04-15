import { c as createLucideIcon, j as jsxRuntimeExports, g as cn, m as useAddExpense, r as reactExports, X, b as LoaderCircle, B as Button, l as ue, n as useDeleteExpense, S as Skeleton, o as useCreateRecurringTemplate, p as useUpdateRecurringTemplate, W as Wallet, q as useDeleteRecurringTemplate, s as useParams, t as useBudgetSummary, v as useExpenses, w as useRecurringTemplates, L as Link } from "./index-BYRpzxol.js";
import { a as CircleAlert, f as formatCents, B as Badge, g as getBudgetStatus, C as CATEGORY_ICONS, c as ChevronRight, T as TriangleAlert } from "./index-DPeRZWL7.js";
import { l as Dialog, m as DialogContent, n as DialogHeader, o as DialogTitle, p as DialogDescription, I as Input, L as Label, T as Trash2, j as DeleteConfirmDialog, k as Plus } from "./DeleteConfirmDialog-C9fl8C3h.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", key: "1osxxc" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }]
];
const CalendarClock = createLucideIcon("calendar-clock", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "16", height: "18", x: "4", y: "4", rx: "2", key: "1u9h20" }],
  ["path", { d: "M8 10h6", key: "3oa6kw" }],
  ["path", { d: "M8 14h8", key: "1fgep2" }],
  ["path", { d: "M8 18h5", key: "17enja" }]
];
const NotepadText = createLucideIcon("notepad-text", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M14 8H8", key: "1l3xfs" }],
  ["path", { d: "M16 12H8", key: "1fr5h0" }],
  ["path", { d: "M13 16H8", key: "wsln4y" }]
];
const ReceiptText = createLucideIcon("receipt-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
];
const Receipt = createLucideIcon("receipt", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z", key: "qazsjp" }],
  ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4", key: "40519r" }]
];
const StickyNote = createLucideIcon("sticky-note", __iconNode);
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
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
function todayISO() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function FieldLabel$1({
  children,
  htmlFor,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Label,
    {
      htmlFor,
      className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5",
      children: [
        icon,
        children
      ]
    }
  );
}
async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [receiptFile, setReceiptFile] = reactExports.useState(null);
  const [receiptPreview, setReceiptPreview] = reactExports.useState(null);
  const [receiptError, setReceiptError] = reactExports.useState("");
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const fileInputRef = reactExports.useRef(null);
  function reset() {
    setDate(todayISO());
    setAmountStr("");
    setNotes("");
    setAmountError("");
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptError("");
    setIsUploading(false);
    setUploadProgress(0);
  }
  function handleClose(v) {
    if (!v) reset();
    onOpenChange(v);
  }
  function validateAmount(val) {
    const n = Number.parseFloat(val);
    if (!val || !Number.isFinite(n) || n <= 0) {
      setAmountError("Please enter a valid amount greater than N$0.00");
      return false;
    }
    setAmountError("");
    return true;
  }
  function handleFileChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setReceiptError("Only JPG, PNG, GIF or WEBP images are allowed.");
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setReceiptError("File is too large. Maximum size is 5 MB.");
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }
    setReceiptError("");
    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);
  }
  function removeReceipt() {
    setReceiptFile(null);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(null);
    setReceiptError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAmount(amountStr)) return;
    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));
    let receiptUrl;
    if (receiptFile) {
      setIsUploading(true);
      setUploadProgress(10);
      try {
        const tick = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 15, 85));
        }, 120);
        receiptUrl = await fileToDataURL(receiptFile);
        clearInterval(tick);
        setUploadProgress(100);
      } catch {
        setIsUploading(false);
        setReceiptError("Failed to process receipt image. Please try again.");
        return;
      } finally {
        setIsUploading(false);
      }
    }
    try {
      await addExpense.mutateAsync({
        budgetId,
        date,
        amountCents,
        notes: notes.trim() || void 0,
        receiptUrl
      });
      ue.success("Expense added");
      handleClose(false);
    } catch {
      ue.error("Failed to add expense");
    }
  }
  const isBusy = addExpense.isPending || isUploading;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md bg-card border-border shadow-premium backdrop-blur-md",
      "data-ocid": "expense_form.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl font-bold text-foreground", children: "Add Expense" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-muted-foreground", children: "Record a new expense against this budget." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldLabel$1,
              {
                htmlFor: "expense-date",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3" }),
                children: "Date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "expense-date",
                type: "date",
                value: date,
                onChange: (e) => setDate(e.target.value),
                required: true,
                className: "input-focus h-10 font-mono text-sm",
                "data-ocid": "expense_form.date.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldLabel$1,
              {
                htmlFor: "expense-amount",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(NotepadText, { className: "w-3 h-3" }),
                children: "Amount"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none", children: "N$" }),
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
                  className: `pl-9 input-focus h-10 font-mono text-sm ${amountError ? "border-destructive focus:border-destructive" : ""}`,
                  "data-ocid": "expense_form.amount.input",
                  "aria-invalid": !!amountError
                }
              )
            ] }),
            amountError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "flex items-center gap-1.5 text-xs text-destructive mt-1",
                "data-ocid": "expense_form.amount.field_error",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }),
                  amountError
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FieldLabel$1,
              {
                htmlFor: "expense-notes",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "w-3 h-3" }),
                children: [
                  "Notes",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 normal-case font-normal tracking-normal", children: "(optional)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "expense-notes",
                placeholder: "e.g. Weekly grocery run at Shoprite",
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                rows: 2,
                className: "input-focus text-sm resize-none",
                "data-ocid": "expense_form.notes.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(FieldLabel$1, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-3 h-3" }), children: [
              "Receipt",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 normal-case font-normal tracking-normal", children: "(optional)" })
            ] }),
            receiptPreview ? (
              /* Preview card */
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl border border-border overflow-hidden bg-muted/20 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: receiptPreview,
                    alt: "Receipt preview",
                    className: "w-full max-h-48 object-contain"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: removeReceipt,
                    className: "absolute top-2 right-2 w-6 h-6 rounded-full bg-card/90 border border-border shadow-subtle flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/40 transition-colors",
                    "aria-label": "Remove receipt",
                    "data-ocid": "expense_form.receipt_remove_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 text-foreground" })
                  }
                ),
                receiptFile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1.5 bg-muted/40 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: receiptFile.name }) })
              ] })
            ) : (
              /* Upload area */
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  className: "w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors px-4 py-5 flex flex-col items-center gap-2 group",
                  "data-ocid": "expense_form.receipt.dropzone",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-card border border-border shadow-subtle flex items-center justify-center group-hover:border-primary/30 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Click to attach a receipt photo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/60", children: "JPG, PNG, GIF or WEBP · max 5 MB" })
                  ]
                }
              )
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/jpeg,image/png,image/gif,image/webp",
                className: "hidden",
                onChange: handleFileChange,
                "data-ocid": "expense_form.receipt_file_input"
              }
            ),
            receiptError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "flex items-center gap-1.5 text-xs text-destructive mt-1",
                "data-ocid": "expense_form.receipt.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }),
                  receiptError
                ]
              }
            ),
            isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "mt-2 space-y-1",
                "data-ocid": "expense_form.receipt.loading_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }),
                      "Processing receipt…"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-mono text-muted-foreground", children: [
                      uploadProgress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full bg-primary rounded-full transition-all duration-200",
                      style: { width: `${uploadProgress}%` }
                    }
                  ) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 button-hover",
                onClick: () => handleClose(false),
                "data-ocid": "expense_form.cancel_button",
                disabled: isBusy,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "flex-1 button-hover shadow-elevated",
                disabled: isBusy,
                "data-ocid": "expense_form.submit_button",
                children: isBusy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  isUploading ? "Uploading…" : "Saving…"
                ] }) : "Add Expense"
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
function openReceiptInTab(dataUrl) {
  try {
    const [header, b64] = dataUrl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1e4);
    if (!win) {
      ue.error("Popup blocked — please allow popups for this site.");
    }
  } catch {
    ue.error("Could not open receipt.");
  }
}
function ReceiptBadge({ url }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => openReceiptInTab(url),
      title: "View receipt",
      className: "flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/8 border border-primary/20 text-primary hover:bg-primary/15 transition-colors text-[10px] font-medium shrink-0",
      "data-ocid": "expense_list.receipt_link",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-3 h-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Receipt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-2.5 h-2.5 opacity-70" })
      ]
    }
  );
}
function ExpenseList({
  expenses,
  isLoading,
  onAddFirst
}) {
  const deleteExpense = useDeleteExpense();
  async function handleDelete(id) {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "expense_list.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, i)) });
  }
  if (expenses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-14 text-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20",
        "data-ocid": "expense_list.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-card border border-border shadow-subtle flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-5 h-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold text-sm mb-0.5", children: "No expenses yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[200px]", children: "Track your first expense to start monitoring this budget." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: onAddFirst,
              className: "mt-1 button-hover text-xs",
              "data-ocid": "expense_list.add_first_button",
              children: "Add First Expense"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", "data-ocid": "expense_list.list", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto_auto] gap-3 px-4 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date & Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right pr-1", children: "Amount" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border overflow-hidden shadow-subtle bg-card divide-y divide-border", children: expenses.map((expense, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group grid grid-cols-[1fr_auto_auto] gap-3 items-center px-4 py-3.5 hover:bg-muted/30 transition-colors-fast",
        "data-ocid": `expense_list.item.${idx + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground font-mono leading-tight tabular-nums", children: formatDate(expense.date) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
              expense.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: expense.notes }),
              expense.receiptUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptBadge, { url: expense.receiptUrl })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground tabular-nums pr-1", children: formatCents(expense.amountCents) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "w-7 h-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-smooth rounded-lg",
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
        className: "flex items-center justify-between px-4 pt-3 pb-1",
        "data-ocid": "expense_list.subtotal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-muted-foreground", children: [
            expenses.length,
            " expense",
            expenses.length !== 1 ? "s" : "",
            " total"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground tabular-nums", children: formatCents(totalCents) })
        ]
      }
    )
  ] });
}
function FieldLabel({
  children,
  htmlFor,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Label,
    {
      htmlFor,
      className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5",
      children: [
        icon,
        children
      ]
    }
  );
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
  const [errors, setErrors] = reactExports.useState({});
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
    setErrors({});
  }, [existing]);
  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required.";
    const amount = Math.round(Number.parseFloat(amountStr) * 100);
    if (Number.isNaN(amount) || amount <= 0)
      errs.amount = "Enter a valid amount.";
    const day = Number.parseInt(dayOfMonth, 10);
    if (Number.isNaN(day) || day < 1 || day > 31)
      errs.day = "Day must be between 1 and 31.";
    return errs;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));
    const day = Number.parseInt(dayOfMonth, 10);
    const input = {
      budgetId,
      name: name.trim(),
      amountCents,
      dayOfMonth: BigInt(day),
      notes: notes.trim() || void 0
    };
    if (isEditing && templateId !== null) {
      updateTemplate.mutate(
        { id: templateId, input },
        {
          onSuccess: () => {
            ue.success("Template updated");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md shadow-premium backdrop-blur-md",
      "data-ocid": "recurring_form.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl font-bold", children: isEditing ? "Edit Recurring Expense" : "Add Recurring Expense" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-muted-foreground", children: isEditing ? "Update this recurring expense template." : "This expense will be auto-applied each month on the day you choose." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldLabel,
              {
                htmlFor: "rt-name",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "w-3 h-3" }),
                children: "Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "rt-name",
                placeholder: "e.g. Netflix subscription",
                value: name,
                onChange: (e) => setName(e.target.value),
                "data-ocid": "recurring_form.name_input",
                autoFocus: true,
                className: `input-focus h-10 ${errors.name ? "border-destructive" : ""}`
              }
            ),
            errors.name && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-destructive mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
              errors.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldLabel,
              {
                htmlFor: "rt-amount",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-3 h-3" }),
                children: "Amount"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none", children: "N$" }),
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
                  "data-ocid": "recurring_form.amount_input",
                  className: `pl-9 input-focus h-10 font-mono text-sm ${errors.amount ? "border-destructive" : ""}`
                }
              )
            ] }),
            errors.amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-destructive mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
              errors.amount
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FieldLabel,
              {
                htmlFor: "rt-day",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "w-3 h-3" }),
                children: "Day of Month"
              }
            ),
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
                "data-ocid": "recurring_form.day_input",
                className: `input-focus h-10 font-mono w-32 ${errors.day ? "border-destructive" : ""}`
              }
            ),
            errors.day ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-destructive mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
              errors.day
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: "For months with fewer days, the expense will be created on the last available day." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FieldLabel,
              {
                htmlFor: "rt-notes",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "w-3 h-3" }),
                children: [
                  "Notes",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60 normal-case font-normal tracking-normal", children: "(optional)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "rt-notes",
                placeholder: "e.g. Annual plan, paid monthly",
                rows: 2,
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                "data-ocid": "recurring_form.notes_textarea",
                className: "input-focus text-sm resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2.5 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => onOpenChange(false),
                "data-ocid": "recurring_form.cancel_button",
                className: "button-hover",
                disabled: isPending,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isPending,
                "data-ocid": "recurring_form.submit_button",
                className: "button-hover shadow-elevated min-w-[120px]",
                children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  "Saving…"
                ] }) : isEditing ? "Save Changes" : "Add Template"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" })
    ] });
  }
  if (templates.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-10 px-6 text-center rounded-2xl border border-dashed border-border bg-muted/20",
        "data-ocid": "recurring.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-secondary/8 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "w-5 h-5 text-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "No recurring expenses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-[220px]", children: "Add a recurring template to auto-create expenses each month." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "recurring.list", children: templates.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-border bg-card hover:bg-muted/20 hover:border-secondary/20 hover:shadow-subtle transition-smooth",
        "data-ocid": `recurring.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 shadow-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: t.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] px-1.5 py-0 bg-secondary/8 text-secondary border-secondary/20 flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "w-2.5 h-2.5" }),
                      ordinal(Number(t.dayOfMonth)),
                      " of month"
                    ]
                  }
                )
              ] }),
              t.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: t.notes })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-bold text-foreground tabular-nums mr-1", children: formatCents(t.amountCents) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth rounded-lg",
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
                className: "h-7 w-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-smooth rounded-lg",
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
function AnimatedProgressBar({
  spentCents,
  limitCents,
  status,
  pctNum
}) {
  const barRef = reactExports.useRef(null);
  const [rendered, setRendered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setRendered(true), 60);
    return () => clearTimeout(t);
  }, []);
  const trackColor = status === "over-budget" ? "bg-destructive/15" : status === "warning" ? "bg-warning/15" : "bg-muted";
  const fillGradient = status === "over-budget" ? "from-destructive to-destructive/80" : status === "warning" ? "from-accent to-amber-400" : "from-primary to-blue-400";
  const pct = Math.min(pctNum, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-3 rounded-full w-full overflow-hidden ${trackColor} shadow-inner-subtle`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: barRef,
            className: `h-full rounded-full bg-gradient-to-r ${fillGradient} transition-all duration-700 ease-out relative overflow-hidden`,
            style: { width: rendered ? `${pct}%` : "0%" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-mono", children: [
        formatCents(spentCents),
        " of ",
        formatCents(limitCents)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `font-mono font-semibold tabular-nums ${status === "over-budget" ? "text-destructive" : status === "warning" ? "text-accent" : "text-primary"}`,
          children: [
            pctNum,
            "%"
          ]
        }
      )
    ] })
  ] });
}
const STATUS_LABEL = {
  "on-track": "On Track",
  warning: "Near Limit",
  "over-budget": "Over Budget"
};
const STATUS_BADGE_CLASS = {
  "on-track": "bg-primary/10 text-primary border-primary/20",
  warning: "bg-accent/10 text-accent border-accent/20",
  "over-budget": "bg-destructive/10 text-destructive border-destructive/20"
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
        className: "p-4 md:p-8 space-y-5 max-w-2xl mx-auto",
        "data-ocid": "budget_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" })
        ]
      }
    );
  }
  if (!summary) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-4 md:p-8 max-w-2xl mx-auto text-center py-20",
        "data-ocid": "budget_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "w-7 h-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "Budget not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This budget may have been deleted." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/budgets", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
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
      className: "p-4 md:p-8 space-y-6 max-w-2xl mx-auto page-enter",
      "data-ocid": "budget_detail.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/budgets",
            className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors-fast group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform duration-150" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-ocid": "budget_detail.back_button", children: "All Budgets" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-2xl border border-border bg-card shadow-elevated space-y-6 overflow-hidden",
            "data-ocid": "budget_detail.header.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-1.5 w-full",
                  style: {
                    background: `linear-gradient(90deg, ${summary.budget.color}, transparent)`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-6 space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-subtle shrink-0",
                        style: { backgroundColor: `${summary.budget.color}20` },
                        children: icon
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground truncate leading-tight", children: summary.budget.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: summary.budget.category })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs font-semibold shrink-0 px-2.5 py-1 ${STATUS_BADGE_CLASS[status]}`,
                      children: STATUS_LABEL[status]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden shadow-inner-subtle", children: [
                  {
                    label: "Spent",
                    value: formatCents(spentCents),
                    className: "text-foreground",
                    ocid: "budget_detail.spent_amount"
                  },
                  {
                    label: "Limit",
                    value: formatCents(limitCents),
                    className: "text-muted-foreground",
                    ocid: "budget_detail.limit_amount"
                  },
                  {
                    label: remainingCents >= BigInt(0) ? "Remaining" : "Over by",
                    value: formatCents(
                      remainingCents < BigInt(0) ? -remainingCents : remainingCents
                    ),
                    className: remainingCents < BigInt(0) ? "text-destructive" : Number(remainingCents) < Number(limitCents) / 4 ? "text-accent" : "text-primary",
                    ocid: "budget_detail.remaining_amount"
                  }
                ].map(({ label, value, className, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card px-4 py-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `font-mono text-lg font-bold tabular-nums ${className}`,
                      "data-ocid": ocid,
                      children: value
                    }
                  )
                ] }, label)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AnimatedProgressBar,
                  {
                    spentCents,
                    limitCents,
                    status,
                    pctNum
                  }
                )
              ] })
            ]
          }
        ),
        isOverBudget && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 shadow-subtle",
            role: "alert",
            "data-ocid": "budget_detail.overspent_banner",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-destructive", children: "Over budget" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive/80 mt-0.5", children: [
                  "You've exceeded the ",
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Expenses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-12 bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 button-hover shadow-subtle",
                onClick: () => setExpenseFormOpen(true),
                "data-ocid": "budget_detail.add_expense_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add"
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-secondary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Recurring" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] px-2 py-0 bg-secondary/8 text-secondary border-secondary/20",
                  children: "Auto-monthly"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-1.5 button-hover",
                onClick: () => {
                  setEditingTemplate(null);
                  setRecurringFormOpen(true);
                },
                "data-ocid": "budget_detail.add_recurring_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                  "Add"
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
