import type { BrowserStorageBackend } from "../backends/browserStorageBackend";
import { browserStorageBackend } from "../backends/browserStorageBackend";

export function useActorOrMock(): {
  actor: BrowserStorageBackend;
  isFetching: boolean;
} {
  return { actor: browserStorageBackend, isFetching: false };
}
