import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUpcomingBills } from "./useBudget";

const NOTIFICATIONS_KEY = "budgetwise-notifications-enabled";

export function getNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(NOTIFICATIONS_KEY) === "true";
}

export function setNotificationsEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFICATIONS_KEY, String(enabled));
}

export function getNotificationPermission():
  | NotificationPermission
  | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission !== "default") {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

/** Checks for unpaid bills due within 3 days and surfaces one reminder per app load. */
export function useBillReminders() {
  const { data: bills = [] } = useUpcomingBills(3);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (notifiedRef.current) return;
    if (!getNotificationsEnabled()) return;
    if (bills.length === 0) return;
    notifiedRef.current = true;

    const overdue = bills.filter((b) => b.daysUntilDue < 0).length;
    const dueSoon = bills.length - overdue;
    const title = overdue > 0 ? "You have overdue bills" : "Bills due soon";
    const parts: string[] = [];
    if (overdue > 0) parts.push(`${overdue} overdue`);
    if (dueSoon > 0) parts.push(`${dueSoon} due within 3 days`);
    const body = parts.join(", ");

    if (getNotificationPermission() === "granted") {
      new Notification(title, { body, icon: "/BudgetWise-Logo.png" });
    } else {
      toast.warning(title, { description: body, duration: 8000 });
    }
  }, [bills]);
}
