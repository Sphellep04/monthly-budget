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
  MonthlySummary,
  MonthlyTrendPoint,
  Note,
  RecurringTemplate,
  RecurringTemplateInput,
  UserSettings,
} from "../types";

const STORAGE_KEY = "budgetwise-browser-backend";
const STORAGE_VERSION = 1;
const LOCAL_USER_ID = "local-user";

interface BackendState {
  budgets: Budget[];
  expenses: Expense[];
  recurringTemplates: RecurringTemplate[];
  notes: Note[];
  budgetTemplates: BudgetTemplate[];
  billPayments: BillPayment[];
  userSettings: UserSettings;
}

function createEmptyState(): BackendState {
  return {
    budgets: [],
    expenses: [],
    recurringTemplates: [],
    notes: [],
    budgetTemplates: [],
    billPayments: [],
    userSettings: { alertThresholdPercent: 80 },
  };
}

function nowTimestamp() {
  return BigInt(Date.now());
}

function getOwner() {
  return LOCAL_USER_ID;
}

/** JSON.stringify throws on bigint, so tag it as a round-trippable object. */
function bigIntReplacer(_key: string, value: unknown) {
  if (typeof value === "bigint") {
    return { __bigint__: value.toString() };
  }
  return value;
}

function bigIntReviver(_key: string, value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "__bigint__" in value &&
    typeof (value as { __bigint__: unknown }).__bigint__ === "string"
  ) {
    return BigInt((value as { __bigint__: string }).__bigint__);
  }
  return value;
}

function readState(): BackendState {
  if (typeof window === "undefined") {
    return createEmptyState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state = createEmptyState();
      persistState(state);
      return state;
    }

    const parsed = JSON.parse(raw, bigIntReviver) as Partial<BackendState>;
    return {
      ...createEmptyState(),
      ...parsed,
      budgets: parsed.budgets ?? [],
      expenses: parsed.expenses ?? [],
      recurringTemplates: parsed.recurringTemplates ?? [],
      notes: parsed.notes ?? [],
      budgetTemplates: parsed.budgetTemplates ?? [],
      billPayments: parsed.billPayments ?? [],
      userSettings: parsed.userSettings ?? { alertThresholdPercent: 80 },
    };
  } catch {
    return createEmptyState();
  }
}

function persistState(state: BackendState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...state, version: STORAGE_VERSION }, bigIntReplacer),
  );
}

function toDateParts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function buildMonthlySummary(
  state: BackendState,
  year: bigint,
  month: bigint,
): MonthlySummary {
  const budgets = state.budgets.filter(
    (budget) => budget.year === year && budget.month === month,
  );
  const expenses = state.expenses.filter((expense) => {
    const date = toDateParts(expense.date);
    return BigInt(date.year) === year && BigInt(date.month) === month;
  });

  const budgetSummaries: BudgetSummary[] = budgets.map((budget) => {
    const totalSpentCents = expenses
      .filter((expense) => expense.budgetId === budget.id)
      .reduce((sum, expense) => sum + Number(expense.amountCents), 0);
    return {
      budget,
      totalSpentCents: BigInt(totalSpentCents),
      remainingCents: budget.limitCents - BigInt(totalSpentCents),
    };
  });

  const totalBudgetCents = budgetSummaries.reduce(
    (sum, summary) => sum + Number(summary.budget.limitCents),
    0,
  );
  const totalSpentCents = budgetSummaries.reduce(
    (sum, summary) => sum + Number(summary.totalSpentCents),
    0,
  );

  return {
    month,
    year,
    totalBudgetCents: BigInt(totalBudgetCents),
    totalSpentCents: BigInt(totalSpentCents),
    budgets: budgetSummaries,
  };
}

function getBudgetById(state: BackendState, id: bigint) {
  return state.budgets.find((budget) => budget.id === id) ?? null;
}

function getExpenseById(state: BackendState, id: bigint) {
  return state.expenses.find((expense) => expense.id === id) ?? null;
}

