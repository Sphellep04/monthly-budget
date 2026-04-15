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
import { Loader2 } from "lucide-react";
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
      errs.limit = "Enter a positive dollar amount.";
    if (!category) errs.category = "Select a category.";
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
      <div className="space-y-1.5">
        <Label htmlFor="budget-name" className="text-sm font-medium">
          Budget Name
        </Label>
        <Input
          id="budget-name"
          data-ocid="budget_form.name_input"
          placeholder="e.g. Grocery Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p
            data-ocid="budget_form.name_field_error"
            className="text-xs text-destructive"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Monthly Limit */}
      <div className="space-y-1.5">
        <Label htmlFor="budget-limit" className="text-sm font-medium">
          Monthly Limit ($)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
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
            className="pl-7"
            aria-invalid={!!errors.limit}
          />
        </div>
        {errors.limit && (
          <p
            data-ocid="budget_form.limit_field_error"
            className="text-xs text-destructive"
          >
            {errors.limit}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={category}
          onValueChange={setCategory}
          disabled={isPending}
        >
          <SelectTrigger
            data-ocid="budget_form.category_select"
            aria-invalid={!!errors.category}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <span className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p
            data-ocid="budget_form.category_field_error"
            className="text-xs text-destructive"
          >
            {errors.category}
          </p>
        )}
      </div>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Color</Label>
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label="Budget color"
        >
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              data-ocid="budget_form.color_swatch"
              onClick={() => setColor(c)}
              disabled={isPending}
              className={`w-7 h-7 rounded-full border-2 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                color === c
                  ? "border-foreground scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        {/* Preview swatch */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-muted-foreground font-mono">
            {color}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          data-ocid="budget_form.cancel_button"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="budget_form.submit_button"
          disabled={isPending}
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
