"use client";

import { CopyrightIcon, PawPrintIcon } from "@phosphor-icons/react";
import { ICON_SIZE_FOOTER } from "@/lib/icon-size";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-start justify-between gap-card-spacing bg-content-primary px-page-x py-page-y font-sans font-medium text-nav text-background-primary tablet:flex-row tablet:items-center">
      <span className="flex items-center gap-text-icon">
        <CopyrightIcon size={ICON_SIZE_FOOTER} weight="fill" className="icon-footer" />
        2026 Si Min Lee
      </span>
      <span className="flex flex-row-reverse items-center gap-text-icon tablet:flex-row">
        Made between fluffy boy pats
        <PawPrintIcon size={ICON_SIZE_FOOTER} weight="fill" className="icon-footer" />
      </span>
    </footer>
  );
}
