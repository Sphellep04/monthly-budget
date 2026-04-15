import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getMonthName } from "../types";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const now = new Date();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  function goBack() {
    setDirection("left");
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
    setTimeout(() => setDirection(null), 300);
  }

  function goForward() {
    if (isCurrentMonth) return;
    setDirection("right");
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
    setTimeout(() => setDirection(null), 300);
  }

  const labelAnim =
    direction === "left"
      ? "animate-[slide-up_0.22s_ease_both]"
      : direction === "right"
        ? "animate-[slide-up_0.22s_ease_both]"
        : "";

  return (
    <div
      className="flex items-center gap-0.5 bg-card border border-border rounded-xl px-1 py-1 shadow-subtle"
      data-ocid="month-selector"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-muted transition-spring active:scale-95"
        onClick={goBack}
        data-ocid="month-selector.prev"
        aria-label="Previous month"
      >
        <ChevronLeft size={15} className="text-muted-foreground" />
      </Button>

      <div
        className="flex items-center gap-2 px-3 min-w-[156px] justify-center overflow-hidden"
        data-ocid="month-selector.label"
      >
        <div className={`flex items-center gap-2 ${labelAnim}`}>
          <div className="flex flex-col items-center leading-none">
            <span className="text-sm font-semibold text-foreground font-display tracking-tight">
              {getMonthName(month)}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tabular-nums mt-0.5">
              {year}
            </span>
          </div>
          {isCurrentMonth && (
            <span className="text-[9px] font-bold bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 leading-none uppercase tracking-wide shadow-subtle">
              Now
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-muted transition-spring active:scale-95 disabled:opacity-30"
        onClick={goForward}
        disabled={isCurrentMonth}
        data-ocid="month-selector.next"
        aria-label="Next month"
      >
        <ChevronRight size={15} className="text-muted-foreground" />
      </Button>
    </div>
  );
}
