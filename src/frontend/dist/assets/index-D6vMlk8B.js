import { j as jsxRuntimeExports, E as Slot, g as cn, F as cva } from "./index-CWkzYjiE.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
function getBudgetStatus(summary) {
  const spent = Number(summary.totalSpentCents);
  const limit = Number(summary.budget.limitCents);
  if (limit === 0) return "on-track";
  const pct = spent / limit;
  if (pct >= 1) return "over-budget";
  if (pct >= 0.75) return "warning";
  return "on-track";
}
function formatCents(cents) {
  const value = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value / 100);
}
function getMonthName(month) {
  return new Date(2e3, month - 1, 1).toLocaleString("en-US", {
    month: "long"
  });
}
const CATEGORY_ICONS = {
  Groceries: "🛒",
  Housing: "🏠",
  "Dining Out": "🍽️",
  Transportation: "🚗",
  Shopping: "🛍️",
  Utilities: "💡",
  Entertainment: "🎬",
  Health: "💊",
  Travel: "✈️",
  Education: "📚",
  Other: "📦"
};
export {
  Badge as B,
  CATEGORY_ICONS as C,
  getMonthName as a,
  formatCents as f,
  getBudgetStatus as g
};
