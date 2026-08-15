"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PASSCODE_VERIFIED_KEY } from "@/lib/passcode";
import { HomeHero } from "./home-hero";
import { COVER_DURATION, useNavigate } from "./route-transition";
import { PasscodeModal } from "./passcode-modal";

// Wraps a locked work-detail page's content. The listing page only gates
// navigation to these routes via a click handler — someone arriving by a
// direct/bookmarked URL skips that entirely, so this re-checks the same
// sessionStorage flag on mount and blocks the content behind the same
// passcode prompt if it isn't set. The homepage's top section stands in as
// the backdrop (same as if they'd opened the prompt from home). Close and
// success both mirror WorkSection's own handling exactly (same modal
// enter/exit animation, same "navigate, then close once hidden behind the
// cover" pattern) so this reads as the identical interaction, not a
// separate one that happens to look similar.
export function WorkDetailGate({ children }: { children: ReactNode }) {
  // Starts unresolved (not just "locked") so the very first render — server
  // and client alike, before sessionStorage can be read — never paints the
  // real content while an already-unlocked visitor's session is still being
  // checked.
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
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
    setTimeout(
      () => {
        setUnlocked(true);
        closePasscode();
      },
      reduceMotion ? 0 : COVER_DURATION * 1000,
    );
  }

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <>
      <HomeHero />
      <PasscodeModal
        open={modalOpen}
        onClose={() => {
          closePasscode();
          navigate("/");
        }}
        onVerified={handleVerified}
      />
    </>
  );
}
