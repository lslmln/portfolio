"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { ICON_SIZE_LG, ICON_SIZE_MOBILE } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";

export function ErrorMessage({ message, children }: { message: string; children?: ReactNode }) {
  const isDark = useIsDark();
  const isTablet = useMediaQuery("(min-width: 768px)");
  const iconSize = isTablet ? ICON_SIZE_LG : ICON_SIZE_MOBILE;

  return (
    <div className="flex flex-col items-start gap-card-text-gap">
      <ImageBrokenIcon
        size={iconSize}
        weight={isDark ? "fill" : "regular"}
        className="text-content-secondary"
      />
      <p className="font-sans font-semibold text-header text-content-primary">{message}</p>
      {children}
    </div>
  );
}
