"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "framer-motion";
import {
  BoatIcon,
  ChartLineIcon,
  GraphIcon,
  LeafIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import { ICON_ROW_WIDTH, ICON_SIZE_LG, ICON_SIZE_MOBILE } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { INTRO_SEEN_KEY, useLoadingComplete } from "@/lib/loading-complete";
import { useMediaQuery } from "@/lib/use-media-query";
import styles from "./icon-row.module.css";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

const items = [
  {
    Icon: ChartLineIcon,
    pre: "Tokenized stocks & Equities Trading @ ",
    company: "Crypto.com",
    href: "https://crypto.com/",
  },
  {
    Icon: BoatIcon,
    pre: "Manpower planning for the Navy @ ",
    company: "IBM",
    href: "https://www.ibm.com/",
  },
  {
    Icon: GraphIcon,
    pre: "Incentive processing workflows @ ",
    company: "EDB",
    href: "https://www.edb.gov.sg/",
  },
  {
    Icon: LeafIcon,
    pre: "IoT for Public Housing & Parks @ ",
    company: "Univers",
    href: "https://univers.com/",
  },
  {
    Icon: ShoppingCartIcon,
    pre: "3D body scanning for online fit sizing @ ",
    company: "NetVirta",
    href: "https://www.netvirta.com/",
  },
];

// Matches the Scroll cue's cadence (delay: 1.5, duration: 0.5, repeatDelay: 3.5).
const HINT_INITIAL_DELAY_MS = 1500;
const HINT_REPEAT_MS = 4000;
const HINT_STAGGER_S = 0.05;

function alignmentForIndex(index: number): "left" | "center" | "right" {
  if (index <= 1) return "left";
  if (index === 2) return "center";
  return "right";
}

function CaptionText({ active }: { active: (typeof items)[number] }) {
  return (
    <>
      {active.pre}
      <a href={active.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {active.company}
      </a>
    </>
  );
}

export function IconRow() {
  const [selected, setSelected] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDark = useIsDark();
  const loadingComplete = useLoadingComplete();
  // Whether *this* mount gets the elaborate fly-up-from-below-screen
  // entrance. Decided once, synchronously, via a lazy initializer — Framer
  // Motion only honors the `initial` prop on an element's very first render,
  // and the async `loadingComplete` store is still false at that instant
  // (the loading screen's effect hasn't run yet), so deriving this from a
  // subscribed value would always miss the initial y offset and collapse
  // the entrance into a plain fade. Checking sessionStorage directly here
  // mirrors the same check loading-screen.tsx does to decide whether to
  // play at all. loadingComplete already being true at mount means this is
  // a remount from client-side nav back to home, not the true first load —
  // skip the elaborate entrance so it doesn't replay every return trip.
  const [useElaborateEntrance] = useState(() => {
    if (typeof window === "undefined" || loadingComplete) return false;
    return window.location.pathname === "/" && !sessionStorage.getItem(INTRO_SEEN_KEY);
  });

  useEffect(() => {
    if (selected !== null) return;

    function playHint() {
      if (!scope.current) return;
      const icons = Array.from(
        scope.current.querySelectorAll("[data-hint-icon]")
      ) as HTMLElement[];
      icons.forEach((el, index) => {
        if (reduceMotion) {
          animate(
            el,
            { opacity: [1, 0.6, 1] },
            { duration: 0.28, delay: index * HINT_STAGGER_S, ease: "easeOut" }
          );
        } else {
          animate(
            el,
            { scale: [1, 0.94, 1] },
            { duration: 0.28, delay: index * HINT_STAGGER_S, ease: "easeOut" }
          );
        }
      });
    }

    let timer: ReturnType<typeof setTimeout>;

    function schedule(delay: number) {
      timer = setTimeout(() => {
        playHint();
        schedule(HINT_REPEAT_MS);
      }, delay);
    }

    schedule(HINT_INITIAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [selected, animate, reduceMotion, scope]);

  function selectIcon(index: number | null) {
    setSelected(index);
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        selectIcon(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const align = isTablet && selected !== null ? alignmentForIndex(selected) : "left";
  const active = selected === null ? null : items[selected];
  const iconSize = isTablet ? ICON_SIZE_LG : ICON_SIZE_MOBILE;
  // Icons stack vertically below the tablet breakpoint (flex-col) and run
  // in a row at tablet+ (flex-row) — the entrance direction follows suit:
  // fly in from the right when stacked, from below when in a row. Both axes
  // are always set (never just the active one): isTablet starts `false`
  // until its own effect resolves, so the offset axis can flip between
  // renders — if the inactive axis were left out of the target, whichever
  // axis it started on would get "abandoned" mid-value instead of reset,
  // leaving the icons transformed off-screen at full opacity.
  const flyInOffset = isTablet ? { x: 0, y: "100vh" } : { x: "100vw", y: 0 };
  const flyInRest = { x: 0, y: 0 };

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} flex flex-col items-start gap-page-y tablet:items-stretch`}
      style={{ "--icon-row-half-width": `${ICON_ROW_WIDTH / 2}px` } as React.CSSProperties}
    >
      <div
        ref={scope}
        className="relative flex flex-col items-center gap-0 tablet:flex-row tablet:gap-page-x"
      >
        {items.map(({ Icon, company }, index) => (
          <motion.div
            key={company}
            className="relative"
            // useElaborateEntrance can only be known client-side
            // (sessionStorage isn't available during SSR), so it — and the
            // initial/transform styles it drives — genuinely differs
            // between the server-rendered HTML and this first client
            // render. That's expected, not a bug: the mismatch is resolved
            // before the fly-in animation itself ever starts (gated on
            // loadingComplete, well after hydration), so nothing visible
            // is ever inconsistent.
            suppressHydrationWarning
            initial={
              reduceMotion || !useElaborateEntrance
                ? { opacity: 0 }
                : { opacity: 0, ...flyInOffset }
            }
            animate={
              loadingComplete
                ? { opacity: 1, ...flyInRest }
                : reduceMotion || !useElaborateEntrance
                  ? { opacity: 0 }
                  : { opacity: 0, ...flyInOffset }
            }
            transition={{ duration: useElaborateEntrance ? 2.2 : 0.5, ease: EASE_OUT_EXPO }}
          >
            <button
              type="button"
              onClick={() => selectIcon(index)}
              aria-pressed={selected === index}
              data-selected={selected === index || undefined}
              className={styles.iconButton}
            >
              <span data-hint-icon className={styles.hintTarget}>
                <Icon size={iconSize} weight={isDark ? "fill" : "regular"} />
              </span>
            </button>

            {!isTablet && (
              // Centered against *this* icon directly via CSS (top: 50% +
              // translateY(-50%) relative to this row), instead of a single
              // shared caption whose position had to be computed in JS from
              // every icon's size/gap — that math drifts out of sync the
              // moment spacing changes; this can't drift because there's
              // nothing to keep in sync.
              <div
                className="absolute left-full"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  paddingLeft: "var(--spacing-page-x)",
                  width: "max-content",
                  maxWidth: `calc(100vw - ${ICON_SIZE_MOBILE}px - (2 * var(--spacing-page-x)))`,
                }}
              >
                <AnimatePresence initial={false}>
                  {selected === index && (
                    <motion.p
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                      transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                      className="font-sans font-medium text-caption leading-6 text-content-primary"
                    >
                      <CaptionText active={items[index]} />
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {isTablet && (
        <div className="h-6 w-full">
          <AnimatePresence mode="wait" initial={false}>
            {active && (
              <motion.p
                key={selected}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                style={{ textAlign: align }}
                className="font-sans font-medium text-caption leading-6 text-content-primary"
              >
                <CaptionText active={active} />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
