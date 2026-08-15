"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";

export function ScrollCue() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const isDark = useIsDark();

  useEffect(() => {
    function handleScroll() {
      // While a modal is open, useDialogA11y pins body via `position: fixed`
      // (preserving the real scroll offset separately, in a negative `top`)
      // — window.scrollY reads as 0 the whole time regardless of where the
      // page actually was, which would otherwise make this think it's back
      // at the top and reappear behind the modal's blur.
      if (document.body.style.position === "fixed") return;
      setVisible(window.scrollY <= 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-text-icon"
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : reduceMotion ? 0 : -6 }}
      transition={{ type: "spring", duration: 0.25, bounce: 0 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={!visible}
    >
      <span className="font-sans font-medium text-nav text-content-primary">
        Scroll
      </span>
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 0.5,
                ease: [0.19, 1, 0.22, 1],
                repeat: Infinity,
                repeatDelay: 3.5,
                delay: 1.5,
              }
        }
        className="text-content-primary"
      >
        <ArrowDownIcon size={ICON_SIZE_SM} weight={isDark ? "fill" : "regular"} />
      </motion.div>
    </motion.div>
  );
}
