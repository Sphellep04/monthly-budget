import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useCreateRecurringTemplate,
  useUpdateRecurringTemplate,
} from "../hooks/useBudget";
import type { RecurringTemplate } from "../types";

interface Props {
  budgetId: bigint;
  templateId: bigint | null; // null = create, non-null = edit
  templates: RecurringTemplate[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecurringTemplateForm({
  budgetId,
  templateId,
  templates,
  open,
  onOpenChange,
}: Props) {
  const isEditing = templateId !== null;
  const existing = templates.find((t) => t.id === templateId) ?? null;

  const [name, setName] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [notes, setNotes] = useState("");

  const createTemplate = useCreateRecurringTemplate();
  const updateTemplate = useUpdateRecurringTemplate();
  const isPending = createTemplate.isPending || updateTemplate.isPending;

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setAmountStr((Number(existing.amountCents) / 100).toFixed(2));
      setDayOfMonth(existing.dayOfMonth.toString());
      setNotes(existing.notes ?? "");
    } else {
      setName("");
      setAmountStr("");
      setDayOfMonth("1");
      setNotes("");
    }
  }, [existing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amountCents = Math.round(Number.parseFloat(amountStr) * 100);
    const day = Number.parseInt(dayOfMonth, 10);

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (Number.isNaN(amountCents) || amountCents <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (Number.isNaN(day) || day < 1 || day > 31) {
      toast.error("Day of month must be between 1 and 31");
      return;
    }

    const input = {
      budgetId,
      name: name.trim(),
      amountCents: BigInt(amountCents),
      dayOfMonth: BigInt(day),
      notes: notes.trim() || undefined,
    };

    if (isEditing && templateId !== null) {
      updateTemplate.mutate(
        { id: templateId, input },
        {
          onSuccess: () => {
            toast.success("Recurring template updated");
            onOpenChange(false);
          },
          onError: () => toast.error("Failed to update template"),
        },
      );
    } else {
      createTemplate.mutate(input, {
        onSuccess: () => {
          toast.success("Recurring template added");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create template"),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="recurring_form.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? "Edit Recurring Expense" : "Add Recurring Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="rt-name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="rt-name"
              placeholder="e.g. Netflix subscription"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="recurring_form.name_input"
              autoFocus
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="rt-amount" className="text-sm font-medium">
              Amount ($)
            </Label>
            <Input
              id="rt-amount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              data-ocid="recurring_form.amount_input"
            />
          </div>

          {/* Day of month */}
          <div className="space-y-1.5">
            <Label htmlFor="rt-day" className="text-sm font-medium">
              Day of month
            </Label>
            <Input
              id="rt-day"
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              placeholder="1–31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              data-ocid="recurring_form.day_input"
            />
            <p className="text-xs text-muted-foreground">
              For months with fewer days, the expense will be created on the
              last day.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="rt-notes" className="text-sm font-medium">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="rt-notes"
              placeholder="e.g. Annual plan, paid monthly"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              data-ocid="recurring_form.notes_textarea"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="recurring_form.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="recurring_form.submit_button"
            >
              {isPending
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Add Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
