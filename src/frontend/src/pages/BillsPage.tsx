import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MonthSelector } from "../components/MonthSelector";
import {
  useCreateBillPayment,
  useListBillPayments,
  useListBudgets,
  useRecurringTemplates,
  useUpdateBillPayment,
} from "../hooks/useBudget";
import type { BillPayment, BillStatus, RecurringTemplate } from "../types";
import { formatCents, getMonthName } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillItem {
  template: RecurringTemplate;
  payment: BillPayment | undefined;
  status: BillStatus;
  budgetName: string;
  budgetCategory: string;
}

type FilterTab = "all" | "due-soon" | "overdue" | "paid";

// ─── Status helpers ───────────────────────────────────────────────────────────

function getBillStatus(
  dueDay: number,
  payment: BillPayment | undefined,
  year: number,
  month: number,
): BillStatus {
  if (payment?.paidDate != null) return "paid";
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Past month - no payment = overdue
  if (year < todayYear || (year === todayYear && month < todayMonth))
    return "overdue";
  // Future month - upcoming
  if (year > todayYear || (year === todayYear && month > todayMonth))
    return "upcoming";

  // Current month
  if (dueDay < todayDay) return "overdue";
  if (dueDay <= todayDay + 7) return "due-soon";
  return "upcoming";
}

