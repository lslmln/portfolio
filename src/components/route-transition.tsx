"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { CrossfadeReveal } from "@/components/crossfade-reveal";
import { scrollToTop } from "@/lib/scroll-root";
import { ErrorMessage, ReloadButton } from "./error-message";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
export const COVER_DURATION = 0.5;
// router.push() fetches the new route's RSC payload over the network — if
// that stalls (flaky connection, dropped request), pathname never changes,
// so the effect below that lifts the cover never fires either. Without
// this, a visitor would be stuck staring at a blank cover with no way out
// but a manual reload.
const NAV_STALL_MS = 6000;

// Real content routes — anything outside this list is the 404 state (the
// genuine not-found page or its dev preview), which swaps instantly with no
// crossfade in either direction.
const ANIMATED_ROUTES = [/^\/$/, /^\/about$/, /^\/work$/, /^\/work\/[^/]+$/];

function isAnimatedRoute(pathname: string) {
  return ANIMATED_ROUTES.some((pattern) => pattern.test(pathname));
}

type NavigateFn = (href: string) => void;

// Falls back to a plain hard navigation if a consumer somehow renders
// outside RouteTransition's provider.
const NavigateContext = createContext<NavigateFn>((href) => {
  window.location.href = href;
});

export function useNavigate() {
  return useContext(NavigateContext);
}

export function RouteTransition({
  navbar,
  children,
}: {
  navbar: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [shown, setShown] = useState({ pathname, children });
  const [covering, setCovering] = useState(false);
  const [coverDuration, setCoverDuration] = useState(COVER_DURATION);
  const [navStalled, setNavStalled] = useState(false);
  // State, not a ref — read during render to drive ReloadButton's href, so
  // it has to be something a render can actually observe.
  const [lastHref, setLastHref] = useState<string | null>(null);
  // Refs, not state — read at call time so a stale render closure or a
  // duplicate animation-complete event can't re-run the swap.
  const coveringRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const navStallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // True when navigate() was called for the page we're already on (e.g.
  // clicking the "Si Min Lee" logo while already home) — there's no route
  // change to wait for, so the reveal is driven locally instead of by the
  // pathname-watching effect below.
  const sameRouteResetRef = useRef(false);

  function clearNavStallTimer() {
    if (navStallTimerRef.current) {
      clearTimeout(navStallTimerRef.current);
      navStallTimerRef.current = null;
    }
  }

  function navigate(href: string) {
    const skip = reduceMotion || !isAnimatedRoute(pathname) || !isAnimatedRoute(href);
    sameRouteResetRef.current = href === pathname;
    pendingHrefRef.current = href === pathname ? null : href;
    coveringRef.current = true;
    clearNavStallTimer();
    setNavStalled(false);
    setCoverDuration(skip ? 0 : COVER_DURATION);
    setCovering(true);
  }

  function handleCoverAnimationComplete() {
    if (!coveringRef.current) return;

    if (sameRouteResetRef.current) {
      sameRouteResetRef.current = false;
      coveringRef.current = false;
      scrollToTop(0);
      setCovering(false);
      return;
    }

    if (pendingHrefRef.current) {
      const href = pendingHrefRef.current;
      pendingHrefRef.current = null;
      setLastHref(href);
      router.push(href, { scroll: false });
      navStallTimerRef.current = setTimeout(handleNavStall, NAV_STALL_MS);
    }
  }

  function handleNavStall() {
    // Reveal (same as a successful nav) instead of leaving the cover
    // opaque — the swapped-in error content below takes its place, so
    // there's nothing left that needs hiding.
    setNavStalled(true);
    coveringRef.current = false;
    setCovering(false);
  }

  // Fires once the actual route content changes — whether we initiated it
  // via navigate() (cover is already opaque by now) or not (browser
  // back/forward, or any link that bypassed navigate()). Either way, swap
  // in the new content, scroll to top, and lift the cover.
  useEffect(() => {
    if (pathname === shown.pathname) return;
    clearNavStallTimer();
    // Resetting UI state in direct response to an external signal
    // (pathname actually changing) is exactly what this effect is for —
    // not an accidental render-cascade the rule is meant to catch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNavStalled(false);
    coveringRef.current = false;
    scrollToTop(0);
    setShown({ pathname, children });
    setCovering(false);
    // shown intentionally omitted — this effect is what writes shown, and
    // comparing shown.pathname above is how it detects it already ran for
    // this pathname; including shown here would re-trigger itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, children]);

  return (
    <NavigateContext.Provider value={navigate}>
      {navbar}
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() => {
            setLastHref(pathname);
            setNavStalled(true);
          }}
          className="fixed bottom-4 left-[610px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
        >
          Preview route stall
        </button>
      )}
      <div className="relative">
        {navStalled ? (
          // Swapped in for shown.children (not just painted over it) so the
          // page's real height shrinks to match — same one-viewport layout
          // as NotFoundContent, instead of leaving the old (possibly much
          // taller) page's height in the document under an opaque cover.
          <div
            className="flex items-center px-page-x"
            style={{ minHeight: "calc(100svh - var(--nav-height) - var(--footer-height))" }}
          >
            <ErrorMessage message="This is taking longer than expected.">
              <ReloadButton href={lastHref ?? undefined} />
            </ErrorMessage>
          </div>
        ) : (
          // Same component (and so the exact same trigger, duration, and
          // elaborate-vs-plain timing) as the navbar's own CrossfadeReveal —
          // otherwise the two fade in on independent timings and content
          // (plain 0.5s) finishes well before the navbar's elaborate,
          // delayed first-visit entrance even starts.
          <CrossfadeReveal>{shown.children}</CrossfadeReveal>
        )}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-route-cover bg-background-primary"
          initial={false}
          animate={{ opacity: covering ? 1 : 0 }}
          transition={{ duration: coverDuration, ease: EASE_OUT_EXPO }}
          onAnimationComplete={handleCoverAnimationComplete}
        />
      </div>
    </NavigateContext.Provider>
  );
}
