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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CalendarDays,
  ImagePlus,
  Loader2,
  NotepadText,
  Receipt,
  StickyNote,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAddExpense } from "../hooks/useBudget";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

interface ExpenseFormProps {
  budgetId: bigint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function FieldLabel({
  children,
  htmlFor,
  icon,
}: { children: React.ReactNode; htmlFor?: string; icon?: React.ReactNode }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5"
    >
      {icon}
      {children}
    </Label>
  );
}

/** Convert a File to a base64 data-URL string */
async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ExpenseForm({
  budgetId,
  open,
  onOpenChange,
}: ExpenseFormProps) {
  const addExpense = useAddExpense();
  const [date, setDate] = useState(todayISO());
  const [amountStr, setAmountStr] = useState("");
  const [notes, setNotes] = useState("");
  const [amountError, setAmountError] = useState("");

  // Receipt state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setDate(todayISO());
    setAmountStr("");
    setNotes("");
    setAmountError("");
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptError("");
    setIsUploading(false);
    setUploadProgress(0);
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function validateAmount(val: string) {
    const n = Number.parseFloat(val);
    if (!val || !Number.isFinite(n) || n <= 0) {
      setAmountError("Please enter a valid amount greater than N$0.00");
      return false;
    }
    setAmountError("");
    return true;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setReceiptError("Only JPG, PNG, GIF or WEBP images are allowed.");
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setReceiptError("File is too large. Maximum size is 5 MB.");
      setReceiptFile(null);
      setReceiptPreview(null);
      return;
    }

    setReceiptError("");
    setReceiptFile(file);
    const objectUrl = URL.createObjectURL(file);
    setReceiptPreview(objectUrl);
  }

  function removeReceipt() {
    setReceiptFile(null);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(null);
    setReceiptError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAmount(amountStr)) return;

    const amountCents = BigInt(Math.round(Number.parseFloat(amountStr) * 100));

    let receiptUrl: string | undefined;
    if (receiptFile) {
      setIsUploading(true);
      setUploadProgress(10);
      try {
        // Simulate progress ticks while converting
        const tick = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 15, 85));
        }, 120);
        receiptUrl = await fileToDataURL(receiptFile);
        clearInterval(tick);
        setUploadProgress(100);
      } catch {
        setIsUploading(false);
        setReceiptError("Failed to process receipt image. Please try again.");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      await addExpense.mutateAsync({
        budgetId,
        date,
        amountCents,
        notes: notes.trim() || undefined,
        receiptUrl,
      });
      toast.success("Expense added");
      handleClose(false);
    } catch {
      toast.error("Failed to add expense");
    }
  }

  const isBusy = addExpense.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-card border-border shadow-premium backdrop-blur-md"
        data-ocid="expense_form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            Add Expense
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Record a new expense against this budget.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Date */}
          <div>
            <FieldLabel
              htmlFor="expense-date"
              icon={<CalendarDays className="w-3 h-3" />}
            >
              Date
            </FieldLabel>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-focus h-10 font-mono text-sm"
              data-ocid="expense_form.date.input"
            />
          </div>

          {/* Amount */}
          <div>
            <FieldLabel
              htmlFor="expense-amount"
              icon={<NotepadText className="w-3 h-3" />}
            >
              Amount
            </FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
                N$
              </span>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                onBlur={() => validateAmount(amountStr)}
                className={`pl-9 input-focus h-10 font-mono text-sm ${amountError ? "border-destructive focus:border-destructive" : ""}`}
                data-ocid="expense_form.amount.input"
                aria-invalid={!!amountError}
              />
            </div>
            {amountError && (
              <p
                className="flex items-center gap-1.5 text-xs text-destructive mt-1"
                data-ocid="expense_form.amount.field_error"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {amountError}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <FieldLabel
              htmlFor="expense-notes"
              icon={<StickyNote className="w-3 h-3" />}
            >
              Notes{" "}
              <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                (optional)
              </span>
            </FieldLabel>
            <Textarea
              id="expense-notes"
              placeholder="e.g. Weekly grocery run at Shoprite"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input-focus text-sm resize-none"
              data-ocid="expense_form.notes.textarea"
            />
          </div>

          {/* Receipt */}
          <div>
            <FieldLabel icon={<Receipt className="w-3 h-3" />}>
              Receipt{" "}
              <span className="text-muted-foreground/60 normal-case font-normal tracking-normal">
                (optional)
              </span>
            </FieldLabel>

            {receiptPreview ? (
              /* Preview card */
              <div className="relative rounded-xl border border-border overflow-hidden bg-muted/20 group">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full max-h-48 object-contain"
                />
                <button
                  type="button"
                  onClick={removeReceipt}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/90 border border-border shadow-subtle flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                  aria-label="Remove receipt"
                  data-ocid="expense_form.receipt_remove_button"
                >
                  <X className="w-3 h-3 text-foreground" />
                </button>
                {receiptFile && (
                  <div className="px-3 py-1.5 bg-muted/40 border-t border-border">
                    <p className="text-[11px] text-muted-foreground truncate">
                      {receiptFile.name}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Upload area */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors px-4 py-5 flex flex-col items-center gap-2 group"
                data-ocid="expense_form.receipt.dropzone"
              >
                <div className="w-9 h-9 rounded-lg bg-card border border-border shadow-subtle flex items-center justify-center group-hover:border-primary/30 transition-colors">
                  <ImagePlus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Click to attach a receipt photo
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  JPG, PNG, GIF or WEBP · max 5 MB
                </span>
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="expense_form.receipt_file_input"
            />

            {receiptError && (
              <p
                className="flex items-center gap-1.5 text-xs text-destructive mt-1"
                data-ocid="expense_form.receipt.error_state"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {receiptError}
              </p>
            )}

            {/* Upload progress bar */}
            {isUploading && (
              <div
                className="mt-2 space-y-1"
                data-ocid="expense_form.receipt.loading_state"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing receipt…
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 button-hover"
              onClick={() => handleClose(false)}
              data-ocid="expense_form.cancel_button"
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-hover shadow-elevated"
              disabled={isBusy}
              data-ocid="expense_form.submit_button"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUploading ? "Uploading…" : "Saving…"}
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
