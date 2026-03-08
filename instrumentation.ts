/**
 * Next.js instrumentation file — runs once when the server starts.
 *
 * Provides a no-op localStorage stub so that packages that access
 * localStorage at import time (e.g. @clerk/shared telemetry) do not
 * crash with "localStorage.getItem is not a function" during SSR.
 */
export function register() {
  if (typeof globalThis.localStorage === "undefined") {
    (globalThis as unknown as Record<string, unknown>).localStorage = {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
      clear: () => undefined,
      key: () => null,
      length: 0,
    };
  }
}
