"use client";

import { toggleMediaErrorPreview, useMediaErrorPreviewForced } from "@/lib/media-error-preview";

export function DevMediaErrorToggle() {
  const active = useMediaErrorPreviewForced();

  return (
    <button
      type="button"
      onClick={toggleMediaErrorPreview}
      className="fixed bottom-4 left-[610px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
    >
      {active ? "Hide media error state" : "Show media error state"}
    </button>
  );
}
