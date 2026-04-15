import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

  function goBack() {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  }

  function goForward() {
    if (isCurrentMonth) return;
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  }

  return (
    <div
      className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-1 py-1"
      data-ocid="month-selector"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-muted transition-smooth"
        onClick={goBack}
        data-ocid="month-selector.prev"
        aria-label="Previous month"
      >
        <ChevronLeft size={14} />
      </Button>

      <div
        className="flex items-center gap-1.5 px-2 min-w-[140px] justify-center"
        data-ocid="month-selector.label"
      >
        <Calendar size={13} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground font-body">
          {getMonthName(month)} {year}
        </span>
        {isCurrentMonth && (
          <span className="text-[10px] font-semibold bg-primary/15 text-primary rounded px-1.5 py-0.5 leading-none">
            Now
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-muted transition-smooth"
        onClick={goForward}
        disabled={isCurrentMonth}
        data-ocid="month-selector.next"
        aria-label="Next month"
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}
