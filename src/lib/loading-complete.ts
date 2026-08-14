"use client";

import { useSyncExternalStore } from "react";

let complete = false;
const listeners = new Set<() => void>();

export function markLoadingComplete() {
  if (complete) return;
  complete = true;
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot() {
  return complete;
}

export function useLoadingComplete() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
