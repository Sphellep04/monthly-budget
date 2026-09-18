import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  Backend,
  BulkCreateExpensesInput,
  SplitExpenseInput,
} from "../backends/Backend";
import {
  enqueuePendingExpense,
  listPendingExpenses,
  makeTempExpenseId,
  removePendingExpense,
} from "../lib/expenseOutbox";
import type {
  Account,
  AccountInput,
  BillPayment,
  BillPaymentInput,
  Budget,
  BudgetSummary,
  Category,
  CategoryBreakdownPoint,
  CategoryRule,
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
import { useActorOrMock } from "./useActorOrMock";

/** True for a fetch/network failure as opposed to a server-side rejection. */
function isLikelyOffline(err: unknown): boolean {
  if (!navigator.onLine) return true;
  return err instanceof TypeError && /fetch/i.test(err.message);
}

export function useMonthlySummary(
  year: number,
  month: number,
  options?: { enabled?: boolean },
) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<MonthlySummary>({
    queryKey: ["monthly-summary", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getMonthlySummary(BigInt(year), BigInt(month));
      return result as unknown as MonthlySummary;
    },
    enabled: !!actor && !isFetching && (options?.enabled ?? true),
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

/** Fetches a single budget by id, independent of any month currently being viewed. */
export function useBudget(id: bigint) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Budget | null>({
    queryKey: ["budget", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getBudget(id);
      return result as unknown as Budget | null;
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Looks up the budget's own year/month first (rather than assuming the
 * currently-viewed month), so this works for budgets outside the current
 * calendar month.
 */
export function useBudgetSummary(budgetId: bigint) {
  const budgetQuery = useBudget(budgetId);
  const budget = budgetQuery.data;
  const now = new Date();
  const year = budget ? Number(budget.year) : now.getFullYear();
  const month = budget ? Number(budget.month) : now.getMonth() + 1;
  const summaryQuery = useMonthlySummary(year, month, { enabled: !!budget });
  const budgetSummary = summaryQuery.data?.budgets.find(
    (b) => b.budget.id === budgetId,
  );

  return {
    data: budgetSummary,
    isLoading: budgetQuery.isLoading || summaryQuery.isLoading,
    isError: budgetQuery.isError || summaryQuery.isError,
    refetch: () => {
      budgetQuery.refetch();
      summaryQuery.refetch();
    },
  };
}

export function useExpenses(budgetId: bigint) {
  const { actor, isFetching } = useActorOrMock();
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
  const { actor } = useActorOrMock();
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
        rollover: budget.rollover,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["all-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-list"] });
    },
  });
}

type NewExpense = Omit<
  Expense,
  "id" | "owner" | "createdAt" | "recurringTemplateId"
>;

function invalidateExpenseQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  budgetId: bigint,
) {
  queryClient.invalidateQueries({
    queryKey: ["expenses", budgetId.toString()],
  });
  queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
  queryClient.invalidateQueries({ queryKey: ["monthly-trend"] });
  queryClient.invalidateQueries({ queryKey: ["category-trend"] });
  queryClient.invalidateQueries({ queryKey: ["daily-spending"] });
  queryClient.invalidateQueries({ queryKey: ["category-breakdown"] });
  queryClient.invalidateQueries({ queryKey: ["category-breakdown-range"] });
  queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
  queryClient.invalidateQueries({ queryKey: ["expenses-in-range"] });
  queryClient.invalidateQueries({ queryKey: ["receipt-gallery"] });
}

/**
 * Adding an expense is the one action that must never fail outright:
 * it shows immediately (optimistic update) and, if the network is down or
 * drops mid-request, is queued in IndexedDB instead of erroring - see
 * useFlushExpenseOutbox, which retries queued expenses once connectivity
 * returns. A queued expense is recognizable by a negative `id` until it
 * syncs and gets its real server-assigned one.
 */
