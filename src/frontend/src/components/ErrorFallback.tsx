import { Button } from "@/components/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";

const CHUNK_ERROR_PATTERN =
  /dynamically imported module|importing a module script failed|failed to fetch|loading chunk/i;

// The service worker auto-updates in the background (registerType:
// "autoUpdate") without reloading an already-open tab, so a page opened
// before a deploy can still be holding JS chunk URLs that no longer exist
// on the server once it navigates somewhere new. One silent reload picks up
// the fresh bundle; the guard stops a genuinely broken deploy from looping.
const RELOAD_GUARD_KEY = "budgetwise-chunk-reload-guard";

function isChunkLoadError(error: Error): boolean {
  return CHUNK_ERROR_PATTERN.test(error.message);
}

/**
 * Crash screen for both the route-level errorComponent and PageErrorBoundary.
 * A standalone PWA has no address bar and no browser refresh button, so an
 * uncaught render error would otherwise leave the user stuck with no way out
 * except force-closing the app. `reset` re-runs the failed route/boundary;
 * the full reload is a fallback for errors reset can't clear.
 */
export function ErrorFallback({ error, reset }: ErrorComponentProps) {
  const isStaleChunk = isChunkLoadError(error);

  useEffect(() => {
    if (!isStaleChunk) return;
    if (sessionStorage.getItem(RELOAD_GUARD_KEY)) return;
    sessionStorage.setItem(RELOAD_GUARD_KEY, "1");
    window.location.reload();
  }, [isStaleChunk]);

  if (isStaleChunk) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          Updating to the latest version…
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          This only takes a second.
        </p>
      </div>
    );
  }

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
