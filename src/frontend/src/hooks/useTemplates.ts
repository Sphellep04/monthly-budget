import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActorOrMock } from "./useActorOrMock";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useListBudgetTemplates() {
  const { actor, isFetching } = useActorOrMock();
  return useQuery<BudgetTemplate[]>({
    queryKey: ["budget-templates"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.listBudgetTemplates();
      return result as unknown as BudgetTemplate[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (input: BudgetTemplateInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createBudgetTemplate({
        name: input.name,
        categories: input.categories,
      }) as unknown as BudgetTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    },
  });
}

export function useUpdateBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!actor) throw new Error("Actor not ready");
      const existing = await actor.getBudgetTemplate(id);
      if (!existing) throw new Error("Template not found");
      const tpl = existing as unknown as BudgetTemplate;
      return actor.updateBudgetTemplate(id, {
        name,
        categories: tpl.categories,
      }) as unknown as BudgetTemplate | null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    },
  });
}

export function useDeleteBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteBudgetTemplate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-templates"] });
    },
  });
}

export function useApplyBudgetTemplate() {
  const queryClient = useQueryClient();
  const { actor } = useActorOrMock();
  return useMutation({
    mutationFn: async ({
      templateId,
      year,
      month,
    }: {
      templateId: string;
      year: number;
      month: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.applyBudgetTemplate(templateId, BigInt(year), BigInt(month));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-summary"] });
      queryClient.invalidateQueries({ queryKey: ["all-budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budgets-list"] });
    },
  });
}
