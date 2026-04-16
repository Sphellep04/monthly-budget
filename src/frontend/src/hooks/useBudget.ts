import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Budget,
  BudgetSummary,
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

export function useMonthlySummary(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<MonthlySummary>({
    queryKey: ["monthly-summary", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getMonthlySummary(BigInt(year), BigInt(month));
      return result as unknown as MonthlySummary;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBudgets(year: number, month: number) {
  const { data: summary, ...rest } = useMonthlySummary(year, month);
  return {
    data: summary?.budgets.map((b) => b.budget) ?? [],
    summaries: summary?.budgets ?? [],
    ...rest,
  };
}

export function useBudgetSummary(
  budgetId: bigint,
  year: number,
  month: number,
) {
  const { data: summary, ...rest } = useMonthlySummary(year, month);
  const budgetSummary = summary?.budgets.find((b) => b.budget.id === budgetId);
  return { data: budgetSummary, ...rest };
}

export function useExpenses(budgetId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Expense[]>({
    queryKey: ["expenses", budgetId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listExpenses(budgetId);
      return result as unknown as Expense[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (budget: Omit<Budget, "id" | "owner" | "createdAt">) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBudget({
        name: budget.name,
        limitCents: budget.limitCents,
        color: budget.color,
        category: budget.category,
        year: budget.year,
        month: budget.month,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
    },
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (
      expense: Omit<
        Expense,
        "id" | "owner" | "createdAt" | "recurringTemplateId"
      >,
    ) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createExpense({
        budgetId: expense.budgetId,
        date: expense.date,
        amountCents: expense.amountCents,
        notes: expense.notes,
        receiptUrl: expense.receiptUrl,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.budgetId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBudget(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
    },
  });
}

// ─── Recurring Templates ──────────────────────────────────────────────────────

export function useRecurringTemplates(budgetId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<RecurringTemplate[]>({
    queryKey: ["recurring-templates", budgetId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listRecurringTemplates(budgetId);
      return result as unknown as RecurringTemplate[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRecurringTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (input: RecurringTemplateInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createRecurringTemplate(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-templates", variables.budgetId.toString()],
      });
    },
  });
}

export function useUpdateRecurringTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: RecurringTemplateInput;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateRecurringTemplate(id, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-templates", variables.input.budgetId.toString()],
      });
    },
  });
}

export function useDeleteRecurringTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      id,
      budgetId: _budgetId,
    }: {
      id: bigint;
      budgetId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteRecurringTemplate(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-templates", variables.budgetId.toString()],
      });
    },
  });
}

