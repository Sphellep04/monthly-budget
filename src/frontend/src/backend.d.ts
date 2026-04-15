import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export type Timestamp = bigint;
export interface RecurringTemplateInput {
    name: string;
    dayOfMonth: bigint;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export interface RecurringTemplate {
    id: bigint;
    owner: UserId;
    name: string;
    createdAt: Timestamp;
    dayOfMonth: bigint;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export interface CategoryTrendPoint {
    month: bigint;
    limitCents: bigint;
    year: bigint;
    spentCents: bigint;
    budgetId: bigint;
    budgetName: string;
}
export interface MonthlyTrendPoint {
    month: bigint;
    totalSpentCents: bigint;
    year: bigint;
}
export interface BudgetSummary {
    totalSpentCents: bigint;
    budget: Budget;
    remainingCents: bigint;
}
export interface MonthlySummary {
    month: bigint;
    totalSpentCents: bigint;
    year: bigint;
    totalBudgetCents: bigint;
    budgets: Array<BudgetSummary>;
}
export interface ExpenseInput {
    date: string;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export interface Expense {
    id: bigint;
    recurringTemplateId?: bigint;
    owner: UserId;
    date: string;
    createdAt: Timestamp;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export interface BudgetInput {
    month: bigint;
    limitCents: bigint;
    name: string;
    color: string;
    year: bigint;
    category: string;
}
export interface Budget {
    id: bigint;
    month: bigint;
    owner: UserId;
    limitCents: bigint;
    name: string;
    createdAt: Timestamp;
    color: string;
    year: bigint;
    category: string;
}
export interface backendInterface {
    applyRecurringTemplates(year: bigint, month: bigint): Promise<Array<Expense>>;
    createBudget(input: BudgetInput): Promise<Budget>;
    createExpense(input: ExpenseInput): Promise<Expense>;
    createRecurringTemplate(input: RecurringTemplateInput): Promise<RecurringTemplate>;
    deleteBudget(id: bigint): Promise<boolean>;
    deleteExpense(id: bigint): Promise<boolean>;
    deleteRecurringTemplate(id: bigint): Promise<boolean>;
    getBudget(id: bigint): Promise<Budget | null>;
    getCategoryTrend(budgetId: bigint, months: bigint, currentYear: bigint, currentMonth: bigint): Promise<Array<CategoryTrendPoint>>;
    getExpense(id: bigint): Promise<Expense | null>;
    getMonthlySummary(year: bigint, month: bigint): Promise<MonthlySummary>;
    getMonthlyTrend(months: bigint, currentYear: bigint, currentMonth: bigint): Promise<Array<MonthlyTrendPoint>>;
    getRecurringTemplate(id: bigint): Promise<RecurringTemplate | null>;
    listBudgets(year: bigint, month: bigint): Promise<Array<Budget>>;
    listExpenses(budgetId: bigint): Promise<Array<Expense>>;
    listRecurringTemplates(budgetId: bigint): Promise<Array<RecurringTemplate>>;
    updateBudget(id: bigint, input: BudgetInput): Promise<Budget | null>;
    updateExpense(id: bigint, input: ExpenseInput): Promise<Expense | null>;
    updateRecurringTemplate(id: bigint, input: RecurringTemplateInput): Promise<RecurringTemplate | null>;
}
