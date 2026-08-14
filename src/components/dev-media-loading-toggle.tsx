"use client";

import { useState } from "react";
import { replayMediaLoadingPreview } from "@/lib/media-loading-preview";

const REPLAY_TOTAL_MS = 1300; // 900ms hold + ~300ms fade-in + a little slack

export function DevMediaLoadingToggle() {
  const [replaying, setReplaying] = useState(false);

  function handleClick() {
    if (replaying) return;
    setReplaying(true);
    replayMediaLoadingPreview();
    setTimeout(() => setReplaying(false), REPLAY_TOTAL_MS);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={replaying}
      className="fixed bottom-4 left-[230px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm disabled:opacity-50"
    >
      {replaying ? "Replaying…" : "Replay media loading state"}
    </button>
  );
}
