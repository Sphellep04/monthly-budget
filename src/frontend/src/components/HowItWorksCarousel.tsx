import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Step {
  title: string;
  description: string;
  image: string;
}

const STEPS: Step[] = [
  {
    title: "See everything at a glance",
    description:
      "Your Dashboard shows every budget category, what's left to spend, and your real net savings for the month.",
    image: "/screenshots/dashboard.png",
  },
  {
    title: "Scan a receipt instead of typing",
    description:
      "Snap a photo of a receipt and BudgetWise reads the total automatically with on-device OCR - no manual entry.",
    image: "/screenshots/scan-receipt.png",
  },
  {
    title: "Track trends over time",
    description:
      "Charts break down spending by category and month, so you can spot patterns before they become problems.",
    image: "/screenshots/charts.png",
  },
];

interface HowItWorksCarouselProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HowItWorksCarousel({
  open,
  onOpenChange,
}: HowItWorksCarouselProps) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  function handleClose(v: boolean) {
    if (!v) setIndex(0);
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-premium backdrop-blur-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-xl font-bold text-foreground">
            How BudgetWise works
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2">
          <div className="rounded-xl border border-border overflow-hidden bg-muted/30 aspect-video">
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="px-6 pt-3 pb-2">
          <h3 className="font-display font-semibold text-base text-foreground mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-muted/10">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              aria-label="Previous step"
            >
              <ChevronLeft size={15} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() =>
                setIndex((i) => Math.min(STEPS.length - 1, i + 1))
              }
              disabled={index === STEPS.length - 1}
              aria-label="Next step"
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
