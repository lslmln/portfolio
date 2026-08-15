"use client";

import {
  ICON_SIZE_MEDIA_ERROR_DESKTOP,
  ICON_SIZE_MEDIA_ERROR_TABLET,
  ICON_SIZE_SM,
} from "./icon-size";
import { useMediaQuery } from "./use-media-query";

// Shared 32/64/96 responsive icon size for MediaError and WorkSection's WIP
// overlay — the only two places that need this exact scale.
export function useMediaErrorIconSize() {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop
    ? ICON_SIZE_MEDIA_ERROR_DESKTOP
    : isTablet
      ? ICON_SIZE_MEDIA_ERROR_TABLET
      : ICON_SIZE_SM;
}
