import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { CATEGORY_ICONS } from "../types";

const PRESET_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#64748b",
];

const CATEGORIES = Object.keys(CATEGORY_ICONS);

export interface BudgetFormValues {
  name: string;
  limitCents: bigint;
  category: string;
  color: string;
}

interface BudgetFormProps {
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  onCancel: () => void;
  isPending?: boolean;
}

function FieldError({ message, id }: { message: string; id: string }) {
  return (
    <p
      data-ocid={id}
      className="flex items-center gap-1.5 text-xs text-destructive mt-1 slide-up"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
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

export function BudgetForm({
  onSubmit,
  onCancel,
  isPending = false,
}: BudgetFormProps) {
  const [name, setName] = useState("");
  const [limitDollars, setLimitDollars] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "limit" | "category", string>>
  >({});

  function validate() {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Budget name is required.";
    const parsed = Number.parseFloat(limitDollars);
    if (!limitDollars || Number.isNaN(parsed) || parsed <= 0)
      errs.limit = "Enter a positive amount.";
    if (!category) errs.category = "Please select a category.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const limitCents = BigInt(
      Math.round(Number.parseFloat(limitDollars) * 100),
    );
    await onSubmit({ name: name.trim(), limitCents, category, color });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Budget Name */}
      <div>
        <FieldLabel htmlFor="budget-name">Budget Name</FieldLabel>
        <Input
          id="budget-name"
          data-ocid="budget_form.name_input"
          placeholder="e.g. Grocery Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          aria-invalid={!!errors.name}
          className={`input-focus h-10 ${errors.name ? "border-destructive focus:border-destructive focus:ring-destructive/15" : ""}`}
        />
        {errors.name && (
          <FieldError message={errors.name} id="budget_form.name_field_error" />
        )}
      </div>

      {/* Monthly Limit */}
      <div>
        <FieldLabel htmlFor="budget-limit">Monthly Limit</FieldLabel>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <span className="text-muted-foreground text-sm font-mono font-medium">
              N$
            </span>
          </div>
          <Input
            id="budget-limit"
            data-ocid="budget_form.limit_input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={limitDollars}
            onChange={(e) => setLimitDollars(e.target.value)}
            disabled={isPending}
            className={`pl-10 input-focus h-10 font-mono ${errors.limit ? "border-destructive focus:border-destructive focus:ring-destructive/15" : ""}`}
            aria-invalid={!!errors.limit}
          />
        </div>
        {errors.limit && (
          <FieldError
            message={errors.limit}
            id="budget_form.limit_field_error"
          />
        )}
      </div>

      {/* Category */}
      <div>
        <FieldLabel>Category</FieldLabel>
        <Select
          value={category}
          onValueChange={setCategory}
          disabled={isPending}
        >
          <SelectTrigger
            data-ocid="budget_form.category_select"
            aria-invalid={!!errors.category}
            className={`input-focus h-10 ${errors.category ? "border-destructive" : ""}`}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="shadow-premium">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <span className="flex items-center gap-2.5">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <FieldError
            message={errors.category}
            id="budget_form.category_field_error"
          />
        )}
      </div>

      {/* Color */}
      <div>
        <FieldLabel>Color</FieldLabel>
        <div
          className="flex flex-wrap gap-2.5 p-3 rounded-xl bg-muted/40 border border-border"
          aria-label="Budget color"
        >
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={color === c}
              data-ocid="budget_form.color_swatch"
              onClick={() => setColor(c)}
              disabled={isPending}
              className={`w-8 h-8 rounded-full transition-spring focus-visible-ring relative flex items-center justify-center ${
                color === c
                  ? "ring-2 ring-offset-2 ring-foreground/60 scale-110"
                  : "hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-foreground/30"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            >
              {color === c && (
                <Check
                  className="w-4 h-4 text-white drop-shadow"
                  strokeWidth={3}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 px-1">
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-[11px] text-muted-foreground font-mono">
            {color}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          data-ocid="budget_form.cancel_button"
          onClick={onCancel}
          disabled={isPending}
          className="button-hover"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="budget_form.submit_button"
          disabled={isPending}
          className="button-hover shadow-elevated min-w-[110px]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            "Add Budget"
          )}
        </Button>
      </div>
    </form>
  );
}
