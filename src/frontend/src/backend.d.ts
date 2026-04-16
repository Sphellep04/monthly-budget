import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Timestamp = bigint;
export interface BudgetTemplateCategory {
    limitCents: bigint;
    name: string;
    color: string;
    category: string;
}
export interface MonthlyTrendPoint {
    month: bigint;
    totalSpentCents: bigint;
    year: bigint;
}
export interface BudgetTemplateInput {
    categories: Array<BudgetTemplateCategory>;
    name: string;
}
export interface CategoryBreakdownPoint {
    name: string;
    color: string;
    amountCents: bigint;
    budgetId: string;
}
export interface MonthlySummary {
    month: bigint;
    totalSpentCents: bigint;
    year: bigint;
    totalBudgetCents: bigint;
    budgets: Array<BudgetSummary>;
}
export interface Expense {
    id: bigint;
    recurringTemplateId?: bigint;
    receiptUrl?: string;
    owner: UserId;
    date: string;
    createdAt: Timestamp;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export type UserId = Principal;
export interface RecurringTemplateInput {
    name: string;
    dayOfMonth: bigint;
    amountCents: bigint;
    budgetId: bigint;
    notes?: string;
}
export interface DailySpendingPoint {
    day: bigint;
    amountCents: bigint;
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
export interface BudgetSummary {
    totalSpentCents: bigint;
    budget: Budget;
    remainingCents: bigint;
}
export interface BillPaymentInput {
    month: bigint;
    recurringTemplateId: string;
    year: bigint;
    paidDate?: Timestamp;
    paidAmountCents?: bigint;
    dueDay: bigint;
    notes?: string;
}
export interface BillPayment {
    id: string;
    month: bigint;
    recurringTemplateId: string;
    owner: UserId;
    year: bigint;
    paidDate?: Timestamp;
    paidAmountCents?: bigint;
    dueDay: bigint;
    notes?: string;
}
export interface UserSettings {
    alertThresholdPercent: bigint;
}
export interface ExpenseInput {
    receiptUrl?: string;
    date: string;
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
export interface BudgetTemplate {
    id: string;
    categories: Array<BudgetTemplateCategory>;
    owner: UserId;
    name: string;
    createdAt: Timestamp;
}
export interface Note {
    id: string;
    title: string;
    content: string;
    userId: Principal;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export interface backendInterface {
    applyBudgetTemplate(templateId: string, year: bigint, month: bigint): Promise<Array<Budget>>;
    applyRecurringTemplates(year: bigint, month: bigint): Promise<Array<Expense>>;
    createBillPayment(input: BillPaymentInput): Promise<BillPayment>;
    createBudget(input: BudgetInput): Promise<Budget>;
    createBudgetTemplate(input: BudgetTemplateInput): Promise<BudgetTemplate>;
    createExpense(input: ExpenseInput): Promise<Expense>;
    createNote(title: string, content: string): Promise<Note>;
    createRecurringTemplate(input: RecurringTemplateInput): Promise<RecurringTemplate>;
    deleteBillPayment(id: string): Promise<boolean>;
    deleteBudget(id: bigint): Promise<boolean>;
    deleteBudgetTemplate(id: string): Promise<boolean>;
    deleteExpense(id: bigint): Promise<boolean>;
    deleteNote(id: string): Promise<boolean>;
    deleteRecurringTemplate(id: bigint): Promise<boolean>;
    getBillPayment(id: string): Promise<BillPayment | null>;
    getBudget(id: bigint): Promise<Budget | null>;
    getBudgetTemplate(id: string): Promise<BudgetTemplate | null>;
    getCategoryBreakdown(year: bigint, month: bigint): Promise<Array<CategoryBreakdownPoint>>;
    getCategoryBreakdownForRange(startDate: string, endDate: string): Promise<Array<CategoryBreakdownPoint>>;
    getCategoryTrend(budgetId: bigint, months: bigint, currentYear: bigint, currentMonth: bigint): Promise<Array<CategoryTrendPoint>>;
    getDailySpending(year: bigint, month: bigint): Promise<Array<DailySpendingPoint>>;
    getExpense(id: bigint): Promise<Expense | null>;
    getExpensesInRange(startDate: string, endDate: string): Promise<Array<Expense>>;
    getMonthlySummary(year: bigint, month: bigint): Promise<MonthlySummary>;
    getMonthlyTrend(months: bigint, currentYear: bigint, currentMonth: bigint): Promise<Array<MonthlyTrendPoint>>;
    getRecurringTemplate(id: bigint): Promise<RecurringTemplate | null>;
    getUserSettings(): Promise<UserSettings>;
    listBillPayments(year: bigint, month: bigint): Promise<Array<BillPayment>>;
    listBudgetTemplates(): Promise<Array<BudgetTemplate>>;
    listBudgets(year: bigint, month: bigint): Promise<Array<Budget>>;
    listExpenses(budgetId: bigint): Promise<Array<Expense>>;
    listNotes(): Promise<Array<Note>>;
    listRecurringTemplates(budgetId: bigint): Promise<Array<RecurringTemplate>>;
    searchExpenses(startDate: string, endDate: string, queryText: string | null, categoryId: bigint | null, minAmountCents: bigint | null, maxAmountCents: bigint | null): Promise<Array<Expense>>;
    updateBillPayment(id: string, input: BillPaymentInput): Promise<BillPayment | null>;
    updateBudget(id: bigint, input: BudgetInput): Promise<Budget | null>;
    updateBudgetTemplate(id: string, input: BudgetTemplateInput): Promise<BudgetTemplate | null>;
    updateExpense(id: bigint, input: ExpenseInput): Promise<Expense | null>;
    updateNote(id: string, title: string, content: string): Promise<Note | null>;
    updateRecurringTemplate(id: bigint, input: RecurringTemplateInput): Promise<RecurringTemplate | null>;
    updateUserSettings(settings: UserSettings): Promise<UserSettings>;
}
