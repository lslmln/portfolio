"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { markLoadingComplete } from "@/lib/loading-complete";

const DURATION_MS = 1600;
const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
const INTRO_SEEN_KEY = "portfolio-intro-seen";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const [fading, setFading] = useState(false);
  // Decided once, via a lazy initializer, rather than re-read inside the
  // effect below — React 18 Strict Mode (dev only) runs that effect's body
  // twice, and re-reading sessionStorage on the second pass would see the
  // "seen" flag the first pass had just written, skipping the animation it
  // had only just started.
  const [shouldPlayIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    const isHome = window.location.pathname === "/";
    return isHome && !sessionStorage.getItem(INTRO_SEEN_KEY);
  });
  // Always starts hidden — on both the server *and* the client's first
  // render — so hydration never has anything to disagree about (the server
  // has no sessionStorage, so it can only ever assume "don't show it";
  // computing this from shouldPlayIntro instead, which the client evaluates
  // for real, made the client's first render diverge from the server's
  // whenever a fresh session actually should play the intro — a genuine
  // hydration mismatch, not just the earlier flash-of-overlay issue this
  // was trying to fix). The effect below is the only thing allowed to
  // reveal it, post-mount, which sidesteps hydration entirely.
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (reduceMotion || !shouldPlayIntro) {
      markLoadingComplete(false);
      return;
    }

    setHidden(false);
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(easeOutCubic(progress) * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setFading(true), 200);
      }
    }
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, shouldPlayIntro]);

  useEffect(() => {
    if (hidden) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  useEffect(() => {
    if (!fading) return;
    markLoadingComplete(true);
    const timer = setTimeout(() => setHidden(true), 2200);
    return () => clearTimeout(timer);
  }, [fading]);

  if (hidden) return null;

  return (
    <motion.div
      className="fixed inset-0 z-loading bg-background-primary"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
    >
      <div className="absolute" style={{ left: "32px", top: "50%", transform: "translateY(-50%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: fading ? 0 : value / 100, y: fading ? -192 : 0 }}
          transition={{ duration: fading ? 2.2 : 0, ease: EASE_OUT_EXPO }}
          className="font-sans font-semibold text-header text-content-primary"
        >
          <p className="whitespace-nowrap">Si Min Lee</p>
          <p className="whitespace-nowrap">— Product Designer</p>
        </motion.div>
      </div>
      <p
        className="absolute flex font-sans font-semibold text-header text-content-primary"
        style={{ left: "32px", bottom: "24px" }}
      >
        <span>{value}</span>
        <motion.span layout="position" transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}>
          %
        </motion.span>
      </p>
      <div className="absolute bottom-0 left-0 right-0 h-progress-height overflow-hidden">
        <div
          className="h-full rounded-r-button bg-content-primary"
          style={{ width: `calc(${value}% + ${(value / 100) * 12}px)` }}
        />
      </div>
    </motion.div>
  );
}
