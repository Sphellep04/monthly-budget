import type { BudgetSummary, UpcomingBill } from "../types";
import { formatCents, getBudgetStatus } from "../types";
import type { Insight } from "./insights";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  severity: "danger" | "warning" | "info";
}

export interface NotificationInput {
  budgetSummaries: BudgetSummary[];
  alertThreshold: number;
  bills: UpcomingBill[];
  topInsight: Insight | null;
}

/**
 * Builds a flat notification feed from data the app already fetches -
 * over/near-limit budgets, bills coming due, and the current top spending
 * insight - so there's one place to check instead of hunting across pages.
 */
export function computeNotifications(
  input: NotificationInput,
): NotificationItem[] {
  const { budgetSummaries, alertThreshold, bills, topInsight } = input;
  const items: NotificationItem[] = [];

  for (const s of budgetSummaries) {
    const status = getBudgetStatus(s, alertThreshold);
    if (status !== "over-budget" && status !== "warning") continue;
    const effectiveLimitCents = s.budget.limitCents + s.rolloverCents;
    items.push({
      id: `budget-${status === "over-budget" ? "over" : "warning"}-${s.budget.id}`,
      title:
        status === "over-budget"
          ? `${s.budget.name} is over budget`
          : `${s.budget.name} is close to its limit`,
      body: `${formatCents(s.totalSpentCents)} of ${formatCents(effectiveLimitCents)} spent.`,
      severity: status === "over-budget" ? "danger" : "warning",
    });
  }

  for (const b of bills) {
    const overdue = b.daysUntilDue < 0;
    const days = Math.abs(b.daysUntilDue);
    items.push({
      id: `bill-${b.id}`,
      title: overdue ? `${b.name} is overdue` : `${b.name} is due soon`,
      body: overdue
        ? `Was due ${days} day${days === 1 ? "" : "s"} ago - ${formatCents(b.amountCents)}.`
        : `Due in ${days} day${days === 1 ? "" : "s"} - ${formatCents(b.amountCents)}.`,
      severity: overdue ? "danger" : "warning",
    });
  }

  if (topInsight) {
    items.push({
      id: `insight-${topInsight.id}`,
      title: topInsight.title,
      body: topInsight.subtext,
      severity: "info",
    });
  }

  return items;
}
