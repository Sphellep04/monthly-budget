import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteRecurringTemplate } from "../hooks/useBudget";
import type { RecurringTemplate } from "../types";
import { formatCents } from "../types";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

interface Props {
  templates: RecurringTemplate[];
  isLoading: boolean;
  budgetId: bigint;
  onEdit: (templateId: bigint) => void;
}

export function RecurringTemplateList({
  templates,
  isLoading,
  budgetId,
  onEdit,
}: Props) {
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const deleteTemplate = useDeleteRecurringTemplate();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-6 text-center rounded-2xl border border-dashed border-border bg-muted/20">
        <p className="text-sm font-medium text-foreground mb-1">
          No recurring expenses
        </p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Add a recurring template to auto-create expenses each month.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {templates.map((t) => (
          <div
            key={t.id.toString()}
            className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-border bg-card hover:bg-muted/20 hover:border-secondary/20 hover:shadow-subtle transition-smooth"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {t.name}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 bg-secondary/8 text-secondary border-secondary/20"
                  >
                    {ordinal(Number(t.dayOfMonth))} of month
                  </Badge>
                </div>
                {t.notes && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {t.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="font-mono text-sm font-bold text-foreground tabular-nums mr-1">
                {formatCents(t.amountCents)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth rounded-lg"
                onClick={() => onEdit(t.id)}
                aria-label={`Edit ${t.name}`}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-smooth rounded-lg"
                onClick={() => setDeleteId(t.id)}
                aria-label={`Delete ${t.name}`}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete recurring template?"
        description="This will stop future auto-expenses from this template. Existing expenses are not affected."
        onConfirm={() => {
          if (deleteId !== null) {
            deleteTemplate.mutate(
              { id: deleteId, budgetId },
              { onError: () => toast.error("Failed to delete template") },
            );
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}
