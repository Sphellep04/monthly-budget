import { useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Delays a delete by `delayMs`, showing a toast with an Undo action. The item
 * should be hidden from the list immediately via `isPending(id)` so the delete
 * feels instant, while the actual mutation only fires if the user doesn't undo.
 */
export function useUndoableDelete<TId extends string | bigint>(
  onCommit: (id: TId) => void,
  delayMs = 5000,
) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  function clearPending(key: string) {
    const timer = timers.current.get(key);
    if (timer) clearTimeout(timer);
    timers.current.delete(key);
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }

  function requestDelete(id: TId, label: string) {
    const key = id.toString();
    setPendingIds((prev) => new Set(prev).add(key));

    const timer = setTimeout(() => {
      timers.current.delete(key);
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      onCommit(id);
    }, delayMs);
    timers.current.set(key, timer);

    toast(`${label} deleted`, {
      action: {
        label: "Undo",
        onClick: () => clearPending(key),
      },
      duration: delayMs,
    });
  }

  function isPending(id: TId): boolean {
    return pendingIds.has(id.toString());
  }

  return { requestDelete, isPending };
}
