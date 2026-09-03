import { createStore, del, set, values } from "idb-keyval";
import type { ExpenseInput } from "../backends/Backend";

const store = createStore("budgetwise-expense-outbox", "pending");

export interface PendingExpense {
  /**
   * Negative so it can never collide with a real (positive bigserial)
   * expense id, and stringifies to the same value used as the IndexedDB
   * key - the query cache entry and the outbox record are correlated by
   * this one value instead of needing two separate ids kept in sync.
   */
  tempId: bigint;
  input: ExpenseInput;
  queuedAt: number;
}

let counter = 0;

/** A unique negative id for the optimistic cache entry / outbox key pair. */
export function makeTempExpenseId(): bigint {
  counter += 1;
  return -(BigInt(Date.now()) * 1_000_000n + BigInt(counter));
}

export async function enqueuePendingExpense(
  tempId: bigint,
  input: ExpenseInput,
): Promise<void> {
  const pending: PendingExpense = { tempId, input, queuedAt: Date.now() };
  await set(tempId.toString(), pending, store);
}

export async function listPendingExpenses(): Promise<PendingExpense[]> {
  return values(store);
}

export async function removePendingExpense(tempId: bigint): Promise<void> {
  await del(tempId.toString(), store);
}
