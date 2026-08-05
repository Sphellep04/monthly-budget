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
  receiptUrl?: string;
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

export interface RecurringIncome {
  id: bigint;
  owner: UserId;
  source: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  notes?: string;
  createdAt: Timestamp;
}

export interface RecurringIncomeInput {
  source: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  notes?: string;
}

export interface MonthlyTrendPoint {
  year: bigint;
  month: bigint;
  totalSpentCents: bigint;
}

export interface DailySpendingPoint {
  day: bigint;
  amountCents: bigint;
}

export interface CategoryBreakdownPoint {
  budgetId: string;
  name: string;
  amountCents: bigint;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: bigint;
  updatedAt: bigint;
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
  totalIncomeCents: bigint;
  budgets: BudgetSummary[];
}

export type BudgetStatus = "on-track" | "warning" | "over-budget";

export interface UserSettings {
  alertThresholdPercent: number;
}

export interface BudgetTemplateCategory {
  name: string;
  limitCents: bigint;
  color: string;
  category: string;
}

export interface BudgetTemplate {
  id: string;
  owner: string;
  name: string;
  createdAt: bigint;
  categories: BudgetTemplateCategory[];
}

export interface BudgetTemplateInput {
  name: string;
  categories: BudgetTemplateCategory[];
}

export interface BillPayment {
  id: string;
  owner: string;
  recurringTemplateId: string;
  year: bigint;
  month: bigint;
  dueDay: bigint;
  paidDate?: bigint;
  paidAmountCents?: bigint;
  notes?: string;
}

export interface BillPaymentInput {
  recurringTemplateId: string;
  year: bigint;
  month: bigint;
  dueDay: bigint;
  paidDate?: bigint;
  paidAmountCents?: bigint;
  notes?: string;
}

export type BillStatus = "paid" | "due-soon" | "overdue" | "upcoming";

export interface UpcomingBill {
  id: string;
  name: string;
  amountCents: bigint;
  dueDay: bigint;
  budgetName: string;
  daysUntilDue: number;
}

export interface Income {
  id: bigint;
  owner: UserId;
  source: string;
  amountCents: bigint;
  date: string;
  notes?: string;
  recurringIncomeId?: bigint;
  createdAt: Timestamp;
}

export interface IncomeInput {
  source: string;
  amountCents: bigint;
  date: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  owner: UserId;
  name: string;
  targetCents: bigint;
  savedCents: bigint;
  targetDate?: string;
  color: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

export interface SavingsGoalInput {
  name: string;
  targetCents: bigint;
  targetDate?: string;
  color: string;
}

export function getBudgetStatus(
  summary: BudgetSummary,
  threshold = 80,
): BudgetStatus {
  const spent = Number(summary.totalSpentCents);
  const limit = Number(summary.budget.limitCents);
  if (limit === 0) return "on-track";
  const pct = spent / limit;
  if (pct >= 1) return "over-budget";
  if (pct >= threshold / 100) return "warning";
  return "on-track";
}

export function formatCents(cents: bigint | number): string {
  const value = typeof cents === "bigint" ? Number(cents) : cents;
  return `N$${(value / 100).toFixed(2)}`;
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
}

export const CATEGORIES: string[] = [
  "Groceries",
  "Housing",
  "Dining Out",
  "Transportation",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Health",
  "Travel",
  "Education",
  "Other",
];
