import type {
  BillPayment,
  BillPaymentInput,
  Budget,
  BudgetTemplate,
  BudgetTemplateInput,
  CategoryBreakdownPoint,
  CategoryTrendPoint,
  DailySpendingPoint,
  Expense,
  Income,
  IncomeInput,
  MonthlySummary,
  MonthlyTrendPoint,
  Note,
  RecurringIncome,
  RecurringIncomeInput,
  RecurringTemplate,
  RecurringTemplateInput,
  SavingsGoal,
  SavingsGoalInput,
  UpcomingBill,
  UserSettings,
} from "../types";

export interface BudgetInput {
  name: string;
  limitCents: bigint;
  color: string;
  category: string;
  year: bigint;
  month: bigint;
}

export interface ExpenseInput {
  budgetId: bigint;
  date: string;
  amountCents: bigint;
  notes?: string;
  receiptUrl?: string;
}

/** Contract implemented by supabaseBackend.ts and consumed by useBudget.ts / useTemplates.ts. */
export interface Backend {
  applyBudgetTemplate(
    templateId: string,
    year: bigint,
    month: bigint,
  ): Promise<Budget[]>;
  applyRecurringIncomes(year: bigint, month: bigint): Promise<Income[]>;
  applyRecurringTemplates(year: bigint, month: bigint): Promise<Expense[]>;
  contributeSavingsGoal(
    id: string,
    amountCents: bigint,
  ): Promise<SavingsGoal | null>;

  createBillPayment(input: BillPaymentInput): Promise<BillPayment>;
  createBudget(input: BudgetInput): Promise<Budget>;
  createBudgetTemplate(input: BudgetTemplateInput): Promise<BudgetTemplate>;
  createExpense(input: ExpenseInput): Promise<Expense>;
  createIncome(input: IncomeInput): Promise<Income>;
  createNote(title: string, content: string): Promise<Note>;
  createRecurringIncome(input: RecurringIncomeInput): Promise<RecurringIncome>;
  createRecurringTemplate(
    input: RecurringTemplateInput,
  ): Promise<RecurringTemplate>;
  createSavingsGoal(input: SavingsGoalInput): Promise<SavingsGoal>;

  deleteBillPayment(id: string): Promise<boolean>;
  deleteBudget(id: bigint): Promise<boolean>;
  deleteBudgetTemplate(id: string): Promise<boolean>;
  deleteExpense(id: bigint): Promise<boolean>;
  deleteIncome(id: bigint): Promise<boolean>;
  deleteNote(id: string): Promise<boolean>;
  deleteRecurringIncome(id: bigint): Promise<boolean>;
  deleteRecurringTemplate(id: bigint): Promise<boolean>;
  deleteSavingsGoal(id: string): Promise<boolean>;

  exportAllData(): Promise<string>;

  getBillPayment(id: string): Promise<BillPayment | null>;
  getBudget(id: bigint): Promise<Budget | null>;
  getBudgetTemplate(id: string): Promise<BudgetTemplate | null>;
  getCategoryBreakdown(
    year: bigint,
    month: bigint,
  ): Promise<CategoryBreakdownPoint[]>;
  getCategoryBreakdownForRange(
    startDate: string,
    endDate: string,
  ): Promise<CategoryBreakdownPoint[]>;
  getCategoryTrend(
    budgetId: bigint,
    months: bigint,
    currentYear: bigint,
    currentMonth: bigint,
  ): Promise<CategoryTrendPoint[]>;
  getDailySpending(
    year: bigint,
    month: bigint,
  ): Promise<DailySpendingPoint[]>;
  getExpense(id: bigint): Promise<Expense | null>;
  getExpensesInRange(startDate: string, endDate: string): Promise<Expense[]>;
  getIncome(id: bigint): Promise<Income | null>;
  getMonthlySummary(year: bigint, month: bigint): Promise<MonthlySummary>;
  getMonthlyTrend(
    months: bigint,
    currentYear: bigint,
    currentMonth: bigint,
  ): Promise<MonthlyTrendPoint[]>;
  getRecurringIncome(id: bigint): Promise<RecurringIncome | null>;
  getRecurringTemplate(id: bigint): Promise<RecurringTemplate | null>;
  getSavingsGoal(id: string): Promise<SavingsGoal | null>;
  getUpcomingBills(withinDays: bigint): Promise<UpcomingBill[]>;
  getUserSettings(): Promise<UserSettings>;

  importAllData(json: string): Promise<boolean>;

  listAllBudgets(): Promise<Budget[]>;
  listBillPayments(year: bigint, month: bigint): Promise<BillPayment[]>;
  listBudgets(year: bigint, month: bigint): Promise<Budget[]>;
  listBudgetTemplates(): Promise<BudgetTemplate[]>;
  listExpenses(budgetId: bigint): Promise<Expense[]>;
  listExpensesWithReceipts(): Promise<Expense[]>;
  listIncome(year: bigint, month: bigint): Promise<Income[]>;
  listNotes(): Promise<Note[]>;
  listRecurringIncomes(): Promise<RecurringIncome[]>;
  listRecurringTemplates(budgetId: bigint): Promise<RecurringTemplate[]>;
  listSavingsGoals(): Promise<SavingsGoal[]>;

  searchExpenses(
    startDate: string,
    endDate: string,
    queryText: string | null,
    categoryId: bigint | null,
    minAmountCents: bigint | null,
    maxAmountCents: bigint | null,
  ): Promise<Expense[]>;

  updateBillPayment(
    id: string,
    input: BillPaymentInput,
  ): Promise<BillPayment | null>;
  updateBudget(id: bigint, input: BudgetInput): Promise<Budget | null>;
  updateBudgetTemplate(
    id: string,
    input: BudgetTemplateInput,
  ): Promise<BudgetTemplate | null>;
  updateExpense(id: bigint, input: ExpenseInput): Promise<Expense | null>;
  updateIncome(id: bigint, input: IncomeInput): Promise<Income | null>;
  updateNote(id: string, title: string, content: string): Promise<Note | null>;
  updateRecurringIncome(
    id: bigint,
    input: RecurringIncomeInput,
  ): Promise<RecurringIncome | null>;
  updateRecurringTemplate(
    id: bigint,
    input: RecurringTemplateInput,
  ): Promise<RecurringTemplate | null>;
  updateSavingsGoal(
    id: string,
    input: SavingsGoalInput,
  ): Promise<SavingsGoal | null>;
  updateUserSettings(settings: UserSettings): Promise<UserSettings>;
}
