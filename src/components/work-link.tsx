"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PASSCODE_VERIFIED_KEY } from "@/lib/passcode";
import { workProjects } from "@/lib/work-projects";
import { PasscodeModal } from "./passcode-modal";
import { useNavigate } from "./route-transition";
import { TransitionLink } from "./transition-link";

// An inline cross-link (e.g. "see this page for design systems") to another
// case study, used from within case-study body copy. If the target is
// locked and not yet unlocked this session, a plain TransitionLink would
// navigate straight to WorkDetailGate's fallback — which stands in the
// homepage as its backdrop, since it has no idea what page sent the visitor
// there. Intercepting the click here instead opens the same passcode prompt
// right over the current page, so the backdrop is whatever the visitor was
// actually looking at (same pattern as WorkSection's card click).
export function WorkLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  const project = workProjects.find((item) => item.slug === slug);
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(PASSCODE_VERIFIED_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlocked(true);
    }
  }, []);

  if (!project?.locked || unlocked) {
    return (
      <TransitionLink href={`/work/${slug}`} className={className}>
        {children}
      </TransitionLink>
    );
  }

  function handleVerified() {
    sessionStorage.setItem(PASSCODE_VERIFIED_KEY, "1");
    setUnlocked(true);
    navigate(`/work/${slug}`);
    setModalOpen(false);
  }

  return (
    <>
      <button type="button" onClick={() => setModalOpen(true)} className={className}>
        {children}
      </button>
      <PasscodeModal open={modalOpen} onClose={() => setModalOpen(false)} onVerified={handleVerified} />
    </>
  );
}
