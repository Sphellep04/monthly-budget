import { useMonthlySummary, useUserSettings } from "../hooks/useBudget";
import { formatCents } from "../types";

/**
 * Shows whether this month is still protecting the user's savings floor - a
 * standing minimum set in Settings, distinct from a Savings Goal. Renders
 * nothing until a floor is configured.
 */
export function SavingsFloorCard({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const { data: settings } = useUserSettings();
  const { data: summary } = useMonthlySummary(year, month);

  if (!settings || settings.savingsFloorCents <= 0n || !summary) return null;

  const netSavingsCents = summary.totalIncomeCents - summary.totalSpentCents;
  const met = netSavingsCents >= settings.savingsFloorCents;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-subtle">
      <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.14em] mb-1">
        Floor this month
      </p>
      <p className="font-display text-2xl font-bold tabular-nums leading-none text-foreground">
        {formatCents(settings.savingsFloorCents)}
      </p>
      <p
        className={`text-[11px] mt-1 font-semibold ${met ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
      >
        {met ? "Met" : "Not met"}
      </p>
    </div>
  );
}
