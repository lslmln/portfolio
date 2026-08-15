"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { SKIP_HERO_ENTRANCE_KEY } from "@/lib/loading-complete";
import { PASSCODE_VERIFIED_KEY } from "@/lib/passcode";
import { HomeHero } from "./home-hero";
import { COVER_DURATION, useNavigate } from "./route-transition";
import { PasscodeModal } from "./passcode-modal";

// Matches panelVariants/backdropVariants' exit duration (modal-variants.ts).
const MODAL_EXIT_MS = 150;

// Wraps a locked work-detail page's content. The listing page only gates
// navigation to these routes via a click handler — someone arriving by a
// direct/bookmarked URL skips that entirely, so this re-checks the same
// sessionStorage flag on mount and blocks the content behind the same
// passcode prompt if it isn't set. The homepage's top section stands in as
// the backdrop (same as if they'd opened the prompt from home). Success
// mirrors WorkSection's own handling exactly (same modal animation, same
// "navigate, close the modal immediately, reveal once the cover is fully
// opaque" pattern). Closing without unlocking deliberately doesn't:
// WorkSection's close never
// navigates anywhere (it's already on the right page), and the cover
// fade-in/out round trip only exists to hide a real content swap — here the
// homepage is already sitting right behind the modal, so covering the
// screen just to reveal the exact same thing again would be pointless. It
// just lets the modal fade away over what's already there.
export function WorkDetailGate({ children }: { children: ReactNode }) {
  // Starts unresolved (not just "locked") so the very first render — server
  // and client alike, before sessionStorage can be read — never paints the
  // real content while an already-unlocked visitor's session is still being
  // checked.
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const verified = sessionStorage.getItem(PASSCODE_VERIFIED_KEY) === "1";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(verified);
    setModalOpen(!verified);
  }, []);

  function closePasscode() {
    setModalOpen(false);
  }

  function handleVerified() {
    sessionStorage.setItem(PASSCODE_VERIFIED_KEY, "1");
    // Same route — navigate() plays the exact cover fade-in/out crossfade
    // used for a real navigation, just without an actual URL change, so
    // revealing the now-unlocked content underneath reads identically to
    // WorkSection's own "click card, cover rises, new page underneath".
    navigate(pathname);
    // Close right away (matching WorkSection) rather than waiting for the
    // cover to fully hide it — the modal is portalled to <body> and covers
    // the whole viewport including the navbar, but the cover only ever
    // covers the area below it, so leaving the modal open for the whole
    // fade-in would show that mismatch as a seam right at the navbar.
    closePasscode();
    // The actual content swap still waits for the cover to be fully opaque,
    // same as before — only the modal's own visibility timing changed.
    setTimeout(() => setUnlocked(true), reduceMotion ? 0 : COVER_DURATION * 1000);
  }

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <>
      <HomeHero />
      <PasscodeModal
        open={modalOpen}
        autoFocusInput={false}
        onClose={() => {
          closePasscode();
          // The fresh HomeHero this push mounts would otherwise still fade
          // in from opacity 0 like any other arrival — jarring right after
          // the modal's own exit fade, since this homepage was already
          // fully visible a moment ago. See SKIP_HERO_ENTRANCE_KEY.
          sessionStorage.setItem(SKIP_HERO_ENTRANCE_KEY, "1");
          // Plain router push, not navigate() — no cover round-trip, since
          // there's nothing to hide: the homepage is already right there
          // behind the modal, so this just corrects the URL while the
          // modal's own exit fade reveals it underneath. Delayed until that
          // exit finishes: pushing immediately swaps RouteTransition's
          // content tree (this page unmounts, the real homepage mounts)
          // while the modal is still mid-fade, cutting its animation short
          // and reading as a blink instead of a smooth reveal.
          setTimeout(
            () => {
              router.push("/", { scroll: false });
              // Cleared shortly after — by now the fresh mount (if any) has
              // already read it in its own lazy initializer; leaving it set
              // would incorrectly skip the fade on some later, unrelated
              // arrival at home (e.g. clicking the logo afterward).
              setTimeout(() => sessionStorage.removeItem(SKIP_HERO_ENTRANCE_KEY), 100);
            },
            reduceMotion ? 0 : MODAL_EXIT_MS,
          );
        }}
        onVerified={handleVerified}
      />
    </>
  );
}
