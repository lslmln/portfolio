"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import {
  ICON_SIZE_MEDIA_ERROR_DESKTOP,
  ICON_SIZE_MEDIA_ERROR_TABLET,
  ICON_SIZE_SM,
} from "@/lib/icon-size";
import { useMediaQuery } from "@/lib/use-media-query";

export function MediaError() {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const iconSize = isDesktop
    ? ICON_SIZE_MEDIA_ERROR_DESKTOP
    : isTablet
      ? ICON_SIZE_MEDIA_ERROR_TABLET
      : ICON_SIZE_SM;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-card-text-gap rounded-card bg-content-secondary/15">
      <ImageBrokenIcon size={iconSize} weight="regular" className="text-content-secondary" />
      <p className="font-sans font-medium text-body text-content-secondary">Failed to load</p>
    </div>
  );
}
