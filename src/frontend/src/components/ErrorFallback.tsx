import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Route-level crash screen. A standalone PWA has no address bar and no
 * browser refresh button, so an uncaught render error would otherwise leave
 * the user stuck on a blank screen with no way out except force-closing the
 * app. `reset` re-runs the failed route's loader/component; the full reload
 * is a fallback for errors reset can't clear (e.g. broken module state).
 */
export function ErrorFallback({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center">
      <h2 className="font-display text-xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-1 leading-relaxed">
        This page hit an unexpected error. Your data is safe — try reloading.
      </p>
      {import.meta.env.DEV && (
        <p className="text-xs text-destructive/80 font-mono max-w-md mt-2 mb-4 break-words">
          {error.message}
        </p>
      )}
      <div className="flex gap-3 mt-5">
        <Button
          variant="outline"
          onClick={() => reset()}
          className="button-hover"
        >
          Try again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          className="button-hover shadow-elevated"
        >
          Reload app
        </Button>
      </div>
    </div>
  );
}
