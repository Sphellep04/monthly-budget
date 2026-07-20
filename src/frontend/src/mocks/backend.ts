import type { BrowserStorageBackend } from "../backends/browserStorageBackend";
import type {
  BillPayment,
  BillPaymentInput,
  Budget,
  BudgetSummary,
  BudgetTemplate,
  BudgetTemplateCategory,
  BudgetTemplateInput,
  CategoryBreakdownPoint,
  CategoryTrendPoint,
  DailySpendingPoint,
  Expense,
  MonthlyTrendPoint,
  MonthlySummary,
  Note,
  RecurringTemplate,
  RecurringTemplateInput,
} from "../types";

const stubOwner = "local-user";

const mockBudgets: Budget[] = [
  {
    id: BigInt(1),
    owner: stubOwner,
    name: "Groceries",
    limitCents: BigInt(80000),
    color: "#22c55e",
    category: "Groceries",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    owner: stubOwner,
    name: "Housing",
    limitCents: BigInt(180000),
    color: "#3b82f6",
    category: "Housing",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    owner: stubOwner,
    name: "Dining Out",
    limitCents: BigInt(45000),
    color: "#f97316",
    category: "Dining Out",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    owner: stubOwner,
    name: "Transportation",
    limitCents: BigInt(30000),
    color: "#f59e0b",
    category: "Transportation",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(5),
    owner: stubOwner,
    name: "Shopping",
    limitCents: BigInt(25000),
    color: "#ef4444",
    category: "Shopping",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(6),
    owner: stubOwner,
    name: "Utilities",
    limitCents: BigInt(40000),
    color: "#06b6d4",
    category: "Utilities",
    year: BigInt(2026),
    month: BigInt(4),
    createdAt: BigInt(Date.now()),
  },
];

const mockMonthlySummary: MonthlySummary = {
  year: BigInt(2026),
  month: BigInt(4),
  totalBudgetCents: BigInt(400000),
  totalSpentCents: BigInt(278430),
  budgets: [
    { budget: mockBudgets[0], totalSpentCents: BigInt(45000), remainingCents: BigInt(35000) },
    { budget: mockBudgets[1], totalSpentCents: BigInt(135000), remainingCents: BigInt(45000) },
    { budget: mockBudgets[2], totalSpentCents: BigInt(31000), remainingCents: BigInt(14000) },
    { budget: mockBudgets[3], totalSpentCents: BigInt(21000), remainingCents: BigInt(9000) },
    { budget: mockBudgets[4], totalSpentCents: BigInt(28430), remainingCents: BigInt(-3430) },
    { budget: mockBudgets[5], totalSpentCents: BigInt(18000), remainingCents: BigInt(22000) },
  ] as BudgetSummary[],
};

const mockExpenses: Expense[] = [
  { id: BigInt(1), budgetId: BigInt(1), owner: stubOwner, date: "2026-04-10", amountCents: BigInt(4500), notes: "Weekly grocery run", createdAt: BigInt(Date.now()) },
  { id: BigInt(2), budgetId: BigInt(1), owner: stubOwner, date: "2026-04-08", amountCents: BigInt(12300), notes: "Farmers market", createdAt: BigInt(Date.now()) },
];

