import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const CONFIRM_TEXT = "DELETE";

export function DeleteAccountDialog({ open, onOpenChange, onConfirm }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  function handleOpenChange(next: boolean) {
    if (!next) setConfirmText("");
    onOpenChange(next);
  }

  async function handleDelete() {
    setIsPending(true);
    await onConfirm();
    setIsPending(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md shadow-premium">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-lg font-bold text-foreground">
            Delete your account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This permanently deletes your account and every budget, expense,
            income, goal, and receipt tied to it. This cannot be undone — export
            a backup first if you want to keep a copy.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="delete-confirm" className="text-xs font-medium">
            Type {CONFIRM_TEXT} to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_TEXT}
            disabled={isPending}
            autoComplete="off"
          />
        </div>

        <AlertDialogFooter className="gap-2.5 mt-2">
          <AlertDialogCancel disabled={isPending} className="button-hover">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || confirmText !== CONFIRM_TEXT}
            className="button-hover shadow-elevated min-w-[140px]"
          >
            {isPending ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Deleting…
              </>
            ) : (
              "Delete my account"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
