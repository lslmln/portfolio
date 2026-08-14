"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
// Symmetric, so the fade in and the fade out read as the same speed —
// EASE_OUT_EXPO decelerates hard at the end, which made one direction feel
// slower than the other.
const COVER_EASE = [0.65, 0, 0.35, 1] as const;
export const COVER_DURATION = 0.5;
const COLD_LOAD_DURATION = 0.4;

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
  const isHome = pathname === "/";

  const [shown, setShown] = useState({ pathname, children });
  const [covering, setCovering] = useState(false);
  const [coverDuration, setCoverDuration] = useState(COVER_DURATION);
  // Refs, not state — read at call time so a stale render closure or a
  // duplicate animation-complete event can't re-run the swap.
  const coveringRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  // True when navigate() was called for the page we're already on (e.g.
  // clicking the "Si Min Lee" logo while already home) — there's no route
  // change to wait for, so the reveal is driven locally instead of by the
  // pathname-watching effect below.
  const sameRouteResetRef = useRef(false);

  function navigate(href: string) {
    const skip = reduceMotion || !isAnimatedRoute(pathname) || !isAnimatedRoute(href);
    sameRouteResetRef.current = href === pathname;
    pendingHrefRef.current = href === pathname ? null : href;
    coveringRef.current = true;
    setCoverDuration(skip ? 0 : COVER_DURATION);
    setCovering(true);
  }

  function handleCoverAnimationComplete() {
    if (!coveringRef.current) return;

    if (sameRouteResetRef.current) {
      sameRouteResetRef.current = false;
      coveringRef.current = false;
      window.scrollTo(0, 0);
      setCovering(false);
      return;
    }

    if (pendingHrefRef.current) {
      const href = pendingHrefRef.current;
      pendingHrefRef.current = null;
      router.push(href, { scroll: false });
    }
  }

  // Fires once the actual route content changes — whether we initiated it
  // via navigate() (cover is already opaque by now) or not (browser
  // back/forward, or any link that bypassed navigate()). Either way, swap
  // in the new content, scroll to top, and lift the cover.
  useEffect(() => {
    if (pathname === shown.pathname) return;
    coveringRef.current = false;
    window.scrollTo(0, 0);
    setShown({ pathname, children });
    setCovering(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, children]);

  return (
    <NavigateContext.Provider value={navigate}>
      {navbar}
      <div className="relative">
        <motion.div
          initial={{ opacity: isHome ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : COLD_LOAD_DURATION, ease: EASE_OUT_EXPO }}
        >
          {shown.children}
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[150] bg-background-primary"
          initial={false}
          animate={{ opacity: covering ? 1 : 0 }}
          transition={{ duration: coverDuration, ease: COVER_EASE }}
          onAnimationComplete={handleCoverAnimationComplete}
        />
      </div>
    </NavigateContext.Provider>
  );
}
