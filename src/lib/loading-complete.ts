"use client";

import { useSyncExternalStore } from "react";

export const INTRO_SEEN_KEY = "portfolio-intro-seen";
// Set right before a client-side nav that's revealing a homepage which was
// already fully visible a moment ago (e.g. closing the passcode gate) — a
// fresh IconRow/CrossfadeReveal mount would otherwise still fade in from
// opacity 0 like any other arrival, which reads as a jarring blink right
// after the modal's own exit fade. Read once by the new mount, then cleared
// by whoever set it, so it never suppresses an unrelated later arrival.
export const SKIP_HERO_ENTRANCE_KEY = "portfolio-skip-hero-entrance";

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
