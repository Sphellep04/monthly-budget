export type UserId = string;
export type Timestamp = bigint;

export interface Budget {
  id: bigint;
  owner: UserId;
  name: string;
  limitCents: bigint;
  color: string;
  category: string;
  year: bigint;
  month: bigint;
  createdAt: Timestamp;
}

export interface Expense {
  id: bigint;
  budgetId: bigint;
  owner: UserId;
  date: string;
  amountCents: bigint;
  notes?: string;
  recurringTemplateId?: bigint;
  createdAt: Timestamp;
}

export interface RecurringTemplate {
  id: bigint;
  owner: UserId;
  budgetId: bigint;
  name: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  notes?: string;
  createdAt: Timestamp;
}

export interface RecurringTemplateInput {
  budgetId: bigint;
  name: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  notes?: string;
}

export interface MonthlyTrendPoint {
  year: bigint;
  month: bigint;
  totalSpentCents: bigint;
}

export interface CategoryTrendPoint {
  year: bigint;
  month: bigint;
  budgetId: bigint;
  budgetName: string;
  spentCents: bigint;
  limitCents: bigint;
}

export interface BudgetSummary {
  budget: Budget;
  totalSpentCents: bigint;
  remainingCents: bigint;
}

export interface MonthlySummary {
  year: bigint;
  month: bigint;
  totalBudgetCents: bigint;
  totalSpentCents: bigint;
  budgets: BudgetSummary[];
}

export type BudgetStatus = "on-track" | "warning" | "over-budget";

export function getBudgetStatus(summary: BudgetSummary): BudgetStatus {
  const spent = Number(summary.totalSpentCents);
  const limit = Number(summary.budget.limitCents);
  if (limit === 0) return "on-track";
  const pct = spent / limit;
  if (pct >= 1) return "over-budget";
  if (pct >= 0.75) return "warning";
  return "on-track";
}

export function formatCents(cents: bigint | number): string {
  const value = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value / 100);
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
}

export const CATEGORY_ICONS: Record<string, string> = {
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
  Other: "📦",
};
