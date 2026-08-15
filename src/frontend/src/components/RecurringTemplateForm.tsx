import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
  templateId: bigint | null;
  templates: RecurringTemplate[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldLabel({
  children,
  htmlFor,
}: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
    >
      {children}
    </Label>
  );
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createTemplate = useCreateRecurringTemplate();
  const updateTemplate = useUpdateRecurringTemplate();
  const isPending = createTemplate.isPending || updateTemplate.isPending;

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
    setErrors({});
  }, [existing]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    const amount = Math.round(Number.parseFloat(amountStr) * 100);
    if (Number.isNaN(amount) || amount <= 0)
      errs.amount = "Enter a valid amount.";
    const day = Number.parseInt(dayOfMonth, 10);
    if (Number.isNaN(day) || day < 1 || day > 31)
      errs.day = "Day must be between 1 and 31.";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));
    const day = Number.parseInt(dayOfMonth, 10);

    const input = {
      budgetId,
      name: name.trim(),
      amountCents,
      dayOfMonth: BigInt(day),
      notes: notes.trim() || undefined,
    };

    if (isEditing && templateId !== null) {
      updateTemplate.mutate(
        { id: templateId, input },
        {
          onSuccess: () => {
            toast.success("Template updated");
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
      <DialogContent className="sm:max-w-md shadow-premium">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing ? "Edit Recurring Expense" : "Add Recurring Expense"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing
              ? "Update this recurring expense template."
              : "This expense will be auto-applied each month on the day you choose."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name */}
          <div>
            <FieldLabel htmlFor="rt-name">Name</FieldLabel>
            <Input
              id="rt-name"
              placeholder="e.g. Netflix subscription"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className={`input-focus h-10 ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <FieldLabel htmlFor="rt-amount">Amount</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm pointer-events-none">
                N$
              </span>
              <Input
                id="rt-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className={`pl-9 input-focus h-10 font-mono text-sm ${errors.amount ? "border-destructive" : ""}`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Day of month */}
          <div>
            <FieldLabel htmlFor="rt-day">Day of Month</FieldLabel>
            <Input
              id="rt-day"
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              placeholder="1–31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className={`input-focus h-10 font-mono w-32 ${errors.day ? "border-destructive" : ""}`}
            />
            {errors.day ? (
              <p className="text-xs text-destructive mt-1">{errors.day}</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1.5">
                For months with fewer days, the expense will be created on the
                last available day.
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <FieldLabel htmlFor="rt-notes">
              Notes{" "}
              <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                (optional)
              </span>
            </FieldLabel>
            <Textarea
              id="rt-notes"
              placeholder="e.g. Annual plan, paid monthly"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-focus text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="button-hover"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="button-hover shadow-elevated min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Saving…
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Template"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
