import type { BrowserStorageBackend } from "../backends/browserStorageBackend";
import { browserStorageBackend } from "../backends/browserStorageBackend";
import { mockBackend } from "../mocks/backend";

const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true";

function useMockActor() {
  return { actor: mockBackend, isFetching: false };
}

function useRealActor() {
  return { actor: browserStorageBackend, isFetching: false };
}

// IS_MOCK is a build-time constant, so the hook identity is stable across renders.
export const useActorOrMock: () => {
  actor: BrowserStorageBackend;
  isFetching: boolean;
} = IS_MOCK ? useMockActor : (useRealActor as never);
