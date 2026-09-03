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
  rollover: boolean;
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
  splitGroupId?: string;
  createdAt: Timestamp;
}

export type RecurringFrequency = "monthly" | "quarterly" | "annually";

export interface RecurringTemplate {
  id: bigint;
  owner: UserId;
  budgetId: bigint;
  name: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  frequency: RecurringFrequency;
  anchorMonth: bigint | null;
  notes?: string;
  createdAt: Timestamp;
}

export interface RecurringTemplateInput {
  budgetId: bigint;
  name: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  frequency: RecurringFrequency;
  anchorMonth: bigint | null;
  notes?: string;
}

export interface RecurringIncome {
  id: bigint;
  owner: UserId;
  source: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  frequency: RecurringFrequency;
  anchorMonth: bigint | null;
  notes?: string;
  createdAt: Timestamp;
}

export interface RecurringIncomeInput {
  source: string;
  amountCents: bigint;
  dayOfMonth: bigint;
  frequency: RecurringFrequency;
  anchorMonth: bigint | null;
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
  rolloverCents: bigint;
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

export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "loan"
  | "investment"
  | "other";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit Card",
  loan: "Loan",
  investment: "Investment",
  other: "Other",
};

export function isLiabilityAccountType(type: AccountType): boolean {
  return type === "credit_card" || type === "loan";
}

export interface Account {
  id: bigint;
  owner: UserId;
  name: string;
  type: AccountType;
  balanceCents: bigint;
  /** Annual interest rate in basis points (1899 = 18.99% APR). Liability accounts only. */
  interestRateBps: number | null;
  minimumPaymentCents: bigint | null;
  createdAt: Timestamp;
}

export interface AccountInput {
  name: string;
  type: AccountType;
  balanceCents: bigint;
  interestRateBps: number | null;
  minimumPaymentCents: bigint | null;
}

export function getBudgetStatus(
  summary: BudgetSummary,
  threshold = 80,
): BudgetStatus {
  const spent = Number(summary.totalSpentCents);
  const limit =
    Number(summary.budget.limitCents) + Number(summary.rolloverCents);
  if (limit === 0) return "on-track";
  const pct = spent / limit;
  if (pct >= 1) return "over-budget";
  if (pct >= threshold / 100) return "warning";
  return "on-track";
}

// en-ZA gives Namibian/South African-style grouping (space-separated
// thousands, comma decimal) without depending on ICU currency-symbol
// data for NAD, which isn't reliably available across browsers.
const centsFormatter = new Intl.NumberFormat("en-ZA", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCents(cents: bigint | number): string {
  const value = typeof cents === "bigint" ? Number(cents) : cents;
  const dollars = value / 100;
  const sign = dollars < 0 ? "-" : "";
  return `${sign}N$${centsFormatter.format(Math.abs(dollars))}`;
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });
}

export interface Category {
  id: bigint;
  name: string;
}

/** A learned merchant-keyword -> category mapping, used to auto-suggest a
 * category for future expenses that mention the same keyword. */
export interface CategoryRule {
  id: bigint;
  keyword: string;
  category: string;
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
