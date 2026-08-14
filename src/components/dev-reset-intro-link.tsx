"use client";

// TEMP: dev-only shortcut to re-trigger the homepage intro animation.
// Remove before shipping.

const INTRO_SEEN_KEY = "portfolio-intro-seen";

export function DevResetIntroLink() {
  return (
    <button
      type="button"
      onClick={() => {
        sessionStorage.removeItem(INTRO_SEEN_KEY);
        // Assigning the same URL is a no-op in most browsers (no reload) —
        // force one explicitly when already on "/".
        if (window.location.pathname === "/") {
          window.location.reload();
        } else {
          window.location.href = "/";
        }
      }}
      className="fixed bottom-4 left-[110px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
    >
      Replay intro
    </button>
  );
}
