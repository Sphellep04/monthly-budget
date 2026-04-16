function getBudgetStatus(summary, threshold = 80) {
  const spent = Number(summary.totalSpentCents);
  const limit = Number(summary.budget.limitCents);
  if (limit === 0) return "on-track";
  const pct = spent / limit;
  if (pct >= 1) return "over-budget";
  if (pct >= threshold / 100) return "warning";
  return "on-track";
}
function formatCents(cents) {
  const value = typeof cents === "bigint" ? Number(cents) : cents;
  return `N$${(value / 100).toFixed(2)}`;
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
  CATEGORY_ICONS as C,
  getMonthName as a,
  formatCents as f,
  getBudgetStatus as g
};
