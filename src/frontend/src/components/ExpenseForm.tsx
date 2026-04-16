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
  Camera,
  ImagePlus,
  Loader2,
  NotepadText,
  Receipt,
  ScanLine,
  StickyNote,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
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

/**
 * Extract the largest currency-like number from OCR text.
 * Returns a formatted decimal string (e.g. "149.99") or null.
 */
function extractLargestAmount(text: string): string | null {
  // Match patterns like: 149.99  N$149.99  $12.50  1,234.56  etc.
  const pattern =
    /(?:N\$|R|\$)?\s*(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/g;
  const matches: number[] = [];
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop pattern
  while ((m = pattern.exec(text)) !== null) {
    const raw = m[1].replace(/[,\s]/g, "");
    const val = Number.parseFloat(raw);
    if (Number.isFinite(val) && val > 0) {
      matches.push(val);
    }
  }
  if (matches.length === 0) return null;
  const largest = Math.max(...matches);
  return largest.toFixed(2);
}

/** Run Tesseract OCR on an image data URL and return extracted text */
async function runOCR(imageDataUrl: string): Promise<string> {
  // Dynamic import so Tesseract.js is code-split and not in the main bundle
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng", 1, {
    logger: () => {}, // suppress verbose progress logs
  });
  try {
    const {
      data: { text },
    } = await worker.recognize(imageDataUrl);
    return text;
  } finally {
    await worker.terminate();
  }
}

type ScanState = "idle" | "scanning" | "done" | "failed";

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
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [receiptError, setReceiptError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // OCR / scan state
  const [scanState, setScanState] = useState<ScanState>("idle");

  function reset() {
    setDate(todayISO());
    setAmountStr("");
    setNotes("");
    setAmountError("");
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptDataUrl(null);
    setReceiptError("");
    setIsUploading(false);
    setUploadProgress(0);
    setScanState("idle");
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

  function applyReceiptFile(file: File, preview: string) {
    setReceiptFile(file);
    setReceiptPreview(preview);
    setReceiptDataUrl(null); // will be generated on submit
    setReceiptError("");
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

    const objectUrl = URL.createObjectURL(file);
    applyReceiptFile(file, objectUrl);
  }

  /** Handle the camera capture input change — runs OCR automatically */
  const handleCameraCapture = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset camera input so same file can be re-selected
      if (cameraInputRef.current) cameraInputRef.current.value = "";

      if (!ALLOWED_TYPES.includes(file.type)) {
        setReceiptError("Only JPG, PNG, GIF or WEBP images are allowed.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setReceiptError("File too large. Maximum size is 5 MB.");
        return;
      }

      setReceiptError("");
      setScanState("scanning");

      // Convert to data URL so we can display it and run OCR
      let dataUrl: string;
      try {
        dataUrl = await fileToDataURL(file);
      } catch {
        setScanState("failed");
        setReceiptError("Could not read the captured image. Please try again.");
        return;
      }

      // Set preview immediately so user can see the photo
      setReceiptFile(file);
      setReceiptPreview(dataUrl);
      setReceiptDataUrl(dataUrl);

      // Run OCR
      try {
        const text = await runOCR(dataUrl);
        const amount = extractLargestAmount(text);
        if (amount) {
          setAmountStr(amount);
          setAmountError("");
          setScanState("done");
          toast.success(`Receipt scanned — amount detected: N$${amount}`, {
            description: "You can adjust the amount before saving.",
            duration: 5000,
          });
        } else {
          setScanState("failed");
          toast.warning("Amount not detected", {
            description:
              "Could not find an amount on the receipt. Please enter it manually.",
            duration: 6000,
          });
        }
      } catch {
        setScanState("failed");
        toast.warning("OCR scan failed", {
          description:
            "Could not scan the receipt. Please enter the amount manually.",
          duration: 6000,
        });
      }
    },
    [],
  );

  function removeReceipt() {
    setReceiptFile(null);
    if (receiptPreview && !receiptPreview.startsWith("data:")) {
      URL.revokeObjectURL(receiptPreview);
    }
    setReceiptPreview(null);
    setReceiptDataUrl(null);
    setReceiptError("");
    setScanState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
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
        if (receiptDataUrl) {
          // Camera capture already has a data URL
          receiptUrl = receiptDataUrl;
          setUploadProgress(100);
        } else {
          // File upload — convert now
          const tick = setInterval(() => {
            setUploadProgress((p) => Math.min(p + 15, 85));
          }, 120);
          receiptUrl = await fileToDataURL(receiptFile);
          clearInterval(tick);
          setUploadProgress(100);
        }
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

  const isBusy =
    addExpense.isPending || isUploading || scanState === "scanning";

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
              {scanState === "done" && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ScanLine
                    className="w-3.5 h-3.5 text-primary"
                    aria-label="Amount filled from scan"
                  />
                </span>
              )}
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
                {/* Scan overlay while OCR is running */}
                {scanState === "scanning" && (
                  <div
                    className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2"
                    data-ocid="expense_form.scan.loading_state"
                  >
                    <div className="relative w-10 h-10">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                      <ScanLine className="w-5 h-5 text-primary absolute inset-0 m-auto" />
                    </div>
                    <p className="text-xs font-medium text-foreground">
                      Scanning receipt…
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Extracting amount with OCR
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeReceipt}
                  disabled={scanState === "scanning"}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card/90 border border-border shadow-subtle flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/40 transition-colors disabled:opacity-40"
                  aria-label="Remove receipt"
                  data-ocid="expense_form.receipt_remove_button"
                >
                  <X className="w-3 h-3 text-foreground" />
                </button>
                {receiptFile && scanState !== "scanning" && (
                  <div className="px-3 py-1.5 bg-muted/40 border-t border-border flex items-center gap-2">
                    <p className="text-[11px] text-muted-foreground truncate flex-1 min-w-0">
                      {receiptFile.name}
                    </p>
                    {scanState === "done" && (
                      <span className="flex items-center gap-1 text-[10px] text-primary font-medium shrink-0">
                        <ScanLine className="w-3 h-3" />
                        Scanned
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Upload / Scan area */
              <div className="space-y-2">
                {/* Primary: file upload (unchanged) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors px-4 py-4 flex flex-col items-center gap-2 group"
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

                {/* Secondary: scan with camera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors px-4 py-3 flex items-center justify-center gap-2.5 group"
                  data-ocid="expense_form.scan_receipt_button"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-primary leading-tight">
                      Scan Receipt
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Use camera to auto-fill amount
                    </p>
                  </div>
                  <ScanLine className="w-3.5 h-3.5 text-primary/60 ml-auto shrink-0" />
                </button>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              data-ocid="expense_form.receipt_file_input"
            />
            {/* Camera capture input — capture="environment" opens rear camera on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
              data-ocid="expense_form.camera_input"
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

            {/* Upload progress bar (file upload path) */}
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
                  {isUploading
                    ? "Uploading…"
                    : scanState === "scanning"
                      ? "Scanning…"
                      : "Saving…"}
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
