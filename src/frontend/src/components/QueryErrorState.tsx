import { Button } from "@/components/ui/button";

interface QueryErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function QueryErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: QueryErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 text-center">
      <h3 className="font-display font-bold text-xl text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm text-center mb-7 max-w-xs leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="button-hover">
          Try again
        </Button>
      )}
    </div>
  );
}
