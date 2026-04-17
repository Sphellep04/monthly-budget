import { r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-Cwi0T1AC.js";
import { a as getMonthName } from "./index-DBqnxCSC.js";
import { C as ChevronLeft } from "./chevron-left-BLK5gBxu.js";
import { C as ChevronRight } from "./chevron-right-Dz6B49L3.js";
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
export {
  MonthSelector as M
};
