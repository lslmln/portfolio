"use client";

// TEMP: dev-only shortcut to preview the not-found page. Remove before shipping.
import Link from "next/link";

export function Dev404Link() {
  return (
    <Link
      href="/dev-404-preview"
      className="fixed bottom-4 left-4 z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
    >
      View 404
    </Link>
  );
}
