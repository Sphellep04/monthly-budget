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
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useAddExpense } from "../hooks/useBudget";
import { supabase } from "../lib/supabaseClient";

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
  const { userId } = useAuth();
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

  /** Handle the camera capture input change - runs OCR automatically */
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

      // Run OCR
      try {
        const text = await runOCR(dataUrl);
        const amount = extractLargestAmount(text);
        if (amount) {
          setAmountStr(amount);
          setAmountError("");
          setScanState("done");
          toast.success(`Receipt scanned - amount detected: N$${amount}`, {
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
      if (!userId) {
        setReceiptError("You must be signed in to attach a receipt.");
        return;
      }
      setIsUploading(true);
      setUploadProgress(10);
      const tick = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 120);
      try {
        const path = `${userId}/${crypto.randomUUID()}-${receiptFile.name}`;
        const { error } = await supabase.storage
          .from("receipts")
          .upload(path, receiptFile, { contentType: receiptFile.type });
        if (error) throw error;
        receiptUrl = path;
        setUploadProgress(100);
      } catch {
        clearInterval(tick);
        setIsUploading(false);
        setReceiptError("Failed to upload receipt image. Please try again.");
        return;
      } finally {
        clearInterval(tick);
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
      <DialogContent className="sm:max-w-md bg-card border-border shadow-premium">
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
            <FieldLabel htmlFor="expense-date">Date</FieldLabel>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input-focus h-10 font-mono text-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <FieldLabel htmlFor="expense-amount">Amount</FieldLabel>
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
                aria-invalid={!!amountError}
                aria-describedby={
                  amountError ? "expense-amount-error" : undefined
                }
              />
            </div>
            {amountError && (
              <p
                id="expense-amount-error"
                className="text-xs text-destructive mt-1"
              >
                {amountError}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <FieldLabel htmlFor="expense-notes">
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
            />
          </div>

          {/* Receipt */}
          <div>
            <FieldLabel>
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
                  <div className="absolute inset-0 bg-background/85 flex flex-col items-center justify-center gap-2">
                    <Spinner className="w-8 h-8 text-primary" />
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
                  className="absolute top-2 right-2 h-6 px-2 rounded-full bg-card/90 border border-border shadow-subtle flex items-center justify-center text-[10px] font-medium text-foreground hover:bg-destructive/10 hover:border-destructive/40 transition-colors disabled:opacity-40"
                  aria-label="Remove receipt"
                >
                  Remove
                </button>
                {receiptFile && scanState !== "scanning" && (
                  <div className="px-3 py-1.5 bg-muted/40 border-t border-border flex items-center gap-2">
                    <p className="text-[11px] text-muted-foreground truncate flex-1 min-w-0">
                      {receiptFile.name}
                    </p>
                    {scanState === "done" && (
                      <span className="text-[10px] text-primary font-medium shrink-0">
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
                  className="w-full rounded-xl border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors px-4 py-4 flex flex-col items-center gap-1.5 group"
                >
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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
                  className="w-full rounded-xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors px-4 py-3 flex items-center justify-center group"
                >
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary leading-tight">
                      Scan Receipt
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      Use camera to auto-fill amount
                    </p>
                  </div>
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
            />
            {/* Camera capture input - capture="environment" opens rear camera on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
            />

            {receiptError && (
              <p role="alert" className="text-xs text-destructive mt-1">
                {receiptError}
              </p>
            )}

            {/* Upload progress bar (file upload path) */}
            {isUploading && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Spinner className="w-3 h-3" />
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
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-hover shadow-elevated"
              disabled={isBusy}
            >
              {isBusy ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
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