const STATUS_CONFIG: Record<BillStatus, { label: string; badgeClass: string }> =
  {
    paid: {
      label: "Paid",
      badgeClass:
        "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    },
    "due-soon": {
      label: "Due Soon",
      badgeClass:
        "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
    },
    overdue: {
      label: "Overdue",
      badgeClass: "bg-destructive/15 text-destructive border-destructive/25",
    },
    upcoming: {
      label: "Upcoming",
      badgeClass: "bg-primary/10 text-primary border-primary/20",
    },
  };

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportBillsCSV(bills: BillItem[], year: number, month: number) {
  const rows = [
    [
      "Name",
      "Category",
      "Amount (N$)",
      "Due Day",
      "Status",
      "Paid Date",
      "Paid Amount (N$)",
    ],
    ...bills.map((b) => {
      const paidDate = b.payment?.paidDate
        ? new Date(Number(b.payment.paidDate) / 1_000_000).toLocaleDateString(
            "en-ZA",
          )
        : "";
      const paidAmt =
        b.payment?.paidAmountCents != null
          ? (Number(b.payment.paidAmountCents) / 100).toFixed(2)
          : "";
      return [
        b.template.name,
        b.budgetCategory,
        (Number(b.template.amountCents) / 100).toFixed(2),
        String(Number(b.template.dayOfMonth)),
        STATUS_CONFIG[b.status].label,
        paidDate,
        paidAmt,
      ];
    }),
  ];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bills-${getMonthName(month)}-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Mark as Paid Dialog ──────────────────────────────────────────────────────

interface MarkPaidDialogProps {
  bill: BillItem | null;
  year: number;
  month: number;
  onClose: () => void;
}

function MarkPaidDialog({ bill, year, month, onClose }: MarkPaidDialogProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [paidDate, setPaidDate] = useState(today);
  const [paidAmount, setPaidAmount] = useState(
    bill ? String(Number(bill.template.amountCents) / 100) : "",
  );
  const createBill = useCreateBillPayment();
  const updateBill = useUpdateBillPayment();

  const isPending = createBill.isPending || updateBill.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bill) return;

    const paidTs = BigInt(new Date(paidDate).getTime()) * BigInt(1_000_000);
    const paidCents = BigInt(Math.round(Number.parseFloat(paidAmount) * 100));

    const input = {
      recurringTemplateId: String(bill.template.id),
      year: BigInt(year),
      month: BigInt(month),
      dueDay: bill.template.dayOfMonth,
      paidDate: paidTs,
      paidAmountCents: paidCents,
      notes: bill.template.notes,
    };

    try {
      if (bill.payment) {
        await updateBill.mutateAsync({ id: bill.payment.id, input });
      } else {
        await createBill.mutateAsync(input);
      }
      toast.success(`${bill.template.name} marked as paid`);
      onClose();
    } catch {
      toast.error("Failed to save payment. Please try again.");
    }
  }

  return (
    <Dialog open={!!bill} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            Mark as Paid - {bill?.template.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="paid-date" className="text-xs font-medium">
              Payment Date
            </Label>
            <Input
              id="paid-date"
              type="date"
              value={paidDate}
              max={today}
              onChange={(e) => setPaidDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="paid-amount" className="text-xs font-medium">
              Amount Paid (N$)
            </Label>
            <Input
              id="paid-amount"
              type="number"
              step="0.01"
              min="0"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Saving…" : "Confirm Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Bill Card ────────────────────────────────────────────────────────────────

interface BillCardProps {
  bill: BillItem;
  onMarkPaid: (bill: BillItem) => void;
}

function BillCard({ bill, onMarkPaid }: BillCardProps) {
  const { template, payment, status } = bill;
  const cfg = STATUS_CONFIG[status];
  const isPaid = status === "paid";

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-4 shadow-subtle hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-semibold text-sm text-foreground truncate font-display">
              {template.name}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold py-0 px-1.5 h-5 ${cfg.badgeClass}`}
            >
              {cfg.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>{bill.budgetName}</span>
            <span className="text-border">·</span>
            <span>Due day {Number(template.dayOfMonth)}</span>
            {isPaid && payment?.paidDate && (
              <>
                <span className="text-border">·</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Paid{" "}
                  {new Date(
                    Number(payment.paidDate) / 1_000_000,
                  ).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="font-bold text-sm text-foreground font-display tabular-nums">
            {formatCents(template.amountCents)}
          </span>
          {!isPaid ? (
            <Button
              size="sm"
              variant={status === "overdue" ? "destructive" : "default"}
              className="h-7 text-xs px-3 rounded-lg"
              onClick={() => onMarkPaid(bill)}
            >
              Mark Paid
            </Button>
          ) : payment?.paidAmountCents != null &&
            payment.paidAmountCents !== template.amountCents ? (
            <span className="text-[10px] text-muted-foreground tabular-nums">
              Paid {formatCents(payment.paidAmountCents)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Hooks for all templates (across all budgets) ─────────────────────────────

function useAllRecurringTemplates(year: number, month: number) {
  const { data: budgets = [], isLoading: budgetsLoading } = useListBudgets(
    year,
    month,
  );
  // We need to call hooks for each budget - but hooks can't be conditional.
  // Strategy: fetch budgets first, then fetch all templates in one combined hook.
  // Since we don't know how many budgets there are, we fetch in sequence via effect.
  // For simplicity: fetch up to 20 budgets' templates using a stable list.
  return { budgets, isLoading: budgetsLoading };
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function BillsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [markPaidBill, setMarkPaidBill] = useState<BillItem | null>(null);

  const { budgets, isLoading: budgetsLoading } = useAllRecurringTemplates(
    year,
    month,
  );
  const { data: payments = [], isLoading: paymentsLoading } =
    useListBillPayments(year, month);

  // We render a sub-component that does the multi-budget template fetch
  const [allTemplates, setAllTemplates] = useState<
    {
      template: RecurringTemplate;
      budgetName: string;
      budgetCategory: string;
    }[]
  >([]);

  const isLoading = budgetsLoading || paymentsLoading;

  const bills = useMemo<BillItem[]>(() => {
    return allTemplates
      .map(({ template, budgetName, budgetCategory }) => {
        const payment = payments.find(
          (p) => p.recurringTemplateId === String(template.id),
        );
        const status = getBillStatus(
          Number(template.dayOfMonth),
          payment,
          year,
          month,
        );
        return { template, payment, status, budgetName, budgetCategory };
      })
      .sort((a, b) => {
        const order: Record<BillStatus, number> = {
          overdue: 0,
          "due-soon": 1,
          upcoming: 2,
          paid: 3,
        };
        return order[a.status] - order[b.status];
      });
  }, [allTemplates, payments, year, month]);

  const filteredBills = useMemo(() => {
    if (activeFilter === "all") return bills;
    return bills.filter((b) => b.status === activeFilter);
  }, [bills, activeFilter]);

  const counts = useMemo(
    () => ({
      all: bills.length,
      "due-soon": bills.filter((b) => b.status === "due-soon").length,
      overdue: bills.filter((b) => b.status === "overdue").length,
      paid: bills.filter((b) => b.status === "paid").length,
    }),
    [bills],
  );

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "due-soon", label: "Due Soon", count: counts["due-soon"] },
    { key: "overdue", label: "Overdue", count: counts.overdue },
    { key: "paid", label: "Paid", count: counts.paid },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            Bill Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track upcoming and recurring bills from your budget templates
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <MonthSelector
            year={year}
            month={month}
            onChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
          {bills.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl text-xs"
              onClick={() => exportBillsCSV(bills, year, month)}
            >
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Multi-budget template loader (renders hidden components that populate state) */}
      {budgets.map((budget) => (
        <BudgetTemplateLoader
          key={budget.id.toString()}
          budgetId={budget.id}
          budgetName={budget.name}
          budgetCategory={budget.category}
          onTemplatesLoaded={(items) => {
            setAllTemplates((prev) => {
              const withoutThis = prev.filter(
                (t) =>
                  t.budgetName !== budget.name ||
                  !items.some((i) => i.template.id === t.template.id),
              );
              return [...withoutThis, ...items];
            });
          }}
        />
      ))}

      {/* Filter tabs */}
      {!isLoading && budgets.length > 0 && (
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border w-fit">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                activeFilter === tab.key
                  ? "bg-card text-foreground shadow-subtle"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0 rounded-full leading-5 ${
                    activeFilter === tab.key
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((k) => (
            <Skeleton key={k} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyStateNoTemplates />
      ) : filteredBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <p className="text-sm font-semibold text-foreground mb-1">
            No bills match this filter
          </p>
          <p className="text-xs text-muted-foreground">
            Try switching to "All" to see everything.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 text-xs"
            onClick={() => setActiveFilter("all")}
          >
            Clear filter
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.template.id.toString()}
              bill={bill}
              onMarkPaid={(b) => setMarkPaidBill(b)}
            />
          ))}
        </div>
      )}

      {/* Summary footer */}
      {bills.length > 0 && !isLoading && <BillsSummary bills={bills} />}

      <MarkPaidDialog
        bill={markPaidBill}
        year={year}
        month={month}
        onClose={() => setMarkPaidBill(null)}
      />
    </div>
  );
}

// ─── Budget Template Loader ───────────────────────────────────────────────────

interface BudgetTemplateLoaderProps {
  budgetId: bigint;
  budgetName: string;
  budgetCategory: string;
  onTemplatesLoaded: (
    items: {
      template: RecurringTemplate;
      budgetName: string;
      budgetCategory: string;
    }[],
  ) => void;
}

function BudgetTemplateLoader({
  budgetId,
  budgetName,
  budgetCategory,
  onTemplatesLoaded,
}: BudgetTemplateLoaderProps) {
  const { data: templates = [] } = useRecurringTemplates(budgetId);
  const onTemplatesLoadedRef = useRef(onTemplatesLoaded);
  onTemplatesLoadedRef.current = onTemplatesLoaded;

  useEffect(() => {
    if (templates.length > 0) {
      onTemplatesLoadedRef.current(
        templates.map((t) => ({ template: t, budgetName, budgetCategory })),
      );
    }
  }, [templates, budgetName, budgetCategory]);

  return null;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyStateNoTemplates() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl border border-dashed border-border bg-card/40 shadow-subtle">
      <h3 className="font-display font-bold text-lg text-foreground mb-2 tracking-tight">
        No recurring templates yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-7 leading-relaxed">
        Bill reminders are derived from your recurring expense templates. Add a
        recurring template in a budget to start tracking bills here.
      </p>
      <Link to="/budgets">
        <Button className="rounded-xl h-10 shadow-elevated">
          Go to Budgets
        </Button>
      </Link>
    </div>
  );
}

// ─── Summary Footer ───────────────────────────────────────────────────────────

function BillsSummary({ bills }: { bills: BillItem[] }) {
  const totalDue = bills
    .filter((b) => b.status !== "paid")
    .reduce((s, b) => s + Number(b.template.amountCents), 0);
  const totalPaid = bills
    .filter((b) => b.status === "paid")
    .reduce(
      (s, b) =>
        s + Number(b.payment?.paidAmountCents ?? b.template.amountCents),
      0,
    );
  const overdue = bills.filter((b) => b.status === "overdue").length;

  return (
    <div className="grid grid-cols-3 gap-3 pt-1">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-subtle text-center">
        <p className="text-xs text-muted-foreground mb-1">Still Due</p>
        <p className="font-bold text-base font-display tabular-nums text-foreground">
          {formatCents(totalDue)}
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 shadow-subtle text-center">
        <p className="text-xs text-muted-foreground mb-1">Paid This Month</p>
        <p className="font-bold text-base font-display tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatCents(totalPaid)}
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 shadow-subtle text-center">
        <p className="text-xs text-muted-foreground mb-1">Overdue</p>
        <p
          className={`font-bold text-base font-display tabular-nums ${overdue > 0 ? "text-destructive" : "text-foreground"}`}
        >
          {overdue}
        </p>
      </div>
    </div>
  );
}
