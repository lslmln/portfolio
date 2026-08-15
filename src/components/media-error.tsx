"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import { useMediaErrorIconSize } from "@/lib/use-media-error-icon-size";

export function MediaError() {
  const iconSize = useMediaErrorIconSize();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-card-text-gap rounded-card bg-content-secondary/15">
      <ImageBrokenIcon size={iconSize} weight="fill" className="text-content-secondary" />
      <p className="font-sans font-medium text-body text-content-secondary">Failed to load</p>
    </div>
  );
}
