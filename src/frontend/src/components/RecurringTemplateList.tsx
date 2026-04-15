import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
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
      <div className="space-y-2" data-ocid="recurring.loading_state">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-8 px-6 text-center rounded-xl border border-dashed border-border bg-card/40"
        data-ocid="recurring.empty_state"
      >
        <RefreshCw className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground font-body">
          No recurring expenses yet. Add one to auto-create expenses each month.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2" data-ocid="recurring.list">
        {templates.map((t, i) => (
          <div
            key={t.id.toString()}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-smooth"
            data-ocid={`recurring.item.${i + 1}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Every {ordinal(Number(t.dayOfMonth))} of the month
                  {t.notes ? ` · ${t.notes}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-sm font-semibold text-foreground">
                {formatCents(t.amountCents)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(t.id)}
                data-ocid={`recurring.edit_button.${i + 1}`}
                aria-label={`Edit ${t.name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => setDeleteId(t.id)}
                data-ocid={`recurring.delete_button.${i + 1}`}
                aria-label={`Delete ${t.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
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
            deleteTemplate.mutate({ id: deleteId, budgetId });
            setDeleteId(null);
          }
        }}
      />
    </>
  );
}