export const mockBackend = {
  createBudget: async (input: Omit<Budget, "id" | "owner" | "createdAt">) => ({ ...input, id: BigInt(99), owner: stubOwner, createdAt: BigInt(Date.now()) } as Budget),
  createExpense: async (input: Omit<Expense, "id" | "owner" | "createdAt">) => ({ ...input, id: BigInt(99), owner: stubOwner, createdAt: BigInt(Date.now()), notes: input.notes } as Expense),
  deleteBudget: async (_id: bigint) => true,
  deleteExpense: async (_id: bigint) => true,
  getBudget: async (id: bigint) => mockBudgets.find(b => b.id === id) ?? null,
  getExpense: async (id: bigint) => mockExpenses.find(e => e.id === id) ?? null,
  getMonthlySummary: async () => mockMonthlySummary,
  listBudgets: async (_year: bigint, _month: bigint) => mockBudgets,
  listExpenses: async (_budgetId: bigint) => mockExpenses,
  updateBudget: async (id: bigint, input: Omit<Budget, "id" | "owner" | "createdAt">) => ({ ...input, id, owner: stubOwner, createdAt: BigInt(Date.now()) } as Budget),
  updateExpense: async (id: bigint, input: Omit<Expense, "id" | "owner" | "createdAt">) => ({ ...input, id, owner: stubOwner, createdAt: BigInt(Date.now()), notes: input.notes } as Expense),
  // New methods for recurring templates
  applyRecurringTemplates: async (_year: bigint, _month: bigint) => [] as Expense[],
  createRecurringTemplate: async (input: RecurringTemplateInput) => ({ ...input, id: BigInt(99), owner: stubOwner, createdAt: BigInt(Date.now()) } as RecurringTemplate),
  deleteRecurringTemplate: async (_id: bigint) => true,
  getRecurringTemplate: async (_id: bigint) => null,
  listRecurringTemplates: async (_budgetId: bigint) => [] as RecurringTemplate[],
  updateRecurringTemplate: async (id: bigint, input: RecurringTemplateInput) => ({ ...input, id, owner: stubOwner, createdAt: BigInt(Date.now()) } as RecurringTemplate),
  // Trend methods
  getMonthlyTrend: async (_months, currentYear, currentMonth) => {
    const points: MonthlyTrendPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      let y = Number(currentYear);
      let m = Number(currentMonth) - i;
      while (m <= 0) { m += 12; y--; }
      points.push({ year: BigInt(y), month: BigInt(m), totalSpentCents: BigInt(Math.round(150000 + Math.random() * 100000)) });
    }
    return points;
  },
  getCategoryTrend: async (budgetId, _months, currentYear, currentMonth) => {
    const points: CategoryTrendPoint[] = [];
    const budget = mockBudgets.find(b => b.id === budgetId);
    if (!budget) return points;
    for (let i = 5; i >= 0; i--) {
      let y = Number(currentYear);
      let m = Number(currentMonth) - i;
      while (m <= 0) { m += 12; y--; }
      points.push({
        year: BigInt(y), month: BigInt(m),
        budgetId, budgetName: budget.name,
        spentCents: BigInt(Math.round(Number(budget.limitCents) * 0.4 + Math.random() * Number(budget.limitCents) * 0.6)),
        limitCents: budget.limitCents,
      });
    }
    return points;
  },
  // New chart methods
  getCategoryBreakdown: async () => {
    return mockBudgets.map((b): CategoryBreakdownPoint => ({
      budgetId: b.id.toString(),
      name: b.name,
      amountCents: BigInt(Math.round(Number(b.limitCents) * (0.3 + Math.random() * 0.7))),
      color: b.color,
    }));
  },
  getDailySpending: async (_year, _month) => {
    const points: DailySpendingPoint[] = [];
    for (let d = 1; d <= 30; d++) {
      if (Math.random() > 0.4) {
        points.push({ day: BigInt(d), amountCents: BigInt(Math.round(1000 + Math.random() * 15000)) });
      }
    }
    return points;
  },
  // Notes methods
  createNote: async (title: string, content: string) => ({
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
  } as Note),
  deleteNote: async (_id: string) => true,
  listNotes: async () => [] as Note[],
  updateNote: async (id: string, title: string, content: string) => ({
    id,
    title,
    content,
    createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
  } as Note),
  // User settings
  getUserSettings: async () => ({ alertThresholdPercent: 80 }),
  updateUserSettings: async (settings) => settings,
  // Range-based queries
  getExpensesInRange: async (_startDate, _endDate) => mockExpenses,
  getCategoryBreakdownForRange: async (_startDate, _endDate) => {
    return mockBudgets.map((b): CategoryBreakdownPoint => ({
      budgetId: b.id.toString(),
      name: b.name,
      amountCents: BigInt(Math.round(Number(b.limitCents) * (0.3 + Math.random() * 0.7))),
      color: b.color,
    }));
  },
  // Search
  searchExpenses: async () => mockExpenses,
  // Bill Payment methods
  createBillPayment: async (input: BillPaymentInput): Promise<BillPayment> => ({
    ...input,
    id: `anon-bp-1`,
    owner: stubOwner,
  }),
  getBillPayment: async (_id: string): Promise<BillPayment | null> => null,
  listBillPayments: async (_year: bigint, _month: bigint): Promise<BillPayment[]> => [],
  updateBillPayment: async (_id: string, input: BillPaymentInput): Promise<BillPayment | null> => ({
    ...input,
    id: _id,
    owner: stubOwner,
  }),
  deleteBillPayment: async (_id: string): Promise<boolean> => true,
  // Budget Template methods
  createBudgetTemplate: async (input: BudgetTemplateInput): Promise<BudgetTemplate> => ({
    ...input,
    id: `anon-bt-1`,
    owner: stubOwner,
    createdAt: BigInt(Date.now()),
  }),
  listBudgetTemplates: async (): Promise<BudgetTemplate[]> => [],
  getBudgetTemplate: async (_id: string): Promise<BudgetTemplate | null> => null,
  updateBudgetTemplate: async (_id: string, input: BudgetTemplateInput): Promise<BudgetTemplate | null> => ({
    ...input,
    id: _id,
    owner: stubOwner,
    createdAt: BigInt(Date.now()),
  }),
  deleteBudgetTemplate: async (_id: string): Promise<boolean> => true,
  applyBudgetTemplate: async (_templateId: string, _year: bigint, _month: bigint): Promise<Budget[]> => [],
};
