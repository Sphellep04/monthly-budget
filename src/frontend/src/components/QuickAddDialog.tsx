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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ChangeEvent,
  type ClipboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import {
  useAddExpense,
  useBudgets,
  useCategories,
  useCategoryRules,
  useCreateBudget,
  useLearnCategoryRule,
} from "../hooks/useBudget";
import { extractKeyword, suggestCategory } from "../lib/autoCategorize";
import { parseTransactionText } from "../lib/transactionParser";
import { CATEGORIES, UNPLANNED_CATEGORY } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function QuickAddDialog({ open, onOpenChange }: Props) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [rawText, setRawText] = useState("");
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amountStr, setAmountStr] = useState("");
  const [date, setDate] = useState(todayIso());
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [newBudgetLimitStr, setNewBudgetLimitStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: customCategories = [] } = useCategories();
  const { data: categoryRules = [] } = useCategoryRules();
  const targetYear = Number(date.slice(0, 4)) || new Date().getFullYear();
  const targetMonth = Number(date.slice(5, 7)) || new Date().getMonth() + 1;
  const { data: monthBudgets = [] } = useBudgets(targetYear, targetMonth);
  const createBudget = useCreateBudget();
  const addExpense = useAddExpense();
  const learnRule = useLearnCategoryRule();

  const allCategories = useMemo(
    () => [...CATEGORIES, ...customCategories.map((c) => c.name)],
    [customCategories],
  );

  const matchingBudget = useMemo(
    () => monthBudgets.find((b) => b.category === category),
    [monthBudgets, category],
  );

  function applyParsed(text: string) {
    const parsed = parseTransactionText(text);
    if (parsed.amountCents != null) {
      setAmountStr((Number(parsed.amountCents) / 100).toFixed(2));
    }
    if (parsed.date) setDate(parsed.date);
    if (parsed.merchant) setMerchant(parsed.merchant);

    const suggestion = suggestCategory(parsed.merchant ?? text, categoryRules);
    if (suggestion) setCategory(suggestion.category);
  }

  function handleTextChange(value: string) {
    setRawText(value);
    if (value.trim()) applyParsed(value);
  }

  async function runOcrOnFile(file: File) {
    setOcrBusy(true);
    setOcrError(null);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      // Dynamic import so Tesseract.js stays out of the main bundle.
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, { logger: () => {} });
      try {
        const {
          data: { text },
        } = await worker.recognize(dataUrl);
        // The image and its data URL are never stored or uploaded anywhere -
        // only the extracted text is kept, and that reference is dropped
        // once this function returns.
        setRawText(text);
        applyParsed(text);
      } finally {
        await worker.terminate();
      }
    } catch {
      setOcrError("Couldn't read that image. Try pasting the text instead.");
    } finally {
      setOcrBusy(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) runOcrOnFile(file);
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const item = Array.from(e.clipboardData.items).find((i) =>
      i.type.startsWith("image/"),
    );
    const file = item?.getAsFile();
    if (file) {
      e.preventDefault();
      runOcrOnFile(file);
    }
  }

  function reset() {
    setMode("text");
    setRawText("");
    setOcrError(null);
    setAmountStr("");
    setDate(todayIso());
    setMerchant("");
    setCategory("");
    setNewBudgetLimitStr("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  async function handleSubmit() {
    const amount = Number.parseFloat(amountStr);
    if (!amountStr || Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (!category) {
      toast.error("Pick a category.");
      return;
    }

    setSubmitting(true);
    try {
      let budgetId = matchingBudget?.id;

      if (!budgetId) {
        let limitCents = 0n;
        if (category !== UNPLANNED_CATEGORY) {
          const limit = Number.parseFloat(newBudgetLimitStr);
          if (!newBudgetLimitStr || Number.isNaN(limit) || limit <= 0) {
            toast.error(
              `No ${category} budget for this month yet - enter a limit to create one.`,
            );
            setSubmitting(false);
            return;
          }
          limitCents = BigInt(Math.round(limit * 100));
        }
        const created = await createBudget.mutateAsync({
          name: category,
          limitCents,
          color: PRESET_COLORS[monthBudgets.length % PRESET_COLORS.length],
          category,
          year: BigInt(targetYear),
          month: BigInt(targetMonth),
          rollover: false,
        });
        budgetId = created.id;
      }

      await addExpense.mutateAsync({
        budgetId,
        date,
        amountCents: BigInt(Math.round(amount * 100)),
        notes: merchant.trim() || undefined,
      });

      const keyword = extractKeyword(merchant || rawText);
      if (keyword && category !== UNPLANNED_CATEGORY) {
        learnRule.mutate({ keyword, category });
      }

      toast.success("Expense added", {
        description: `${category} · N$${amountStr}`,
      });
      handleClose(false);
    } catch {
      toast.error("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  }

  const hasParsedSomething = amountStr || merchant || category;
  const canSubmit = amountStr.trim() !== "" && category !== "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg shadow-premium">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            Quick Add
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Paste a bank SMS/notification, or a screenshot of one - the amount,
            date, and category get filled in for you to check.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "text" | "image")}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="text">Paste text</TabsTrigger>
            <TabsTrigger value="image">Paste / upload image</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === "text" ? (
          <textarea
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g. FNB: Your acc was debited N$150.00 at SHOPRITE WINDHOEK on 03/09/2026"
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm input-focus resize-none"
          />
        ) : (
          <div
            onPaste={handlePaste}
            className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 flex flex-col items-center gap-2 text-center"
          >
            {ocrBusy ? (
              <>
                <Spinner className="w-5 h-5" />
                <p className="text-xs text-muted-foreground">Reading image…</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  Click here and press Ctrl+V to paste a screenshot
                </p>
                <p className="text-xs text-muted-foreground">
                  or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    choose a file
                  </button>
                </p>
                <p className="text-[12px] text-muted-foreground/70 max-w-xs">
                  Read on this device only - the image itself is never saved or
                  uploaded, only the extracted text.
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              tabIndex={-1}
            />
          </div>
        )}
        {ocrError && (
          <p className="text-xs text-destructive -mt-2">{ocrError}</p>
        )}

        <div className="space-y-3 pt-1 border-t border-border/60">
          <p className="text-[12px] font-bold text-muted-foreground/60 uppercase tracking-[0.14em] pt-3">
            {hasParsedSomething ? "Review before saving" : "Expense details"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="qa-amount" className="text-xs font-medium">
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono pointer-events-none">
                  N$
                </span>
                <Input
                  id="qa-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="pl-9 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qa-date" className="text-xs font-medium">
                Date
              </Label>
              <Input
                id="qa-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qa-merchant" className="text-xs font-medium">
              Merchant / notes
            </Label>
            <Input
              id="qa-merchant"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Shoprite Windhoek"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Category</Label>
              {category !== UNPLANNED_CATEGORY && (
                <button
                  type="button"
                  onClick={() => setCategory(UNPLANNED_CATEGORY)}
                  className="text-[12px] text-primary hover:underline -m-2 p-2"
                >
                  Not sure? Log as unplanned
                </button>
              )}
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNPLANNED_CATEGORY}>Unplanned</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {category &&
            (matchingBudget ? (
              <p className="text-xs text-muted-foreground">
                Will be added to your{" "}
                <span className="font-semibold text-foreground">
                  {matchingBudget.name}
                </span>{" "}
                budget.
              </p>
            ) : category === UNPLANNED_CATEGORY ? (
              <p className="text-xs text-muted-foreground">
                Logged without a specific category, so it's recorded now without
                slowing you down.
              </p>
            ) : (
              <div className="space-y-1.5 rounded-lg bg-amber-500/8 border border-amber-500/20 px-3 py-2.5">
                <Label
                  htmlFor="qa-new-limit"
                  className="text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  No {category} budget yet this month - set a limit to create
                  one
                </Label>
                <Input
                  id="qa-new-limit"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Monthly limit, e.g. 1500.00"
                  value={newBudgetLimitStr}
                  onChange={(e) => setNewBudgetLimitStr(e.target.value)}
                  className="font-mono h-9"
                />
              </div>
            ))}
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 button-hover"
            onClick={() => handleClose(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 button-hover shadow-elevated"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Saving…
              </>
            ) : (
              "Add Expense"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