export function useAddExpense() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (expense: NewExpense) => {
      if (!actor) throw new Error("Actor not ready");
      const input = {
        budgetId: expense.budgetId,
        date: expense.date,
        amountCents: expense.amountCents,
        notes: expense.notes,
        receiptUrl: expense.receiptUrl,
      };
      if (!navigator.onLine) {
        const tempId = makeTempExpenseId();
        await enqueuePendingExpense(tempId, input);
        return {
          ...expense,
          id: tempId,
          owner: "",
          createdAt: BigInt(Date.now()),
        };
      }
      try {
        return await actor.createExpense(input);
      } catch (err) {
        if (!isLikelyOffline(err)) throw err;
        const tempId = makeTempExpenseId();
        await enqueuePendingExpense(tempId, input);
        return {
          ...expense,
          id: tempId,
          owner: "",
          createdAt: BigInt(Date.now()),
        };
      }
    },
    onMutate: async (expense) => {
      const key = ["expenses", expense.budgetId.toString()];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Expense[]>(key);
      const optimisticId = makeTempExpenseId();
      const optimistic: Expense = {
        ...expense,
        id: optimisticId,
        owner: "",
        createdAt: BigInt(Date.now()),
      };
      queryClient.setQueryData<Expense[]>(key, (old) => [
        optimistic,
        ...(old ?? []),
      ]);
      return { previous, optimisticId };
    },
    onError: (_err, expense, context) => {
      if (context) {
        queryClient.setQueryData(
          ["expenses", expense.budgetId.toString()],
          context.previous,
        );
      }
    },
    onSuccess: (data, variables, context) => {
      const key = ["expenses", variables.budgetId.toString()];
      queryClient.setQueryData<Expense[]>(key, (old) =>
        old?.map((e) => (e.id === context?.optimisticId ? data : e)),
      );
      invalidateExpenseQueries(queryClient, variables.budgetId);
    },
  });
}

/**
 * Retries expenses that were queued offline (see useAddExpense above).
 * Call once near the app root so it fires on the `online` event and once
 * on mount, in case items were queued in a previous session.
 */
export function useFlushExpenseOutbox() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();

  return useCallback(async () => {
    if (!actor || !navigator.onLine) return;
    const pending = await listPendingExpenses();
    for (const item of pending) {
      try {
        const created = await actor.createExpense(item.input);
        await removePendingExpense(item.tempId);
        const key = ["expenses", item.input.budgetId.toString()];
        queryClient.setQueryData<Expense[]>(key, (old) =>
          old?.map((e) => (e.id === item.tempId ? created : e)),
        );
        invalidateExpenseQueries(queryClient, item.input.budgetId);
      } catch (err) {
        // Still offline, or the request failed again - leave it queued and
        // stop for now rather than hammering a connection that just came
        // back. The next online event (or app load) retries the rest.
        if (isLikelyOffline(err)) break;
      }
    }
  }, [actor, queryClient]);
}

export function useBulkCreateExpenses() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: BulkCreateExpensesInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createExpensesBulk(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", variables.budgetId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-trend"] });
      queryClient.invalidateQueries({ queryKey: ["category-trend"] });
      queryClient.invalidateQueries({ queryKey: ["daily-spending"] });
      queryClient.invalidateQueries({ queryKey: ["category-breakdown"] });
      queryClient.invalidateQueries({
        queryKey: ["category-breakdown-range"],
      });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-in-range"] });
    },
  });
}

