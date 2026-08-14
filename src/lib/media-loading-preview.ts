"use client";

import { useSyncExternalStore } from "react";

// Dev-only: forces every useMediaLoaded() consumer back into its "not
// loaded" placeholder state, then releases it — so the fade-in transition
// actually plays in front of you instead of racing past on a fast local
// network (or freezing forever, if just toggled on and left there).
// Triggered by DevMediaLoadingToggle.
let forced = false;
const listeners = new Set<() => void>();

const HOLD_MS = 900;

export function replayMediaLoadingPreview() {
  forced = true;
  listeners.forEach((listener) => listener());
  setTimeout(() => {
    forced = false;
    listeners.forEach((listener) => listener());
  }, HOLD_MS);
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot() {
  return forced;
}

function getServerSnapshot() {
  return false;
}

export function useMediaLoadingPreviewForced() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
