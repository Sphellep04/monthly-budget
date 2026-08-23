import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { QueryErrorState } from "../components/QueryErrorState";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "../hooks/useBudget";
import type { Account, AccountType } from "../types";
import {
  ACCOUNT_TYPE_LABELS,
  formatCents,
  isLiabilityAccountType,
} from "../types";

const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];

// ─── Account Dialog (create + edit) ────────────────────────────────────────────

function AccountDialog({
  account,
  open,
  onOpenChange,
}: {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEditing = account !== null;
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const isPending = createAccount.isPending || updateAccount.isPending;

  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState<AccountType>(account?.type ?? "checking");
  const [balanceStr, setBalanceStr] = useState(
    account ? (Number(account.balanceCents) / 100).toFixed(2) : "",
  );
  const [error, setError] = useState("");

  function reset() {
    setName(account?.name ?? "");
    setType(account?.type ?? "checking");
    setBalanceStr(
      account ? (Number(account.balanceCents) / 100).toFixed(2) : "",
    );
    setError("");
  }

  function handleClose(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please give the account a name.");
      return;
    }
    const balance = Number.parseFloat(balanceStr);
    if (!balanceStr || !Number.isFinite(balance) || balance < 0) {
      setError("Enter a balance of N$0.00 or more.");
      return;
    }
    setError("");

    const input = {
      name: name.trim(),
      type,
      balanceCents: BigInt(Math.round(balance * 100)),
    };

    try {
      if (isEditing) {
        await updateAccount.mutateAsync({ id: account.id, input });
        toast.success("Account updated");
      } else {
        await createAccount.mutateAsync(input);
        toast.success("Account added");
      }
      handleClose(false);
    } catch {
      toast.error(
        isEditing ? "Failed to update account" : "Failed to add account",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md shadow-premium">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing ? "Edit Account" : "Add Account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <Label
              htmlFor="account-name"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              Account Name
            </Label>
            <Input
              id="account-name"
              placeholder="e.g. Everyday Checking"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="input-focus h-10 text-sm"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as AccountType)}
            >
              <SelectTrigger className="input-focus h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ACCOUNT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="account-balance"
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block"
            >
              {isLiabilityAccountType(type) ? "Amount Owed" : "Balance"}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm select-none pointer-events-none">
                N$
              </span>
              <Input
                id="account-balance"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={balanceStr}
                onChange={(e) => setBalanceStr(e.target.value)}
                className="pl-9 input-focus h-10 font-mono text-sm"
              />
            </div>
            {isLiabilityAccountType(type) && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Enter what you owe as a positive number - it's subtracted from
                net worth automatically.
              </p>
            )}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 button-hover"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 button-hover shadow-elevated"
              disabled={isPending}
            >
              {isPending
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Account Row ────────────────────────────────────────────────────────────

function AccountRow({
  account,
  onEdit,
  onDelete,
}: {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}) {
  const isLiability = isLiabilityAccountType(account.type);

  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card card-hover hover:border-primary/20 hover:shadow-elevated">
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-foreground truncate text-sm leading-tight">
          {account.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {ACCOUNT_TYPE_LABELS[account.type]}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className={`font-mono text-sm font-bold tabular-nums ${
            isLiability ? "text-destructive" : "text-foreground"
          }`}
        >
          {isLiability ? "-" : ""}
          {formatCents(account.balanceCents)}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
          {isLiability ? "owed" : "balance"}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-smooth text-muted-foreground hover:text-primary"
          onClick={() => onEdit(account)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-smooth text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(account)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AccountsPage() {
  const { data: accounts = [], isLoading, isError, refetch } = useAccounts();
  const deleteAccount = useDeleteAccount();

  const [dialogAccount, setDialogAccount] = useState<Account | null | "new">(
    null,
  );
  const [deleting, setDeleting] = useState<Account | null>(null);

  const assetsCents = accounts
    .filter((a) => !isLiabilityAccountType(a.type))
    .reduce((sum, a) => sum + a.balanceCents, 0n);
  const liabilitiesCents = accounts
    .filter((a) => isLiabilityAccountType(a.type))
    .reduce((sum, a) => sum + a.balanceCents, 0n);
  const netWorthCents = assetsCents - liabilitiesCents;

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteAccount.mutateAsync(deleting.id);
      toast.success("Account deleted");
      setDeleting(null);
    } catch {
      toast.error("Failed to delete account");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto page-enter">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track balances across accounts and see your net worth.
          </p>
        </div>
        <Button
          className="h-9 rounded-xl text-xs shadow-elevated"
          onClick={() => setDialogAccount("new")}
        >
          Add Account
        </Button>
      </div>

      {!isLoading && !isError && accounts.length > 0 && (
        <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-inner-subtle">
          <div className="bg-card px-4 py-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">
              Assets
            </p>
            <p className="font-mono text-lg font-bold tabular-nums text-primary">
              {formatCents(assetsCents)}
            </p>
          </div>
          <div className="bg-card px-4 py-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">
              Liabilities
            </p>
            <p className="font-mono text-lg font-bold tabular-nums text-destructive">
              {formatCents(liabilitiesCents)}
            </p>
          </div>
          <div className="bg-card px-4 py-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">
              Net Worth
            </p>
            <p
              className={`font-mono text-lg font-bold tabular-nums ${
                netWorthCents < 0n ? "text-destructive" : "text-foreground"
              }`}
            >
              {netWorthCents < 0n ? "-" : ""}
              {formatCents(netWorthCents < 0n ? -netWorthCents : netWorthCents)}
            </p>
          </div>
        </div>
      )}

      {isError ? (
        <QueryErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
          <h3 className="font-display font-bold text-lg text-foreground mb-2 tracking-tight">
            No accounts yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-7 leading-relaxed">
            Add your checking, savings, credit card, and other accounts to track
            balances and net worth in one place.
          </p>
          <Button
            className="rounded-xl h-10 shadow-elevated"
            onClick={() => setDialogAccount("new")}
          >
            Add Account
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {accounts.map((account) => (
            <AccountRow
              key={account.id.toString()}
              account={account}
              onEdit={setDialogAccount}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <AccountDialog
        account={dialogAccount === "new" ? null : dialogAccount}
        open={dialogAccount !== null}
        onOpenChange={(v) => !v && setDialogAccount(null)}
      />

      <DeleteConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete this account?"
        description={`This will permanently remove "${deleting?.name}" from your accounts.`}
        onConfirm={handleDelete}
        isPending={deleteAccount.isPending}
      />
    </div>
  );
}
