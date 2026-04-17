import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, Receipt, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  useGetExpensesInRange,
  useMonthlySummary,
  useSearchExpenses,
} from "../hooks/useBudget";
import { CATEGORY_ICONS, formatCents } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  query: string;
  categoryId: string; // budget id as string, "" = all
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

const DEFAULT_FILTERS: FilterState = {
  query: "",
  categoryId: "",
  startDate: daysAgoISO(30),
  endDate: todayISO(),
  minAmount: "",
  maxAmount: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SearchPage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const { data: monthSummary } = useMonthlySummary(
    now.getFullYear(),
    now.getMonth() + 1,
  );
  const allBudgets = useMemo(
    () => monthSummary?.budgets.map((b) => b.budget) ?? [],
    [monthSummary],
  );

  // Build search params — only search once user has interacted or use default date range
  const searchParams = useMemo(() => {
    const minAmt =
      filters.minAmount !== ""
        ? Number.parseFloat(filters.minAmount)
        : undefined;
    const maxAmt =
      filters.maxAmount !== ""
        ? Number.parseFloat(filters.maxAmount)
        : undefined;
    const catId =
      filters.categoryId !== "" ? BigInt(filters.categoryId) : undefined;
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      query: filters.query.trim() || undefined,
      categoryId: catId,
      minAmountCents: minAmt,
      maxAmountCents: maxAmt,
    };
  }, [filters]);

  const hasActiveFilters =
    filters.query !== "" ||
    filters.categoryId !== "" ||
    filters.startDate !== DEFAULT_FILTERS.startDate ||
    filters.endDate !== DEFAULT_FILTERS.endDate ||
    filters.minAmount !== "" ||
    filters.maxAmount !== "";

  // Use searchExpenses when any filter is active, else getExpensesInRange for default 30-day view
  const shouldSearch = hasActiveFilters || submitted;
  const { data: searchResults, isLoading: searchLoading } = useSearchExpenses(
    shouldSearch ? searchParams : null,
  );
  const { data: defaultResults, isLoading: defaultLoading } =
    useGetExpensesInRange(
      DEFAULT_FILTERS.startDate,
      DEFAULT_FILTERS.endDate,
      !shouldSearch,
    );

  const results = shouldSearch ? (searchResults ?? []) : (defaultResults ?? []);
  const isLoading = shouldSearch ? searchLoading : defaultLoading;

  // Build budget lookup map
  const budgetMap = useMemo(() => {
    const map: Record<
      string,
      { name: string; category: string; color: string }
    > = {};
    for (const b of allBudgets) {
      map[b.id.toString()] = {
        name: b.name,
        category: b.category,
        color: b.color,
      };
    }
    return map;
  }, [allBudgets]);

  const totalCents = useMemo(
    () => results.reduce((sum, e) => sum + Number(e.amountCents), 0),
    [results],
  );

  const set = useCallback(
    <K extends keyof FilterState>(key: K, val: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: val }));
      setSubmitted(true);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSubmitted(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card border-b border-border px-6 py-5 shadow-subtle">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 text-primary">
            <Search size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              Search Expenses
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filter by name, category, date range, or amount
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Filter panel */}
        <div
          className="bg-card border border-border rounded-xl shadow-subtle p-5 space-y-4"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter size={14} />
              Filters
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
              >
                <X size={12} />
                Clear all
              </Button>
            )}
          </div>

          {/* Text search */}
          <div className="space-y-1.5">
            <Label
              htmlFor="search-query"
              className="text-xs text-muted-foreground font-medium"
            >
              Keyword
            </Label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
              />
              <Input
                id="search-query"
                placeholder="Search by notes or description…"
                value={filters.query}
                onChange={(e) => set("query", e.target.value)}
                className="pl-8 h-9 text-sm bg-background border-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category filter */}
            <div className="space-y-1.5">
              <Label
                htmlFor="search-category"
                className="text-xs text-muted-foreground font-medium"
              >
                Category
              </Label>
              <select
                id="search-category"
                value={filters.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 text-foreground"
              >
                <option value="">All categories</option>
                {allBudgets.map((b) => (
                  <option key={b.id.toString()} value={b.id.toString()}>
                    {CATEGORY_ICONS[b.category] ?? "📦"} {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="search-start"
                className="text-xs text-muted-foreground font-medium"
              >
                From date
              </Label>
              <Input
                id="search-start"
                type="date"
                value={filters.startDate}
                max={filters.endDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="h-9 text-sm bg-background border-input"
              />
            </div>

            {/* End date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="search-end"
                className="text-xs text-muted-foreground font-medium"
              >
                To date
              </Label>
              <Input
                id="search-end"
                type="date"
                value={filters.endDate}
                min={filters.startDate}
                max={todayISO()}
                onChange={(e) => set("endDate", e.target.value)}
                className="h-9 text-sm bg-background border-input"
              />
            </div>

            {/* Amount range */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">
                Amount (N$)
              </Label>
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Min"
                  type="number"
                  min={0}
                  value={filters.minAmount}
                  onChange={(e) => set("minAmount", e.target.value)}
                  className="h-9 text-sm bg-background border-input w-full"
                />
                <span className="text-muted-foreground/60 text-xs flex-shrink-0">
                  –
                </span>
                <Input
                  placeholder="Max"
                  type="number"
                  min={0}
                  value={filters.maxAmount}
                  onChange={(e) => set("maxAmount", e.target.value)}
                  className="h-9 text-sm bg-background border-input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        {!isLoading && results.length > 0 && (
          <div
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-4 shadow-subtle">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Results
              </p>
              <p className="text-2xl font-display font-bold text-foreground">
                {results.length}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                expenses found
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-subtle">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                Total Spent
              </p>
              <p className="text-2xl font-display font-bold text-primary">
                {formatCents(totalCents)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                across all results
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        <div
          className="bg-card border border-border rounded-xl shadow-subtle overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              {hasActiveFilters || submitted
                ? "Search Results"
                : "Last 30 Days"}
            </span>
            {!isLoading && (
              <span className="text-xs text-muted-foreground">
                {results.length} expense{results.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-2xl">
                🔍
              </div>
              <h3 className="font-semibold text-base text-foreground mb-1">
                No expenses found
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your filters — change the date range, clear the keyword, or select a different category."
                  : "No expenses were recorded in the last 30 days. Start adding expenses to your budgets!"}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4 gap-2"
                >
                  <X size={13} />
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground w-28">
                      Date
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Notes
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right w-28">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground w-16 text-center">
                      Receipt
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((expense, idx) => {
                    const budget = budgetMap[expense.budgetId.toString()];
                    const icon = budget
                      ? (CATEGORY_ICONS[budget.category] ?? "📦")
                      : "📦";
                    return (
                      <TableRow
                        key={expense.id.toString()}
                        className="hover:bg-muted/30 transition-colors duration-150"
                      >
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {formatDate(expense.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base leading-none flex-shrink-0">
                              {icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {budget?.name ?? "Unknown"}
                              </p>
                              {budget && (
                                <p className="text-xs text-muted-foreground/70 truncate">
                                  {budget.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          {expense.notes ? (
                            <p
                              className="text-sm text-foreground/80 truncate"
                              title={expense.notes}
                            >
                              {expense.notes}
                            </p>
                          ) : (
                            <span className="text-xs text-muted-foreground/40 italic">
                              No notes
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-mono font-semibold text-sm text-foreground">
                            {formatCents(expense.amountCents)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {expense.receiptUrl ? (
                            <a
                              href={expense.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Badge
                                variant="secondary"
                                className="text-[10px] gap-1 px-1.5 py-0.5 cursor-pointer hover:bg-primary/10 transition-colors"
                              >
                                <Receipt size={9} />
                                View
                              </Badge>
                            </a>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">
                              —
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