function getRecurringTemplateById(state: BackendState, id: bigint) {
  return (
    state.recurringTemplates.find((template) => template.id === id) ?? null
  );
}

function getBillPaymentById(state: BackendState, id: string) {
  return (
    state.billPayments.find((billPayment) => billPayment.id === id) ?? null
  );
}

function getBudgetTemplateById(state: BackendState, id: string) {
  return state.budgetTemplates.find((template) => template.id === id) ?? null;
}

function getExpensesInRange(
  state: BackendState,
  startDate: string,
  endDate: string,
) {
  return state.expenses.filter(
    (expense) => expense.date >= startDate && expense.date <= endDate,
  );
}

function getCategoryBreakdownPoints(
  state: BackendState,
  year: bigint,
  month: bigint,
) {
  const budgets = state.budgets.filter(
    (budget) => budget.year === year && budget.month === month,
  );

  return budgets.map((budget) => ({
    budgetId: budget.id.toString(),
    name: budget.name,
    amountCents: budget.limitCents,
    color: budget.color,
  }));
}

function getCategoryBreakdownPointsForRange(
  state: BackendState,
  startDate: string,
  endDate: string,
) {
  const relevantExpenses = getExpensesInRange(state, startDate, endDate);
  const totals = new Map<bigint, number>();

  for (const expense of relevantExpenses) {
    const current = totals.get(expense.budgetId) ?? 0;
    totals.set(expense.budgetId, current + Number(expense.amountCents));
  }

  return Array.from(totals.entries()).map(([budgetId, amountCents]) => {
    const budget = getBudgetById(state, budgetId);
    return {
      budgetId: budgetId.toString(),
      name: budget?.name ?? "Unknown",
      amountCents: BigInt(amountCents),
      color: budget?.color ?? "#64748b",
    };
  });
}

function createExpenseFromTemplate(
  state: BackendState,
  template: RecurringTemplate,
  year: number,
  month: number,
) {
  const day = Math.min(
    Number(template.dayOfMonth),
    getDaysInMonth(year, month),
  );
  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const existing = state.expenses.some(
    (expense) =>
      expense.recurringTemplateId === template.id &&
      expense.date === date &&
      expense.budgetId === template.budgetId,
  );

  if (existing) {
    return null;
  }

  const expense: Expense = {
    id: BigInt(Date.now()) + BigInt(Math.floor(Math.random() * 10000)),
    owner: getOwner(),
    budgetId: template.budgetId,
    date,
    amountCents: template.amountCents,
    notes: template.notes,
    createdAt: nowTimestamp(),
    recurringTemplateId: template.id,
  };

  state.expenses.push(expense);
  return expense;
}

