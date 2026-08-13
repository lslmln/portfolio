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
import {
  ICON_GAP_MOBILE,
  ICON_ROW_WIDTH,
  ICON_SIZE_LG,
  ICON_SIZE_MOBILE,
} from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";
import styles from "./icon-row.module.css";

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

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setSelected(null);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const align = selected === null ? "left" : alignmentForIndex(selected);
  const active = selected === null ? null : items[selected];
  const iconSize = isTablet ? ICON_SIZE_LG : ICON_SIZE_MOBILE;
  const mobileCaptionTop =
    selected !== null ? selected * (ICON_SIZE_MOBILE + ICON_GAP_MOBILE) + ICON_SIZE_MOBILE / 2 : 0;

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} tablet:flex tablet:flex-col tablet:items-stretch tablet:gap-page-y`}
      style={{ "--icon-row-half-width": `${ICON_ROW_WIDTH / 2}px` } as React.CSSProperties}
    >
      <div
        ref={scope}
        className="relative flex flex-col items-center gap-page-y tablet:flex-row tablet:gap-page-x"
      >
        {items.map(({ Icon }, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelected(index)}
            aria-pressed={selected === index}
            data-selected={selected === index || undefined}
            className={styles.iconButton}
          >
            <span data-hint-icon className={styles.hintTarget}>
              <Icon size={iconSize} weight={isDark ? "fill" : "regular"} />
            </span>
          </button>
        ))}

        {!isTablet && (
          <div
            className="absolute left-full"
            style={{
              top: mobileCaptionTop,
              transform: "translateY(-50%)",
              paddingLeft: "var(--spacing-page-x)",
              width: "max-content",
              maxWidth: `calc(100vw - ${ICON_SIZE_MOBILE}px - (2 * var(--spacing-page-x)))`,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {active && (
                <motion.p
                  key={selected}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                  className="font-sans font-medium text-caption leading-6 text-content-primary"
                >
                  <CaptionText active={active} />
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
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
