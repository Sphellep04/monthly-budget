export interface DailyPace {
  daysLeft: number;
  perDayCents: number;
}

/**
 * How much is safe to spend per remaining day this month, so the budget
 * lasts to month-end. Only meaningful for the month actually in progress -
 * a past or future month has no "days left" to pace against, so this
 * returns null for anything but the real current month.
 */
export function computeDailyPace(
  year: number,
  month: number,
  remainingCents: number,
  today: Date = new Date(),
): DailyPace | null {
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  if (!isCurrentMonth) return null;

  const daysInMonth = new Date(year, month, 0).getDate();
  // Inclusive of today: "18 days left" means today plus 17 more.
  const daysLeft = daysInMonth - today.getDate() + 1;
  const perDayCents = Math.max(remainingCents, 0) / daysLeft;

  return { daysLeft, perDayCents };
}