export const browserStorageBackend = {
  applyBudgetTemplate: async (templateId, year, month) => {
    const state = readState();
    const template = getBudgetTemplateById(state, templateId);
    if (!template) {
      return [];
    }

    const createdBudgets: Budget[] = [];
    for (const category of template.categories) {
      const existing = state.budgets.some(
        (budget) =>
          budget.year === year &&
          budget.month === month &&
          budget.category === category.category &&
          budget.name === category.name,
      );
      if (existing) {
        continue;
      }
      const budget: Budget = {
        id: BigInt(Date.now()) + BigInt(Math.floor(Math.random() * 10000)),
        owner: getOwner(),
        name: category.name,
        limitCents: category.limitCents,
        color: category.color,
        category: category.category,
        year,
        month,
        createdAt: nowTimestamp(),
      };
      state.budgets.push(budget);
      createdBudgets.push(budget);
    }

    persistState(state);
    return createdBudgets;
  },

  applyRecurringTemplates: async (year, month) => {
    const state = readState();
    const createdExpenses: Expense[] = [];
    for (const template of state.recurringTemplates) {
      const expense = createExpenseFromTemplate(
        state,
        template,
        Number(year),
        Number(month),
      );
      if (expense) {
        createdExpenses.push(expense);
      }
    }
    persistState(state);
    return createdExpenses;
  },

  createBillPayment: async (input) => {
    const state = readState();
    const billPayment: BillPayment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...input,
      owner: getOwner(),
    };
    state.billPayments.push(billPayment);
    persistState(state);
    return billPayment;
  },

  createBudget: async (input) => {
    const state = readState();
    const budget: Budget = {
      id: BigInt(Date.now()) + BigInt(Math.floor(Math.random() * 10000)),
      owner: getOwner(),
      name: input.name,
      limitCents: input.limitCents,
      color: input.color,
      category: input.category,
      year: input.year,
      month: input.month,
      createdAt: nowTimestamp(),
    };
    state.budgets.push(budget);
    persistState(state);
    return budget;
  },

  createBudgetTemplate: async (input) => {
    const state = readState();
    const template: BudgetTemplate = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categories: input.categories,
      owner: getOwner(),
      name: input.name,
      createdAt: nowTimestamp(),
    };
    state.budgetTemplates.push(template);
    persistState(state);
    return template;
  },

  createExpense: async (input) => {
    const state = readState();
    const expense: Expense = {
      id: BigInt(Date.now()) + BigInt(Math.floor(Math.random() * 10000)),
      owner: getOwner(),
      budgetId: input.budgetId,
      date: input.date,
      amountCents: input.amountCents,
      notes: input.notes,
      receiptUrl: input.receiptUrl,
      createdAt: nowTimestamp(),
    };
    state.expenses.push(expense);
    persistState(state);
    return expense;
  },

  createNote: async (title, content) => {
    const state = readState();
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      content,
      createdAt: nowTimestamp() * BigInt(1_000_000),
      updatedAt: nowTimestamp() * BigInt(1_000_000),
    };
    state.notes.push(note);
    persistState(state);
    return note;
  },

  createRecurringTemplate: async (input) => {
    const state = readState();
    const template: RecurringTemplate = {
      id: BigInt(Date.now()) + BigInt(Math.floor(Math.random() * 10000)),
      owner: getOwner(),
      name: input.name,
      createdAt: nowTimestamp(),
      dayOfMonth: input.dayOfMonth,
      amountCents: input.amountCents,
      budgetId: input.budgetId,
      notes: input.notes,
    };
    state.recurringTemplates.push(template);
    persistState(state);
    return template;
  },

  deleteBillPayment: async (id) => {
    const state = readState();
    const next = state.billPayments.filter((payment) => payment.id !== id);
    if (next.length === state.billPayments.length) {
      return false;
    }
    state.billPayments = next;
    persistState(state);
    return true;
  },

  deleteBudget: async (id) => {
    const state = readState();
    const existing = getBudgetById(state, id);
    if (!existing) {
      return false;
    }
    state.budgets = state.budgets.filter((budget) => budget.id !== id);
    state.expenses = state.expenses.filter(
      (expense) => expense.budgetId !== id,
    );
    state.recurringTemplates = state.recurringTemplates.filter(
      (template) => template.budgetId !== id,
    );
    persistState(state);
    return true;
  },

  deleteBudgetTemplate: async (id) => {
    const state = readState();
    const existing = getBudgetTemplateById(state, id);
    if (!existing) {
      return false;
    }
    state.budgetTemplates = state.budgetTemplates.filter(
      (template) => template.id !== id,
    );
    persistState(state);
    return true;
  },

  deleteExpense: async (id) => {
    const state = readState();
    const existing = getExpenseById(state, id);
    if (!existing) {
      return false;
    }
    state.expenses = state.expenses.filter((expense) => expense.id !== id);
    persistState(state);
    return true;
  },

  deleteNote: async (id) => {
    const state = readState();
    const existing = state.notes.find((note) => note.id === id);
    if (!existing) {
      return false;
    }
    state.notes = state.notes.filter((note) => note.id !== id);
    persistState(state);
    return true;
  },

  deleteRecurringTemplate: async (id) => {
    const state = readState();
    const existing = getRecurringTemplateById(state, id);
    if (!existing) {
      return false;
    }
    state.recurringTemplates = state.recurringTemplates.filter(
      (template) => template.id !== id,
    );
    state.expenses = state.expenses.filter(
      (expense) => expense.recurringTemplateId !== id,
    );
    persistState(state);
    return true;
  },

  getBillPayment: async (id) => {
    return getBillPaymentById(readState(), id) ?? null;
  },

  getBudget: async (id) => {
    return getBudgetById(readState(), id);
  },

  getBudgetTemplate: async (id) => {
    return getBudgetTemplateById(readState(), id) ?? null;
  },

  getCategoryBreakdown: async (year, month) => {
    return getCategoryBreakdownPoints(readState(), year, month);
  },

  getCategoryBreakdownForRange: async (startDate, endDate) => {
    return getCategoryBreakdownPointsForRange(readState(), startDate, endDate);
  },

  getCategoryTrend: async (budgetId, months, currentYear, currentMonth) => {
    const state = readState();
    const points: CategoryTrendPoint[] = [];
    const budget = getBudgetById(state, budgetId);
    if (!budget) {
      return points;
    }

    for (let index = Number(months) - 1; index >= 0; index -= 1) {
      let year = Number(currentYear);
      let month = Number(currentMonth) - index;
      while (month <= 0) {
        month += 12;
        year -= 1;
      }
      const _monthBudget = state.budgets.find(
        (item) =>
          item.id === budget.id &&
          item.year === BigInt(year) &&
          item.month === BigInt(month),
      );
      const spending = state.expenses
        .filter((expense) => expense.budgetId === budget.id)
        .filter((expense) => {
          const parts = toDateParts(expense.date);
          return parts.year === year && parts.month === month;
        })
        .reduce((sum, expense) => sum + Number(expense.amountCents), 0);
      points.push({
        month: BigInt(month),
        limitCents: budget.limitCents,
        year: BigInt(year),
        spentCents: BigInt(spending),
        budgetId,
        budgetName: budget.name,
      });
    }
    return points;
  },

  getDailySpending: async (year, month) => {
    const state = readState();
    const points: DailySpendingPoint[] = [];
    const daysInMonth = getDaysInMonth(Number(year), Number(month));
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const amountCents = state.expenses
        .filter((expense) => expense.date === date)
        .reduce((sum, expense) => sum + Number(expense.amountCents), 0);
      if (amountCents > 0) {
        points.push({ day: BigInt(day), amountCents: BigInt(amountCents) });
      }
    }
    return points;
  },

  getExpense: async (id) => {
    return getExpenseById(readState(), id) ?? null;
  },

  getExpensesInRange: async (startDate, endDate) => {
    return getExpensesInRange(readState(), startDate, endDate);
  },

  getMonthlySummary: async (year, month) => {
    return buildMonthlySummary(readState(), year, month);
  },

  getMonthlyTrend: async (months, currentYear, currentMonth) => {
    const points: MonthlyTrendPoint[] = [];
    for (let index = Number(months) - 1; index >= 0; index -= 1) {
      let year = Number(currentYear);
      let month = Number(currentMonth) - index;
      while (month <= 0) {
        month += 12;
        year -= 1;
      }
      const summary = buildMonthlySummary(
        readState(),
        BigInt(year),
        BigInt(month),
      );
      points.push({
        year: BigInt(year),
        month: BigInt(month),
        totalSpentCents: summary.totalSpentCents,
      });
    }
    return points;
  },

  getRecurringTemplate: async (id) => {
    return getRecurringTemplateById(readState(), id) ?? null;
  },

  getUserSettings: async () => {
    return readState().userSettings;
  },

  listBillPayments: async (year, month) => {
    const state = readState();
    return state.billPayments.filter(
      (payment) => payment.year === year && payment.month === month,
    );
  },

  listBudgetTemplates: async () => {
    return readState().budgetTemplates;
  },

  listBudgets: async (year, month) => {
    return readState().budgets.filter(
      (budget) => budget.year === year && budget.month === month,
    );
  },

  listExpenses: async (budgetId) => {
    return readState().expenses.filter(
      (expense) => expense.budgetId === budgetId,
    );
  },

  listNotes: async () => {
    return readState().notes;
  },

  listRecurringTemplates: async (budgetId) => {
    return readState().recurringTemplates.filter(
      (template) => template.budgetId === budgetId,
    );
  },

  searchExpenses: async (
    startDate,
    endDate,
    queryText,
    categoryId,
    minAmountCents,
    maxAmountCents,
  ) => {
    const state = readState();
    return state.expenses.filter((expense) => {
      if (expense.date < startDate || expense.date > endDate) {
        return false;
      }
      if (
        queryText &&
        !expense.notes?.toLowerCase().includes(queryText.toLowerCase())
      ) {
        return false;
      }
      if (categoryId != null && expense.budgetId !== categoryId) {
        return false;
      }
      if (minAmountCents != null && expense.amountCents < minAmountCents) {
        return false;
      }
      if (maxAmountCents != null && expense.amountCents > maxAmountCents) {
        return false;
      }
      return true;
    });
  },

  updateBillPayment: async (id, input) => {
    const state = readState();
    const index = state.billPayments.findIndex((payment) => payment.id === id);
    if (index < 0) {
      return null;
    }
    state.billPayments[index] = { ...state.billPayments[index], ...input, id };
    persistState(state);
    return state.billPayments[index];
  },

  updateBudget: async (id, input) => {
    const state = readState();
    const index = state.budgets.findIndex((budget) => budget.id === id);
    if (index < 0) {
      return null;
    }
    state.budgets[index] = {
      ...state.budgets[index],
      name: input.name,
      limitCents: input.limitCents,
      color: input.color,
      category: input.category,
      year: input.year,
      month: input.month,
    };
    persistState(state);
    return state.budgets[index];
  },

  updateBudgetTemplate: async (id, input) => {
    const state = readState();
    const index = state.budgetTemplates.findIndex(
      (template) => template.id === id,
    );
    if (index < 0) {
      return null;
    }
    state.budgetTemplates[index] = {
      ...state.budgetTemplates[index],
      categories: input.categories,
      name: input.name,
    };
    persistState(state);
    return state.budgetTemplates[index];
  },

  updateExpense: async (id, input) => {
    const state = readState();
    const index = state.expenses.findIndex((expense) => expense.id === id);
    if (index < 0) {
      return null;
    }
    state.expenses[index] = {
      ...state.expenses[index],
      budgetId: input.budgetId,
      date: input.date,
      amountCents: input.amountCents,
      notes: input.notes,
      receiptUrl: input.receiptUrl,
    };
    persistState(state);
    return state.expenses[index];
  },

  updateNote: async (id, title, content) => {
    const state = readState();
    const index = state.notes.findIndex((note) => note.id === id);
    if (index < 0) {
      return null;
    }
    state.notes[index] = {
      ...state.notes[index],
      title,
      content,
      updatedAt: nowTimestamp() * BigInt(1_000_000),
    };
    persistState(state);
    return state.notes[index];
  },

  updateRecurringTemplate: async (id, input) => {
    const state = readState();
    const index = state.recurringTemplates.findIndex(
      (template) => template.id === id,
    );
    if (index < 0) {
      return null;
    }
    state.recurringTemplates[index] = {
      ...state.recurringTemplates[index],
      name: input.name,
      dayOfMonth: input.dayOfMonth,
      amountCents: input.amountCents,
      budgetId: input.budgetId,
      notes: input.notes,
    };
    persistState(state);
    return state.recurringTemplates[index];
  },

  updateUserSettings: async (settings) => {
    const state = readState();
    state.userSettings = settings;
    persistState(state);
    return settings;
  },
};

export type BrowserStorageBackend = typeof browserStorageBackend;
