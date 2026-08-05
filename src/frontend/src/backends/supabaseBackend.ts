import { supabase } from "../lib/supabaseClient";
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
  Income,
  IncomeInput,
  MonthlySummary,
  MonthlyTrendPoint,
  Note,
  RecurringTemplate,
  RecurringTemplateInput,
  SavingsGoal,
  SavingsGoalInput,
  UpcomingBill,
  UserSettings,
} from "../types";
import type { Backend, BudgetInput, ExpenseInput } from "./Backend";

const RECEIPTS_BUCKET = "receipts";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function monthRange(year: bigint, month: bigint) {
  const y = Number(year);
  const m = Number(month);
  const start = `${y}-${pad(m)}-01`;
  const end = m === 12 ? `${y + 1}-01-01` : `${y}-${pad(m + 1)}-01`;
  return { start, end };
}

function toEpochMs(value: string) {
  return BigInt(new Date(value).getTime());
}

async function toSignedReceiptUrl(
  path: string | null,
): Promise<string | undefined> {
  if (!path) return undefined;
  const { data } = await supabase.storage
    .from(RECEIPTS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  return data?.signedUrl ?? undefined;
}

async function toSignedReceiptUrls(
  paths: string[],
): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();
  const { data } = await supabase.storage
    .from(RECEIPTS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  const map = new Map<string, string>();
  for (const entry of data ?? []) {
    if (entry.path && entry.signedUrl) {
      map.set(entry.path, entry.signedUrl);
    }
  }
  return map;
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.data == null) {
    throw new Error("Expected data in Supabase response but got null");
  }
  return result.data;
}

// ─── Row → app-type mapping ────────────────────────────────────────────────

interface BudgetRow {
  id: number | string;
  owner: string;
  name: string;
  limit_cents: string;
  color: string;
  category: string;
  year: number;
  month: number;
  created_at: string;
}

function mapBudget(row: BudgetRow): Budget {
  return {
    id: BigInt(row.id),
    owner: row.owner,
    name: row.name,
    limitCents: BigInt(row.limit_cents),
    color: row.color,
    category: row.category,
    year: BigInt(row.year),
    month: BigInt(row.month),
    createdAt: toEpochMs(row.created_at),
  };
}

interface RecurringTemplateRow {
  id: number | string;
  owner: string;
  budget_id: number | string;
  name: string;
  amount_cents: string;
  day_of_month: number;
  notes: string | null;
  created_at: string;
}

function mapRecurringTemplate(row: RecurringTemplateRow): RecurringTemplate {
  return {
    id: BigInt(row.id),
    owner: row.owner,
    budgetId: BigInt(row.budget_id),
    name: row.name,
    amountCents: BigInt(row.amount_cents),
    dayOfMonth: BigInt(row.day_of_month),
    notes: row.notes ?? undefined,
    createdAt: toEpochMs(row.created_at),
  };
}

interface ExpenseRow {
  id: number | string;
  budget_id: number | string;
  owner: string;
  date: string;
  amount_cents: string;
  notes: string | null;
  receipt_url: string | null;
  recurring_template_id: number | string | null;
  created_at: string;
}

async function mapExpense(row: ExpenseRow): Promise<Expense> {
  return {
    id: BigInt(row.id),
    budgetId: BigInt(row.budget_id),
    owner: row.owner,
    date: row.date,
    amountCents: BigInt(row.amount_cents),
    notes: row.notes ?? undefined,
    receiptUrl: await toSignedReceiptUrl(row.receipt_url),
    recurringTemplateId:
      row.recurring_template_id != null
        ? BigInt(row.recurring_template_id)
        : undefined,
    createdAt: toEpochMs(row.created_at),
  };
}

async function mapExpenses(rows: ExpenseRow[]): Promise<Expense[]> {
  const paths = rows
    .map((row) => row.receipt_url)
    .filter((path): path is string => !!path);
  const signedUrls = await toSignedReceiptUrls(paths);
  return rows.map((row) => ({
    id: BigInt(row.id),
    budgetId: BigInt(row.budget_id),
    owner: row.owner,
    date: row.date,
    amountCents: BigInt(row.amount_cents),
    notes: row.notes ?? undefined,
    receiptUrl: row.receipt_url
      ? signedUrls.get(row.receipt_url)
      : undefined,
    recurringTemplateId:
      row.recurring_template_id != null
        ? BigInt(row.recurring_template_id)
        : undefined,
    createdAt: toEpochMs(row.created_at),
  }));
}

interface BillPaymentRow {
  id: string;
  owner: string;
  recurring_template_id: string;
  year: number;
  month: number;
  due_day: number;
  paid_date: string | null;
  paid_amount_cents: string | null;
  notes: string | null;
}

