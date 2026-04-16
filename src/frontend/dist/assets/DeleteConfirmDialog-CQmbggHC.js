import { j as jsxRuntimeExports, T as TriangleAlert, m as LoaderCircle } from "./index-5R5ykpDg.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CVWV4MhQ.js";
function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      "data-ocid": "delete.dialog",
      className: "max-w-md shadow-premium backdrop-blur-md",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display text-lg font-bold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { className: "text-muted-foreground text-sm leading-relaxed", children: description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "gap-2.5 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              "data-ocid": "delete.cancel_button",
              disabled: isPending,
              className: "button-hover",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              "data-ocid": "delete.confirm_button",
              onClick: (e) => {
                e.preventDefault();
                onConfirm();
              },
              disabled: isPending,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 button-hover shadow-elevated min-w-[90px]",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                "Deleting…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 mr-1.5" }),
                "Delete"
              ] })
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  DeleteConfirmDialog as D
};
