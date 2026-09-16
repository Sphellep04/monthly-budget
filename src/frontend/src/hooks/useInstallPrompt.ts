import { useEffect, useState } from "react";

const DISMISSED_KEY = "budgetwise-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own standalone flag - not covered by the media query above
    (navigator as { standalone?: boolean }).standalone === true
  );
}

/** Captures the browser's install prompt so it can be triggered from our own
 * UI instead of relying on the browser's address-bar icon. Chromium-based
 * browsers only; Safari/iOS never fires this event (no programmatic install
 * there - users add to home screen manually), so the banner simply never
 * appears for them. */
export function useInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === "1",
  );

  useEffect(() => {
    if (isStandalone()) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }
    function handleAppInstalled() {
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    // Each captured event is single-use regardless of outcome.
    setInstallEvent(null);
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return {
    canInstall: installEvent !== null && !dismissed,
    promptInstall,
    dismiss,
  };
}
