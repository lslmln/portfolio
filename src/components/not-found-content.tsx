"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import { ICON_SIZE_LG, ICON_SIZE_MOBILE } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";

export function NotFoundContent() {
  const isDark = useIsDark();
  const isTablet = useMediaQuery("(min-width: 768px)");
  const iconSize = isTablet ? ICON_SIZE_LG : ICON_SIZE_MOBILE;

  return (
    <div
      className="flex items-center px-page-x"
      style={{ minHeight: "calc(100svh - var(--nav-height) - var(--footer-height))" }}
    >
      <div className="flex flex-col items-start gap-card-text-gap">
        <ImageBrokenIcon
          size={iconSize}
          weight={isDark ? "fill" : "regular"}
          className="text-content-secondary"
        />
        <p className="font-sans font-semibold text-header text-content-primary">
          Oops, something went wrong.
        </p>
      </div>
    </div>
  );
}
