import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useDeleteRecurringIncome } from "../hooks/useBudget";
import type { RecurringIncome } from "../types";
import { formatCents } from "../types";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

interface Props {
  templates: RecurringIncome[];
  isLoading: boolean;
  onEdit: (incomeId: bigint) => void;
}

export function RecurringIncomeList({ templates, isLoading, onEdit }: Props) {
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const deleteRecurringIncome = useDeleteRecurringIncome();

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
          No recurring income
        </p>
        <p className="text-xs text-muted-foreground max-w-[220px]">
          Add a recurring income source to auto-log it each month.
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
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {t.source}
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
              <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mr-1">
                +{formatCents(t.amountCents)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth rounded-lg"
                onClick={() => onEdit(t.id)}
                aria-label={`Edit ${t.source}`}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-smooth rounded-lg"
                onClick={() => setDeleteId(t.id)}
                aria-label={`Delete ${t.source}`}
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
        title="Delete recurring income?"
        description="This will stop future auto-logged income from this source. Existing income entries are not affected."
        onConfirm={() => {
          if (deleteId !== null) {
            deleteRecurringIncome.mutate(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}
