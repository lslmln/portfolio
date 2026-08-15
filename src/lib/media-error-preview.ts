"use client";

import { useSyncExternalStore } from "react";

// Dev-only: forces every useMediaLoaded() consumer into its error state, so
// MediaError's appearance can be inspected without needing an actual broken
// media file. Toggled on/off (unlike the loading preview's timed replay)
// since there's no natural moment for an error state to resolve on its own.
// Triggered by DevMediaErrorToggle.
let forced = false;
const listeners = new Set<() => void>();

export function toggleMediaErrorPreview() {
  forced = !forced;
  listeners.forEach((listener) => listener());
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

export function useMediaErrorPreviewForced() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
