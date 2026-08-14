"use client";

import { useSyncExternalStore } from "react";

let complete = false;
let introPlayed = false;
const listeners = new Set<() => void>();

// `playedIntro` distinguishes "the elaborate homepage intro just ran" from
// "loading resolved instantly because it was skipped" — icon-row and
// crossfade-reveal use it to pick their entrance timing.
export function markLoadingComplete(playedIntro: boolean) {
  introPlayed = playedIntro;
  if (complete) return;
  complete = true;
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getCompleteSnapshot() {
  return complete;
}

function getIntroPlayedSnapshot() {
  return introPlayed;
}

export function useLoadingComplete() {
  return useSyncExternalStore(subscribe, getCompleteSnapshot, getCompleteSnapshot);
}

export function useIntroPlayed() {
  return useSyncExternalStore(subscribe, getIntroPlayedSnapshot, getIntroPlayedSnapshot);
}