function mapBillPayment(row: BillPaymentRow): BillPayment {
  return {
    id: row.id,
    owner: row.owner,
    recurringTemplateId: row.recurring_template_id,
    year: BigInt(row.year),
    month: BigInt(row.month),
    dueDay: BigInt(row.due_day),
    paidDate: row.paid_date ? toEpochMs(row.paid_date) : undefined,
    paidAmountCents:
      row.paid_amount_cents != null ? BigInt(row.paid_amount_cents) : undefined,
    notes: row.notes ?? undefined,
  };
}

interface IncomeRow {
  id: number | string;
  owner: string;
  source: string;
  amount_cents: string;
  date: string;
  notes: string | null;
  created_at: string;
}

function mapIncome(row: IncomeRow): Income {
  return {
    id: BigInt(row.id),
    owner: row.owner,
    source: row.source,
    amountCents: BigInt(row.amount_cents),
    date: row.date,
    notes: row.notes ?? undefined,
    createdAt: toEpochMs(row.created_at),
  };
}

interface SavingsGoalRow {
  id: string;
  owner: string;
  name: string;
  target_cents: string;
  saved_cents: string;
  target_date: string | null;
  color: string;
  created_at: string;
  completed_at: string | null;
}

function mapSavingsGoal(row: SavingsGoalRow): SavingsGoal {
  return {
    id: row.id,
    owner: row.owner,
    name: row.name,
    targetCents: BigInt(row.target_cents),
    savedCents: BigInt(row.saved_cents),
    targetDate: row.target_date ?? undefined,
    color: row.color,
    createdAt: toEpochMs(row.created_at),
    completedAt: row.completed_at ? toEpochMs(row.completed_at) : undefined,
  };
}

interface BudgetTemplateCategoryRow {
  id: number | string;
  budget_template_id: string;
  owner: string;
  name: string;
  limit_cents: string;
  color: string;
  category: string;
  sort_order: number;
}

function mapBudgetTemplateCategory(
  row: BudgetTemplateCategoryRow,
): BudgetTemplateCategory {
  return {
    name: row.name,
    limitCents: BigInt(row.limit_cents),
    color: row.color,
    category: row.category,
  };
}

interface BudgetTemplateRow {
  id: string;
  owner: string;
  name: string;
  created_at: string;
}

function mapBudgetTemplate(
  row: BudgetTemplateRow,
  categories: BudgetTemplateCategoryRow[],
): BudgetTemplate {
  return {
    id: row.id,
    owner: row.owner,
    name: row.name,
    createdAt: toEpochMs(row.created_at),
    categories: categories
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapBudgetTemplateCategory),
  };
}

interface NoteRow {
  id: string;
  owner: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: toEpochMs(row.created_at),
    updatedAt: toEpochMs(row.updated_at),
  };
}

// ─── Aggregation helpers ────────────────────────────────────────────────────

async function computeMonthlySummary(
  userId: string,
  year: bigint,
  month: bigint,
): Promise<MonthlySummary> {
  const { start, end } = monthRange(year, month);

  const budgetRows = unwrap(
    await supabase
      .from("budgets")
      .select("*")
      .eq("owner", userId)
      .eq("year", Number(year))
      .eq("month", Number(month)),
  ) as BudgetRow[];

  const expenseRows = unwrap(
    await supabase
      .from("expenses")
      .select("*")
      .eq("owner", userId)
      .gte("date", start)
      .lt("date", end),
  ) as ExpenseRow[];

  const incomeRows = unwrap(
    await supabase
      .from("incomes")
      .select("*")
      .eq("owner", userId)
      .gte("date", start)
      .lt("date", end),
  ) as IncomeRow[];

  const budgets = budgetRows.map(mapBudget);
  const budgetSummaries: BudgetSummary[] = budgets.map((budget) => {
    const totalSpentCents = expenseRows
      .filter((row) => BigInt(row.budget_id) === budget.id)
      .reduce((sum, row) => sum + BigInt(row.amount_cents), 0n);
    return {
      budget,
      totalSpentCents,
      remainingCents: budget.limitCents - totalSpentCents,
    };
  });

  const totalBudgetCents = budgetSummaries.reduce(
    (sum, s) => sum + s.budget.limitCents,
    0n,
  );
  const totalSpentCents = budgetSummaries.reduce(
    (sum, s) => sum + s.totalSpentCents,
    0n,
  );
  const totalIncomeCents = incomeRows.reduce(
    (sum, row) => sum + BigInt(row.amount_cents),
    0n,
  );

  return {
    year,
    month,
    totalBudgetCents,
    totalSpentCents,
    totalIncomeCents,
    budgets: budgetSummaries,
  };
}