export function useCreateSplitExpense() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: SplitExpenseInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSplitExpense(input);
    },
    onSuccess: (_data, variables) => {
      for (const split of variables.splits) {
        queryClient.invalidateQueries({
          queryKey: ["expenses", split.budgetId.toString()],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-trend"] });
      queryClient.invalidateQueries({ queryKey: ["category-trend"] });
      queryClient.invalidateQueries({ queryKey: ["daily-spending"] });
      queryClient.invalidateQueries({ queryKey: ["category-breakdown"] });
      queryClient.invalidateQueries({
        queryKey: ["category-breakdown-range"],
      });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-in-range"] });
      queryClient.invalidateQueries({ queryKey: ["receipt-gallery"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteExpense(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previous = queryClient.getQueriesData<Expense[]>({
        queryKey: ["expenses"],
      });
      queryClient.setQueriesData<Expense[]>({ queryKey: ["expenses"] }, (old) =>
        old?.filter((e) => e.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-trend"] });
      queryClient.invalidateQueries({ queryKey: ["category-trend"] });
      queryClient.invalidateQueries({ queryKey: ["daily-spending"] });
      queryClient.invalidateQueries({ queryKey: ["category-breakdown"] });
      queryClient.invalidateQueries({
        queryKey: ["category-breakdown-range"],
      });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-in-range"] });
      queryClient.invalidateQueries({ queryKey: ["receipt-gallery"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBudget(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["monthly-summary"] });
      const previous = queryClient.getQueriesData<MonthlySummary>({
        queryKey: ["monthly-summary"],
      });
      queryClient.setQueriesData<MonthlySummary>(
        { queryKey: ["monthly-summary"] },
        (old) =>
          old && {
            ...old,
            budgets: old.budgets.filter((b) => b.budget.id !== id),
          },
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["all-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-list"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-trend"] });
      queryClient.invalidateQueries({ queryKey: ["category-trend"] });
      queryClient.invalidateQueries({ queryKey: ["category-breakdown"] });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
    },
  });
}

// ─── Recurring Templates ──────────────────────────────────────────────────────

function recurringTemplatesQueryOptions(
  budgetId: bigint,
  actor: Backend | null,
  isFetching: boolean,
) {
  return {
    queryKey: ["recurring-templates", budgetId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listRecurringTemplates(budgetId);
      return result as unknown as RecurringTemplate[];
    },
    enabled: !!actor && !isFetching,
  };
}

export function useRecurringTemplates(budgetId: bigint) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<RecurringTemplate[]>(
    recurringTemplatesQueryOptions(budgetId, actor, isFetching),
  );
}

/** Fetches recurring templates for a variable-length list of budgets in one
 * hook call via useQueries, instead of mounting one query per budget through
 * hidden child components - every result is available synchronously on the
 * first render, so there's no separate "still loading" bookkeeping needed. */
export function useRecurringTemplatesForBudgets(budgetIds: bigint[]) {
  const { actor, isFetching } = useActorOrMock();
  const results = useQueries({
    queries: budgetIds.map((budgetId) =>
      recurringTemplatesQueryOptions(budgetId, actor, isFetching),
    ),
  });

  const templatesByBudget = new Map<string, RecurringTemplate[]>();
  budgetIds.forEach((budgetId, i) => {
    templatesByBudget.set(budgetId.toString(), results[i].data ?? []);
  });

  return {
    templatesByBudget,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}

export function useCreateRecurringTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
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
  const { actor } = useActorOrMock();
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
  const { actor } = useActorOrMock();
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
    onMutate: async ({ id, budgetId }) => {
      const key = ["recurring-templates", budgetId.toString()];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<RecurringTemplate[]>(key);
      queryClient.setQueryData<RecurringTemplate[]>(key, (old) =>
        old?.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(
        ["recurring-templates", variables.budgetId.toString()],
        context?.previous,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-templates", variables.budgetId.toString()],
      });
    },
  });
}

export function useApplyRecurringTemplates(year: number, month: number) {
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor } = useActorOrMock();
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
  const { actor } = useActorOrMock();
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
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteNote(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previous = queryClient.getQueryData<Note[]>(["notes"]);
      queryClient.setQueryData<Note[]>(["notes"], (old) =>
        old?.filter((n) => n.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["notes"], context?.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// ─── Categories ─────────────────────────────────────────────────────────────

export function useCategories() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listCategories();
      return result as unknown as Category[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ─── Category rules (auto-categorization) ────────────────────────────────────

export function useCategoryRules() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<CategoryRule[]>({
    queryKey: ["category-rules"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listCategoryRules();
      return result as unknown as CategoryRule[];
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLearnCategoryRule() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      keyword,
      category,
    }: { keyword: string; category: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.learnCategoryRule(keyword, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-rules"] });
    },
  });
}

export function useDeleteCategoryRule() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCategoryRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-rules"] });
    },
  });
}

// ─── Accounts ───────────────────────────────────────────────────────────────

export function useAccounts() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listAccounts();
      return result as unknown as Account[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: AccountInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createAccount(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: AccountInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAccount(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAccount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
  const { actor, isFetching } = useActorOrMock();

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
  const { actor, isFetching } = useActorOrMock();
  return useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getUserSettings();
      return {
        alertThresholdPercent: Number(result.alertThresholdPercent),
        savingsFloorCents: BigInt(result.savingsFloorCents),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateUserSettings({
        alertThresholdPercent: settings.alertThresholdPercent,
        savingsFloorCents: settings.savingsFloorCents,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
}

// ─── Income ───────────────────────────────────────────────────────────────────

export function useIncome(year: number, month: number) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Income[]>({
    queryKey: ["income", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listIncome(BigInt(year), BigInt(month));
      return result as unknown as Income[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: IncomeInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createIncome(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: IncomeInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateIncome(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteIncome(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["income"] });
      const previous = queryClient.getQueriesData<Income[]>({
        queryKey: ["income"],
      });
      queryClient.setQueriesData<Income[]>({ queryKey: ["income"] }, (old) =>
        old?.filter((i) => i.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        for (const [key, data] of context.previous) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["annual-summary"] });
    },
  });
}

// ─── Recurring Income ─────────────────────────────────────────────────────────

export function useRecurringIncomes() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<RecurringIncome[]>({
    queryKey: ["recurring-incomes"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listRecurringIncomes();
      return result as unknown as RecurringIncome[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRecurringIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: RecurringIncomeInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createRecurringIncome(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-incomes"] });
    },
  });
}

export function useUpdateRecurringIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: bigint;
      input: RecurringIncomeInput;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateRecurringIncome(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-incomes"] });
    },
  });
}

export function useDeleteRecurringIncome() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteRecurringIncome(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-incomes"] });
    },
  });
}

export function useApplyRecurringIncome(year: number, month: number) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Income[]>({
    queryKey: ["apply-recurring-income", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.applyRecurringIncomes(
        BigInt(year),
        BigInt(month),
      );
      return result as unknown as Income[];
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── Savings Goals ────────────────────────────────────────────────────────────

export function useSavingsGoals() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<SavingsGoal[]>({
    queryKey: ["savings-goals"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listSavingsGoals();
      return result as unknown as SavingsGoal[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: SavingsGoalInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createSavingsGoal(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: string; input: SavingsGoalInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSavingsGoal(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteSavingsGoal(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["savings-goals"] });
      const previous = queryClient.getQueryData<SavingsGoal[]>([
        "savings-goals",
      ]);
      queryClient.setQueryData<SavingsGoal[]>(["savings-goals"], (old) =>
        old?.filter((g) => g.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["savings-goals"], context?.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
}

export function useContributeSavingsGoal() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      id,
      amountCents,
    }: { id: string; amountCents: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.contributeSavingsGoal(id, amountCents);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
    },
  });
}

export function useAllBudgets() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Budget[]>({
    queryKey: ["all-budgets"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listAllBudgets();
      return result as unknown as Budget[];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Receipt Gallery ──────────────────────────────────────────────────────────

export function useReceiptGallery() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Expense[]>({
    queryKey: ["receipt-gallery"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listExpensesWithReceipts();
      return result as unknown as Expense[];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Backup / Restore ─────────────────────────────────────────────────────────

export function useExportData() {
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.exportAllData();
    },
  });
}

export function useImportData() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (json: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.importAllData(json);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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
  const { actor, isFetching } = useActorOrMock();
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

// ─── Bill Payments ────────────────────────────────────────────────────────────

export function useListBillPayments(year: number, month: number) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<BillPayment[]>({
    queryKey: ["bill-payments", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listBillPayments(BigInt(year), BigInt(month));
      return result as unknown as BillPayment[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBillPayment() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: BillPaymentInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBillPayment(input) as unknown as BillPayment;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "bill-payments",
          Number(variables.year),
          Number(variables.month),
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
    },
  });
}

export function useUpdateBillPayment() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: string; input: BillPaymentInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateBillPayment(
        id,
        input,
      ) as unknown as BillPayment | null;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "bill-payments",
          Number(variables.input.year),
          Number(variables.input.month),
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
    },
  });
}

export function useDeleteBillPayment() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({ id }: { id: string; year: number; month: number }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBillPayment(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bill-payments", variables.year, variables.month],
      });
      queryClient.invalidateQueries({ queryKey: ["upcoming-bills"] });
    },
  });
}

export function useUpcomingBills(withinDays: number) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<UpcomingBill[]>({
    queryKey: ["upcoming-bills", withinDays],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getUpcomingBills(BigInt(withinDays));
      return result as unknown as UpcomingBill[];
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── List all budgets (used by bills page to fetch all templates) ─────────────

export function useListBudgets(year: number, month: number) {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<Budget[]>({
    queryKey: ["budgets-list", year, month],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listBudgets(BigInt(year), BigInt(month));
      return result as unknown as Budget[];
    },
    enabled: !!actor && !isFetching,
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
  BillPayment,
  BillPaymentInput,
  Income,
  IncomeInput,
  RecurringIncome,
  RecurringIncomeInput,
  SavingsGoal,
  SavingsGoalInput,
  UpcomingBill,
};
