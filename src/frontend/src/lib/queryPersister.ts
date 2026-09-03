import type { Persister } from "@tanstack/react-query-persist-client";
import { createStore, del, get, set } from "idb-keyval";

const store = createStore("budgetwise-query-cache", "cache");
const KEY = "tanstack-query-cache";

/**
 * Persists the query cache straight into IndexedDB via the structured clone
 * algorithm, not JSON - so BigInt fields (budget/expense ids, amounts,
 * year/month) survive the round trip without a custom tag-and-revive
 * serializer (localStorage-based persisters need one; IndexedDB doesn't).
 * This is what lets the last-synced month render instantly offline instead
 * of an empty shell with spinners.
 */
export function createIndexedDbPersister(): Persister {
  return {
    persistClient: async (persistedClient) => {
      await set(KEY, persistedClient, store);
    },
    restoreClient: async () => {
      return get(KEY, store);
    },
    removeClient: async () => {
      await del(KEY, store);
    },
  };
}
