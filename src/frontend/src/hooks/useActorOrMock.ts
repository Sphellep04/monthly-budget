import { useMemo } from "react";
import type { Backend } from "../backends/Backend";
import { createSupabaseBackend } from "../backends/supabaseBackend";
import { useAuth } from "./useAuth";

export function useActorOrMock(): {
  actor: Backend | null;
  isFetching: boolean;
} {
  const { userId, isLoading } = useAuth();
  const actor = useMemo(
    () => (userId ? createSupabaseBackend(userId) : null),
    [userId],
  );
  return { actor, isFetching: isLoading };
}
