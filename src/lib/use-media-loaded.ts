"use client";

import { useState } from "react";
import { useMediaErrorPreviewForced } from "./media-error-preview";
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
  const forcedLoading = useMediaLoadingPreviewForced();
  const forcedError = useMediaErrorPreviewForced();
  return {
    loaded: forcedLoading ? false : loaded,
    error: forcedError ? true : error,
    onLoad: () => setLoaded(true),
    onError: () => setError(true),
  };
}
