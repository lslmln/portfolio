"use client";

import { ImageBrokenIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { ICON_SIZE_LG, ICON_SIZE_MOBILE } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";
import styles from "./error-message.module.css";

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

// href re-navigates to a specific page (route-transition's stall retry);
// omitting it just reloads the current one (the 404 page has nowhere more
// specific to send you).
export function ReloadButton({ href }: { href?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (href) {
          window.location.href = href;
        } else {
          window.location.reload();
        }
      }}
      className={`${styles.reloadButton} cursor-pointer rounded-button px-button-padding-x py-button-padding-y font-sans font-medium text-body`}
    >
      Reload
    </button>
  );
}
