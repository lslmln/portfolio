"use client";

import { useState } from "react";
import { useMediaLoadingPreviewForced } from "./media-loading-preview";

export function useMediaLoaded(src?: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  // Resets `loaded`/`error` when the caller's src changes (e.g. a dark-mode
  // image swap) — adjusting state during render, rather than an effect,
  // avoids an extra render where the old (now-wrong) media would flash back
  // to opaque before the reset effect could run.
  const [trackedSrc, setTrackedSrc] = useState(src);
  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setLoaded(false);
    setError(false);
  }
  const forced = useMediaLoadingPreviewForced();
  return {
    loaded: forced ? false : loaded,
    error,
    onLoad: () => setLoaded(true),
    onError: () => setError(true),
  };
}
