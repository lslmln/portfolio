"use client";

import { useState } from "react";
import { useMediaLoadingPreviewForced } from "./media-loading-preview";

export function useMediaLoaded() {
  const [loaded, setLoaded] = useState(false);
  const forced = useMediaLoadingPreviewForced();
  return { loaded: forced ? false : loaded, onLoad: () => setLoaded(true) };
}
