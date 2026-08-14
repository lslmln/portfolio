"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useIntroPlayed, useLoadingComplete } from "@/lib/loading-complete";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export function CrossfadeReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const loadingComplete = useLoadingComplete();
  const introPlayed = useIntroPlayed();
  // See the matching comment in icon-row.tsx: loadingComplete/introPlayed
  // are sticky for the whole session, but this component (used for the
  // homepage tagline as well as the persistent navbar) can remount on
  // client-side navigation back to home — only the true first mount should
  // get the elaborate delayed reveal.
  const [mountedAfterLoad] = useState(() => loadingComplete);
  const useElaborateEntrance = introPlayed && !mountedAfterLoad;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: loadingComplete ? 1 : 0 }}
      transition={{
        duration: useElaborateEntrance ? 1.8 : 0.5,
        delay: loadingComplete && useElaborateEntrance ? 0.6 : 0,
        ease: EASE_OUT_EXPO,
      }}
    >
      {children}
    </motion.div>
  );
}
