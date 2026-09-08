import { useState } from "react";
import { computeTrendingCategory } from "../lib/insights";
import { shiftMonth } from "../lib/monthMath";
import {
  type NotificationItem,
  computeNotifications,
} from "../lib/notifications";
import {
  useCategoryBreakdown,
  useMonthlySummary,
  useUpcomingBills,
  useUserSettings,
} from "./useBudget";

const DISMISSED_KEY = "budgetwise-dismissed-notifications";

function readDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeDismissed(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
  } catch {
    // Storage unavailable (private browsing, quota) - dismissals just won't persist.
  }
}

/**
 * Client-computed notification inbox: over/near-limit budgets, bills due
 * soon, and the current top insight, all for the current calendar month.
 * Dismissals persist in localStorage per-device rather than a new table,
 * matching how bill reminders already track their own opt-in state.
 */
export function useNotifications() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { year: prevY, month: prevM } = shiftMonth(year, month, -1);

  const { data: settings } = useUserSettings();
  const { data: summary } = useMonthlySummary(year, month);
  const { data: bills = [] } = useUpcomingBills(7);
  const current = useCategoryBreakdown(year, month);
  const prev = useCategoryBreakdown(prevY, prevM);

  const [dismissed, setDismissed] = useState<Set<string>>(readDismissed);

  const topInsight =
    current.data && prev.data
      ? computeTrendingCategory(current.data, prev.data)
      : null;

  const all: NotificationItem[] = computeNotifications({
    budgetSummaries: summary?.budgets ?? [],
    alertThreshold: settings?.alertThresholdPercent ?? 80,
    bills,
    topInsight,
  });

  const notifications = all.filter((n) => !dismissed.has(n.id));

  function dismiss(id: string) {
    setDismissed((prevSet) => {
      const next = new Set(prevSet);
      next.add(id);
      writeDismissed(next);
      return next;
    });
  }

  function dismissAll() {
    setDismissed((prevSet) => {
      const next = new Set(prevSet);
      for (const n of all) next.add(n.id);
      writeDismissed(next);
      return next;
    });
  }

  return { notifications, dismiss, dismissAll };
}
