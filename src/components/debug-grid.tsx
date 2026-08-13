"use client";

// TEMP: alignment-check overlay for the 12-column / 8px spacing system.
// Remove before shipping — not meant to be part of the live site.
import { useState } from "react";

export function DebugGrid() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="fixed bottom-4 right-4 z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
      >
        {visible ? "Hide grid" : "Show grid"}
      </button>
      {visible && (
        <div className="pointer-events-none fixed inset-0 z-50 mx-page-x grid grid-cols-12 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-red-500/10" />
          ))}
        </div>
      )}
    </>
  );
}
