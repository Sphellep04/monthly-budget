import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Budget,
  BudgetSummary,
  CategoryTrendPoint,
  Expense,
  MonthlySummary,
  MonthlyTrendPoint,
  RecurringTemplate,
  RecurringTemplateInput,
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

export type {
  MonthlySummary,
  Budget,
  Expense,
  BudgetSummary,
  RecurringTemplate,
  RecurringTemplateInput,
  MonthlyTrendPoint,
  CategoryTrendPoint,
};