export function useApplyRecurringTemplates(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Expense[]>({
    queryKey: ["apply-recurring", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.applyRecurringTemplates(
        BigInt(year),
        BigInt(month),
      );
      return result as unknown as Expense[];
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY, // only run once per session per month
  });
}

// ─── Charts / Trends ─────────────────────────────────────────────────────────

export function useMonthlyTrend(months: number) {
  const { actor, isFetching } = useActor(createActor);
  const now = new Date();
  return useQuery<MonthlyTrendPoint[]>({
    queryKey: ["monthly-trend", months],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getMonthlyTrend(
        BigInt(months),
        BigInt(now.getFullYear()),
        BigInt(now.getMonth() + 1),
      );
      return result as unknown as MonthlyTrendPoint[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCategoryTrend(budgetId: bigint, months: number) {
  const { actor, isFetching } = useActor(createActor);
  const now = new Date();
  return useQuery<CategoryTrendPoint[]>({
    queryKey: ["category-trend", budgetId.toString(), months],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getCategoryTrend(
        budgetId,
        BigInt(months),
        BigInt(now.getFullYear()),
        BigInt(now.getMonth() + 1),
      );
      return result as unknown as CategoryTrendPoint[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailySpending(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DailySpendingPoint[]>({
    queryKey: ["daily-spending", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getDailySpending(BigInt(year), BigInt(month));
      return result as unknown as DailySpendingPoint[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCategoryBreakdown(year: number, month: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CategoryBreakdownPoint[]>({
    queryKey: ["category-breakdown", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getCategoryBreakdown(
        BigInt(year),
        BigInt(month),
      );
      return result as unknown as CategoryBreakdownPoint[];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export function useListNotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listNotes();
      return result as unknown as Note[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createNote(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: {
      id: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateNote(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// ─── Annual Summary ───────────────────────────────────────────────────────────

export interface MonthRow {
  monthNum: number;
  year: number;
  totalBudgetCents: number;
  totalSpentCents: number;
  remainingCents: number;
  isOverBudget: boolean;
}

export interface AnnualStats {
  totalYearSpentCents: number;
  totalYearBudgetedCents: number;
  avgMonthlySpentCents: number;
  bestMonth: MonthRow | null;
  worstMonth: MonthRow | null;
  highestOverspendMonth: MonthRow | null;
}

export function useAnnualSummary(year: number) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<{ monthRows: MonthRow[]; stats: AnnualStats }>({
    queryKey: ["annual-summary", year],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");

      const rows: MonthRow[] = await Promise.all(
        Array.from({ length: 12 }, (_, i) => i + 1).map(async (m) => {
          const result = await actor.getMonthlySummary(BigInt(year), BigInt(m));
          const summary = result as unknown as MonthlySummary;
          const spent = Number(summary.totalSpentCents);
          const budgeted = Number(summary.totalBudgetCents);
          return {
            monthNum: m,
            year,
            totalBudgetCents: budgeted,
            totalSpentCents: spent,
            remainingCents: budgeted - spent,
            isOverBudget: budgeted > 0 && spent > budgeted,
          };
        }),
      );

      const activeRows = rows.filter((r) => r.totalSpentCents > 0);
      const totalYearSpentCents = rows.reduce(
        (s, r) => s + r.totalSpentCents,
        0,
      );
      const totalYearBudgetedCents = rows.reduce(
        (s, r) => s + r.totalBudgetCents,
        0,
      );
      const avgMonthlySpentCents =
        activeRows.length > 0
          ? Math.round(totalYearSpentCents / activeRows.length)
          : 0;

      const sortedBySpent = [...activeRows].sort(
        (a, b) => a.totalSpentCents - b.totalSpentCents,
      );
      const bestMonth = sortedBySpent[0] ?? null;
      const worstMonth = sortedBySpent[sortedBySpent.length - 1] ?? null;

      const overBudgetRows = rows.filter((r) => r.isOverBudget);
      const highestOverspendMonth =
        overBudgetRows.length > 0
          ? overBudgetRows.reduce((worst, r) =>
              r.remainingCents < worst.remainingCents ? r : worst,
            )
          : null;

      const stats: AnnualStats = {
        totalYearSpentCents,
        totalYearBudgetedCents,
        avgMonthlySpentCents,
        bestMonth,
        worstMonth,
        highestOverspendMonth,
      };

      return { monthRows: rows, stats };
    },
    enabled: !!actor && !isFetching,
    select: (data) => data,
  });
}

// ─── User Settings ────────────────────────────────────────────────────────────

export function useUserSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getUserSettings();
      return {
        alertThresholdPercent: Number(result.alertThresholdPercent),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateUserSettings({
        alertThresholdPercent: BigInt(settings.alertThresholdPercent),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchExpensesParams {
  startDate: string;
  endDate: string;
  query?: string;
  categoryId?: bigint;
  minAmountCents?: number;
  maxAmountCents?: number;
}

export function useSearchExpenses(params: SearchExpensesParams | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Expense[]>({
    queryKey: [
      "search-expenses",
      params?.startDate,
      params?.endDate,
      params?.query,
      params?.categoryId?.toString(),
      params?.minAmountCents,
      params?.maxAmountCents,
    ],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      if (!params) return [];
      const result = await actor.searchExpenses(
        params.startDate,
        params.endDate,
        params.query ?? null,
        params.categoryId ?? null,
        params.minAmountCents != null
          ? BigInt(Math.round(params.minAmountCents * 100))
          : null,
        params.maxAmountCents != null
          ? BigInt(Math.round(params.maxAmountCents * 100))
          : null,
      );
      return result as unknown as Expense[];
    },
    enabled: !!actor && !isFetching && !!params,
  });
}

export function useGetExpensesInRange(
  startDate: string,
  endDate: string,
  enabled = true,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Expense[]>({
    queryKey: ["expenses-in-range", startDate, endDate],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getExpensesInRange(startDate, endDate);
      return result as unknown as Expense[];
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetCategoryBreakdownForRange(
  startDate: string,
  endDate: string,
  enabled = true,
) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CategoryBreakdownPoint[]>({
    queryKey: ["category-breakdown-range", startDate, endDate],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getCategoryBreakdownForRange(
        startDate,
        endDate,
      );
      return result as unknown as CategoryBreakdownPoint[];
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export type {
  MonthlySummary,
  Budget,
  Expense,
  BudgetSummary,
  RecurringTemplate,
  RecurringTemplateInput,
  MonthlyTrendPoint,
  CategoryTrendPoint,
  DailySpendingPoint,
  CategoryBreakdownPoint,
  Note,
  UserSettings,
};