function shiftMonth(currentYear: bigint, currentMonth: bigint, index: number) {
  let year = Number(currentYear);
  let month = Number(currentMonth) - index;
  while (month <= 0) {
    month += 12;
    year -= 1;
  }
  return { year: BigInt(year), month: BigInt(month) };
}

// ─── Backend factory ────────────────────────────────────────────────────────

export function createSupabaseBackend(userId: string): Backend {
  return {
    async applyBudgetTemplate(templateId, year, month) {
      const templateRow = unwrap(
        await supabase
          .from("budget_templates")
          .select("*")
          .eq("owner", userId)
          .eq("id", templateId)
          .maybeSingle(),
      ) as BudgetTemplateRow | null;
      if (!templateRow) return [];

      const categoryRows = unwrap(
        await supabase
          .from("budget_template_categories")
          .select("*")
          .eq("owner", userId)
          .eq("budget_template_id", templateId),
      ) as BudgetTemplateCategoryRow[];

      const existingRows = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .eq("year", Number(year))
          .eq("month", Number(month)),
      ) as BudgetRow[];

      const createdBudgets: Budget[] = [];
      for (const category of categoryRows) {
        const alreadyExists = existingRows.some(
          (row) =>
            row.category === category.category && row.name === category.name,
        );
        if (alreadyExists) continue;

        const inserted = unwrap(
          await supabase
            .from("budgets")
            .insert({
              owner: userId,
              name: category.name,
              limit_cents: category.limit_cents,
              color: category.color,
              category: category.category,
              year: Number(year),
              month: Number(month),
            })
            .select()
            .single(),
        ) as BudgetRow;
        createdBudgets.push(mapBudget(inserted));
      }
      return createdBudgets;
    },

    async applyRecurringTemplates(year, month) {
      const templateRows = unwrap(
        await supabase
          .from("recurring_templates")
          .select("*")
          .eq("owner", userId),
      ) as RecurringTemplateRow[];

      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      const createdExpenses: Expense[] = [];

      for (const templateRow of templateRows) {
        const day = Math.min(templateRow.day_of_month, daysInMonth);
        const date = `${Number(year)}-${pad(Number(month))}-${pad(day)}`;

        const { data: existing } = await supabase
          .from("expenses")
          .select("id")
          .eq("owner", userId)
          .eq("recurring_template_id", templateRow.id)
          .eq("date", date)
          .eq("budget_id", templateRow.budget_id)
          .maybeSingle();
        if (existing) continue;

        const inserted = unwrap(
          await supabase
            .from("expenses")
            .insert({
              owner: userId,
              budget_id: templateRow.budget_id,
              date,
              amount_cents: templateRow.amount_cents,
              notes: templateRow.notes,
              recurring_template_id: templateRow.id,
            })
            .select()
            .single(),
        ) as ExpenseRow;
        createdExpenses.push(await mapExpense(inserted));
      }
      return createdExpenses;
    },

    async contributeSavingsGoal(id, amountCents) {
      const goalRow = unwrap(
        await supabase
          .from("savings_goals")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as SavingsGoalRow | null;
      if (!goalRow) return null;

      const savedCents = BigInt(goalRow.saved_cents) + amountCents;
      const isComplete = savedCents >= BigInt(goalRow.target_cents);
      const completedAt = isComplete
        ? (goalRow.completed_at ?? new Date().toISOString())
        : null;

      const updated = unwrap(
        await supabase
          .from("savings_goals")
          .update({
            saved_cents: savedCents.toString(),
            completed_at: completedAt,
          })
          .eq("owner", userId)
          .eq("id", id)
          .select()
          .single(),
      ) as SavingsGoalRow;
      return mapSavingsGoal(updated);
    },

    async createBillPayment(input: BillPaymentInput) {
      const inserted = unwrap(
        await supabase
          .from("bill_payments")
          .insert({
            owner: userId,
            recurring_template_id: input.recurringTemplateId,
            year: Number(input.year),
            month: Number(input.month),
            due_day: Number(input.dueDay),
            paid_date:
              input.paidDate != null
                ? new Date(Number(input.paidDate)).toISOString()
                : null,
            paid_amount_cents: input.paidAmountCents?.toString() ?? null,
            notes: input.notes ?? null,
          })
          .select()
          .single(),
      ) as BillPaymentRow;
      return mapBillPayment(inserted);
    },

    async createBudget(input: BudgetInput) {
      const inserted = unwrap(
        await supabase
          .from("budgets")
          .insert({
            owner: userId,
            name: input.name,
            limit_cents: input.limitCents.toString(),
            color: input.color,
            category: input.category,
            year: Number(input.year),
            month: Number(input.month),
          })
          .select()
          .single(),
      ) as BudgetRow;
      return mapBudget(inserted);
    },

    async createBudgetTemplate(input: BudgetTemplateInput) {
      const templateRow = unwrap(
        await supabase
          .from("budget_templates")
          .insert({ owner: userId, name: input.name })
          .select()
          .single(),
      ) as BudgetTemplateRow;

      const categoryRows =
        input.categories.length > 0
          ? (unwrap(
              await supabase
                .from("budget_template_categories")
                .insert(
                  input.categories.map((category, index) => ({
                    budget_template_id: templateRow.id,
                    owner: userId,
                    name: category.name,
                    limit_cents: category.limitCents.toString(),
                    color: category.color,
                    category: category.category,
                    sort_order: index,
                  })),
                )
                .select(),
            ) as BudgetTemplateCategoryRow[])
          : [];

      return mapBudgetTemplate(templateRow, categoryRows);
    },

    async createExpense(input: ExpenseInput) {
      const inserted = unwrap(
        await supabase
          .from("expenses")
          .insert({
            owner: userId,
            budget_id: input.budgetId,
            date: input.date,
            amount_cents: input.amountCents.toString(),
            notes: input.notes ?? null,
            receipt_url: input.receiptUrl ?? null,
          })
          .select()
          .single(),
      ) as ExpenseRow;
      return mapExpense(inserted);
    },

    async createIncome(input: IncomeInput) {
      const inserted = unwrap(
        await supabase
          .from("incomes")
          .insert({
            owner: userId,
            source: input.source,
            amount_cents: input.amountCents.toString(),
            date: input.date,
            notes: input.notes ?? null,
          })
          .select()
          .single(),
      ) as IncomeRow;
      return mapIncome(inserted);
    },

    async createNote(title, content) {
      const inserted = unwrap(
        await supabase
          .from("notes")
          .insert({ owner: userId, title, content })
          .select()
          .single(),
      ) as NoteRow;
      return mapNote(inserted);
    },

    async createRecurringTemplate(input: RecurringTemplateInput) {
      const inserted = unwrap(
        await supabase
          .from("recurring_templates")
          .insert({
            owner: userId,
            budget_id: input.budgetId,
            name: input.name,
            amount_cents: input.amountCents.toString(),
            day_of_month: Number(input.dayOfMonth),
            notes: input.notes ?? null,
          })
          .select()
          .single(),
      ) as RecurringTemplateRow;
      return mapRecurringTemplate(inserted);
    },

    async createSavingsGoal(input: SavingsGoalInput) {
      const inserted = unwrap(
        await supabase
          .from("savings_goals")
          .insert({
            owner: userId,
            name: input.name,
            target_cents: input.targetCents.toString(),
            saved_cents: "0",
            target_date: input.targetDate ?? null,
            color: input.color,
          })
          .select()
          .single(),
      ) as SavingsGoalRow;
      return mapSavingsGoal(inserted);
    },

    async deleteBillPayment(id) {
      const { data } = await supabase
        .from("bill_payments")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteBudget(id) {
      const { data } = await supabase
        .from("budgets")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteBudgetTemplate(id) {
      const { data } = await supabase
        .from("budget_templates")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteExpense(id) {
      const existingRow = unwrap(
        await supabase
          .from("expenses")
          .select("receipt_url")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as { receipt_url: string | null } | null;

      const { data } = await supabase
        .from("expenses")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      const deleted = (data?.length ?? 0) > 0;

      if (deleted && existingRow?.receipt_url) {
        await supabase.storage
          .from(RECEIPTS_BUCKET)
          .remove([existingRow.receipt_url]);
      }
      return deleted;
    },

    async deleteIncome(id) {
      const { data } = await supabase
        .from("incomes")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteNote(id) {
      const { data } = await supabase
        .from("notes")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteRecurringTemplate(id) {
      const { data } = await supabase
        .from("recurring_templates")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async deleteSavingsGoal(id) {
      const { data } = await supabase
        .from("savings_goals")
        .delete()
        .eq("owner", userId)
        .eq("id", id)
        .select();
      return (data?.length ?? 0) > 0;
    },

    async exportAllData() {
      const [
        budgets,
        expenses,
        recurringTemplates,
        billPayments,
        incomes,
        savingsGoals,
        budgetTemplates,
        budgetTemplateCategories,
        notes,
        userSettings,
      ] = await Promise.all([
        supabase.from("budgets").select("*").eq("owner", userId),
        supabase.from("expenses").select("*").eq("owner", userId),
        supabase.from("recurring_templates").select("*").eq("owner", userId),
        supabase.from("bill_payments").select("*").eq("owner", userId),
        supabase.from("incomes").select("*").eq("owner", userId),
        supabase.from("savings_goals").select("*").eq("owner", userId),
        supabase.from("budget_templates").select("*").eq("owner", userId),
        supabase
          .from("budget_template_categories")
          .select("*")
          .eq("owner", userId),
        supabase.from("notes").select("*").eq("owner", userId),
        supabase
          .from("user_settings")
          .select("*")
          .eq("owner", userId)
          .maybeSingle(),
      ]);

      return JSON.stringify(
        {
          version: 2,
          budgets: budgets.data ?? [],
          expenses: expenses.data ?? [],
          recurringTemplates: recurringTemplates.data ?? [],
          billPayments: billPayments.data ?? [],
          incomes: incomes.data ?? [],
          savingsGoals: savingsGoals.data ?? [],
          budgetTemplates: budgetTemplates.data ?? [],
          budgetTemplateCategories: budgetTemplateCategories.data ?? [],
          notes: notes.data ?? [],
          userSettings: userSettings.data ?? { alert_threshold_percent: 80 },
        },
        null,
        2,
      );
    },

    async getBillPayment(id) {
      const row = unwrap(
        await supabase
          .from("bill_payments")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as BillPaymentRow | null;
      return row ? mapBillPayment(row) : null;
    },

    async getBudget(id) {
      const row = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as BudgetRow | null;
      return row ? mapBudget(row) : null;
    },

    async getBudgetTemplate(id) {
      const templateRow = unwrap(
        await supabase
          .from("budget_templates")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as BudgetTemplateRow | null;
      if (!templateRow) return null;

      const categoryRows = unwrap(
        await supabase
          .from("budget_template_categories")
          .select("*")
          .eq("owner", userId)
          .eq("budget_template_id", id),
      ) as BudgetTemplateCategoryRow[];

      return mapBudgetTemplate(templateRow, categoryRows);
    },

    async getCategoryBreakdown(year, month) {
      const rows = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .eq("year", Number(year))
          .eq("month", Number(month)),
      ) as BudgetRow[];

      return rows.map(
        (row): CategoryBreakdownPoint => ({
          budgetId: String(row.id),
          name: row.name,
          amountCents: BigInt(row.limit_cents),
          color: row.color,
        }),
      );
    },

    async getCategoryBreakdownForRange(startDate, endDate) {
      const expenseRows = unwrap(
        await supabase
          .from("expenses")
          .select("*")
          .eq("owner", userId)
          .gte("date", startDate)
          .lte("date", endDate),
      ) as ExpenseRow[];

      const totals = new Map<string, bigint>();
      for (const row of expenseRows) {
        const key = String(row.budget_id);
        totals.set(key, (totals.get(key) ?? 0n) + BigInt(row.amount_cents));
      }

      const budgetIds = Array.from(totals.keys());
      if (budgetIds.length === 0) return [];

      const budgetRows = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .in("id", budgetIds),
      ) as BudgetRow[];
      const budgetsById = new Map(
        budgetRows.map((row) => [String(row.id), row]),
      );

      return Array.from(totals.entries()).map(
        ([budgetId, amountCents]): CategoryBreakdownPoint => {
          const budget = budgetsById.get(budgetId);
          return {
            budgetId,
            name: budget?.name ?? "Unknown",
            amountCents,
            color: budget?.color ?? "#64748b",
          };
        },
      );
    },

    async getCategoryTrend(budgetId, months, currentYear, currentMonth) {
      const budgetRow = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .eq("id", budgetId)
          .maybeSingle(),
      ) as BudgetRow | null;
      if (!budgetRow) return [];
      const budget = mapBudget(budgetRow);

      const points: CategoryTrendPoint[] = [];
      for (let index = Number(months) - 1; index >= 0; index -= 1) {
        const { year, month } = shiftMonth(currentYear, currentMonth, index);
        const { start, end } = monthRange(year, month);

        const expenseRows = unwrap(
          await supabase
            .from("expenses")
            .select("amount_cents")
            .eq("owner", userId)
            .eq("budget_id", budgetId)
            .gte("date", start)
            .lt("date", end),
        ) as { amount_cents: string }[];

        const spentCents = expenseRows.reduce(
          (sum, row) => sum + BigInt(row.amount_cents),
          0n,
        );

        points.push({
          year,
          month,
          budgetId,
          budgetName: budget.name,
          spentCents,
          limitCents: budget.limitCents,
        });
      }
      return points;
    },

    async getDailySpending(year, month) {
      const { start, end } = monthRange(year, month);
      const expenseRows = unwrap(
        await supabase
          .from("expenses")
          .select("date, amount_cents")
          .eq("owner", userId)
          .gte("date", start)
          .lt("date", end),
      ) as { date: string; amount_cents: string }[];

      const totalsByDay = new Map<number, bigint>();
      for (const row of expenseRows) {
        const day = Number(row.date.split("-")[2]);
        totalsByDay.set(
          day,
          (totalsByDay.get(day) ?? 0n) + BigInt(row.amount_cents),
        );
      }

      const points: DailySpendingPoint[] = [];
      for (const [day, amountCents] of totalsByDay.entries()) {
        if (amountCents > 0n) {
          points.push({ day: BigInt(day), amountCents });
        }
      }
      return points.sort((a, b) => Number(a.day - b.day));
    },

    async getExpense(id) {
      const row = unwrap(
        await supabase
          .from("expenses")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as ExpenseRow | null;
      return row ? await mapExpense(row) : null;
    },

    async getExpensesInRange(startDate, endDate) {
      const rows = unwrap(
        await supabase
          .from("expenses")
          .select("*")
          .eq("owner", userId)
          .gte("date", startDate)
          .lte("date", endDate),
      ) as ExpenseRow[];
      return mapExpenses(rows);
    },

    async getIncome(id) {
      const row = unwrap(
        await supabase
          .from("incomes")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as IncomeRow | null;
      return row ? mapIncome(row) : null;
    },

    async getMonthlySummary(year, month) {
      return computeMonthlySummary(userId, year, month);
    },

    async getMonthlyTrend(months, currentYear, currentMonth) {
      const points: MonthlyTrendPoint[] = [];
      for (let index = Number(months) - 1; index >= 0; index -= 1) {
        const { year, month } = shiftMonth(currentYear, currentMonth, index);
        const summary = await computeMonthlySummary(userId, year, month);
        points.push({
          year,
          month,
          totalSpentCents: summary.totalSpentCents,
        });
      }
      return points;
    },

    async getRecurringTemplate(id) {
      const row = unwrap(
        await supabase
          .from("recurring_templates")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as RecurringTemplateRow | null;
      return row ? mapRecurringTemplate(row) : null;
    },

    async getSavingsGoal(id) {
      const row = unwrap(
        await supabase
          .from("savings_goals")
          .select("*")
          .eq("owner", userId)
          .eq("id", id)
          .maybeSingle(),
      ) as SavingsGoalRow | null;
      return row ? mapSavingsGoal(row) : null;
    },

    async getUpcomingBills(withinDays) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const today = now.getDate();
      const within = Number(withinDays);

      const [templateRows, paymentRows, budgetRows] = await Promise.all([
        supabase
          .from("recurring_templates")
          .select("*")
          .eq("owner", userId)
          .then((r) => unwrap(r) as RecurringTemplateRow[]),
        supabase
          .from("bill_payments")
          .select("*")
          .eq("owner", userId)
          .eq("year", year)
          .eq("month", month)
          .then((r) => unwrap(r) as BillPaymentRow[]),
        supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .then((r) => unwrap(r) as BudgetRow[]),
      ]);

      const results: UpcomingBill[] = [];
      for (const templateRow of templateRows) {
        const payment = paymentRows.find(
          (p) => p.recurring_template_id === String(templateRow.id),
        );
        if (payment?.paid_date != null) continue;

        const daysUntilDue = templateRow.day_of_month - today;
        if (daysUntilDue > within) continue;

        const budgetRow = budgetRows.find(
          (b) => String(b.id) === String(templateRow.budget_id),
        );
        results.push({
          id: String(templateRow.id),
          name: templateRow.name,
          amountCents: BigInt(templateRow.amount_cents),
          dueDay: BigInt(templateRow.day_of_month),
          budgetName: budgetRow?.name ?? "Unknown",
          daysUntilDue,
        });
      }
      return results;
    },

    async getUserSettings() {
      const row = unwrap(
        await supabase
          .from("user_settings")
          .select("*")
          .eq("owner", userId)
          .maybeSingle(),
      ) as { alert_threshold_percent: number } | null;
      return {
        alertThresholdPercent: row?.alert_threshold_percent ?? 80,
      } satisfies UserSettings;
    },

    async importAllData(json) {
      const parsed = JSON.parse(json) as {
        budgets?: BudgetRow[];
        expenses?: ExpenseRow[];
        recurringTemplates?: RecurringTemplateRow[];
        billPayments?: BillPaymentRow[];
        incomes?: IncomeRow[];
        savingsGoals?: SavingsGoalRow[];
        budgetTemplates?: BudgetTemplateRow[];
        budgetTemplateCategories?: BudgetTemplateCategoryRow[];
        notes?: NoteRow[];
        userSettings?: { alert_threshold_percent?: number };
      };

      const tables: [string, unknown[] | undefined][] = [
        ["expenses", parsed.expenses],
        ["bill_payments", parsed.billPayments],
        ["recurring_templates", parsed.recurringTemplates],
        ["budgets", parsed.budgets],
        ["incomes", parsed.incomes],
        ["savings_goals", parsed.savingsGoals],
        ["budget_template_categories", parsed.budgetTemplateCategories],
        ["budget_templates", parsed.budgetTemplates],
        ["notes", parsed.notes],
      ];

      // Delete children before parents to respect foreign keys, then re-insert
      // everything re-stamped with the current user's id.
      for (const [table] of tables) {
        await supabase.from(table).delete().eq("owner", userId);
      }
      for (const [table, rows] of [...tables].reverse()) {
        if (!rows || rows.length === 0) continue;
        const restamped = rows.map((row) => ({
          ...(row as Record<string, unknown>),
          owner: userId,
        }));
        const { error } = await supabase.from(table).insert(restamped);
        if (error) throw new Error(error.message);
      }

      if (parsed.userSettings) {
        await supabase.from("user_settings").upsert({
          owner: userId,
          alert_threshold_percent:
            parsed.userSettings.alert_threshold_percent ?? 80,
        });
      }

      return true;
    },

    async listAllBudgets() {
      const rows = unwrap(
        await supabase.from("budgets").select("*").eq("owner", userId),
      ) as BudgetRow[];
      return rows.map(mapBudget);
    },

    async listBillPayments(year, month) {
      const rows = unwrap(
        await supabase
          .from("bill_payments")
          .select("*")
          .eq("owner", userId)
          .eq("year", Number(year))
          .eq("month", Number(month)),
      ) as BillPaymentRow[];
      return rows.map(mapBillPayment);
    },

    async listBudgets(year, month) {
      const rows = unwrap(
        await supabase
          .from("budgets")
          .select("*")
          .eq("owner", userId)
          .eq("year", Number(year))
          .eq("month", Number(month)),
      ) as BudgetRow[];
      return rows.map(mapBudget);
    },

    async listBudgetTemplates() {
      const [templateRows, categoryRows] = await Promise.all([
        supabase
          .from("budget_templates")
          .select("*")
          .eq("owner", userId)
          .then((r) => unwrap(r) as BudgetTemplateRow[]),
        supabase
          .from("budget_template_categories")
          .select("*")
          .eq("owner", userId)
          .then((r) => unwrap(r) as BudgetTemplateCategoryRow[]),
      ]);

      return templateRows.map((templateRow) =>
        mapBudgetTemplate(
          templateRow,
          categoryRows.filter(
            (c) => c.budget_template_id === templateRow.id,
          ),
        ),
      );
    },

    async listExpenses(budgetId) {
      const rows = unwrap(
        await supabase
          .from("expenses")
          .select("*")
          .eq("owner", userId)
          .eq("budget_id", budgetId),
      ) as ExpenseRow[];
      return mapExpenses(rows);
    },

    async listExpensesWithReceipts() {
      const rows = unwrap(
        await supabase
          .from("expenses")
          .select("*")
          .eq("owner", userId)
          .not("receipt_url", "is", null)
          .order("date", { ascending: false }),
      ) as ExpenseRow[];
      return mapExpenses(rows);
    },

    async listIncome(year, month) {
      const { start, end } = monthRange(year, month);
      const rows = unwrap(
        await supabase
          .from("incomes")
          .select("*")
          .eq("owner", userId)
          .gte("date", start)
          .lt("date", end),
      ) as IncomeRow[];
      return rows.map(mapIncome);
    },

    async listNotes() {
      const rows = unwrap(
        await supabase.from("notes").select("*").eq("owner", userId),
      ) as NoteRow[];
      return rows.map(mapNote);
    },

    async listRecurringTemplates(budgetId) {
      const rows = unwrap(
        await supabase
          .from("recurring_templates")
          .select("*")
          .eq("owner", userId)
          .eq("budget_id", budgetId),
      ) as RecurringTemplateRow[];
      return rows.map(mapRecurringTemplate);
    },

    async listSavingsGoals() {
      const rows = unwrap(
        await supabase.from("savings_goals").select("*").eq("owner", userId),
      ) as SavingsGoalRow[];
      return rows.map(mapSavingsGoal);
    },

    async searchExpenses(
      startDate,
      endDate,
      queryText,
      categoryId,
      minAmountCents,
      maxAmountCents,
    ) {
      let query = supabase
        .from("expenses")
        .select("*")
        .eq("owner", userId)
        .gte("date", startDate)
        .lte("date", endDate);

      if (categoryId != null) {
        query = query.eq("budget_id", categoryId);
      }
      if (minAmountCents != null) {
        query = query.gte("amount_cents", minAmountCents.toString());
      }
      if (maxAmountCents != null) {
        query = query.lte("amount_cents", maxAmountCents.toString());
      }
      if (queryText) {
        query = query.ilike("notes", `%${queryText}%`);
      }

      const rows = unwrap(await query) as ExpenseRow[];
      return mapExpenses(rows);
    },

    async updateBillPayment(id, input: BillPaymentInput) {
      const { data, error } = await supabase
        .from("bill_payments")
        .update({
          recurring_template_id: input.recurringTemplateId,
          year: Number(input.year),
          month: Number(input.month),
          due_day: Number(input.dueDay),
          paid_date:
            input.paidDate != null
              ? new Date(Number(input.paidDate)).toISOString()
              : null,
          paid_amount_cents: input.paidAmountCents?.toString() ?? null,
          notes: input.notes ?? null,
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapBillPayment(data as BillPaymentRow) : null;
    },

    async updateBudget(id, input: BudgetInput) {
      const { data, error } = await supabase
        .from("budgets")
        .update({
          name: input.name,
          limit_cents: input.limitCents.toString(),
          color: input.color,
          category: input.category,
          year: Number(input.year),
          month: Number(input.month),
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapBudget(data as BudgetRow) : null;
    },

    async updateBudgetTemplate(id, input: BudgetTemplateInput) {
      const { data: templateRow, error: templateError } = await supabase
        .from("budget_templates")
        .update({ name: input.name })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (templateError) throw new Error(templateError.message);
      if (!templateRow) return null;

      await supabase
        .from("budget_template_categories")
        .delete()
        .eq("owner", userId)
        .eq("budget_template_id", id);

      const categoryRows =
        input.categories.length > 0
          ? (unwrap(
              await supabase
                .from("budget_template_categories")
                .insert(
                  input.categories.map((category, index) => ({
                    budget_template_id: id,
                    owner: userId,
                    name: category.name,
                    limit_cents: category.limitCents.toString(),
                    color: category.color,
                    category: category.category,
                    sort_order: index,
                  })),
                )
                .select(),
            ) as BudgetTemplateCategoryRow[])
          : [];

      return mapBudgetTemplate(
        templateRow as BudgetTemplateRow,
        categoryRows,
      );
    },

    async updateExpense(id, input: ExpenseInput) {
      const { data, error } = await supabase
        .from("expenses")
        .update({
          budget_id: input.budgetId,
          date: input.date,
          amount_cents: input.amountCents.toString(),
          notes: input.notes ?? null,
          receipt_url: input.receiptUrl ?? null,
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapExpense(data as ExpenseRow) : null;
    },

    async updateIncome(id, input: IncomeInput) {
      const { data, error } = await supabase
        .from("incomes")
        .update({
          source: input.source,
          amount_cents: input.amountCents.toString(),
          date: input.date,
          notes: input.notes ?? null,
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapIncome(data as IncomeRow) : null;
    },

    async updateNote(id, title, content) {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapNote(data as NoteRow) : null;
    },

    async updateRecurringTemplate(id, input: RecurringTemplateInput) {
      const { data, error } = await supabase
        .from("recurring_templates")
        .update({
          name: input.name,
          day_of_month: Number(input.dayOfMonth),
          amount_cents: input.amountCents.toString(),
          budget_id: input.budgetId,
          notes: input.notes ?? null,
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapRecurringTemplate(data as RecurringTemplateRow) : null;
    },

    async updateSavingsGoal(id, input: SavingsGoalInput) {
      const { data, error } = await supabase
        .from("savings_goals")
        .update({
          name: input.name,
          target_cents: input.targetCents.toString(),
          target_date: input.targetDate ?? null,
          color: input.color,
        })
        .eq("owner", userId)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? mapSavingsGoal(data as SavingsGoalRow) : null;
    },

    async updateUserSettings(settings: UserSettings) {
      const { error } = await supabase.from("user_settings").upsert({
        owner: userId,
        alert_threshold_percent: settings.alertThresholdPercent,
      });
      if (error) throw new Error(error.message);
      return settings;
    },
  };
}
