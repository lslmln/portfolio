"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useLoadingComplete } from "@/lib/loading-complete";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

export function CrossfadeReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const loadingComplete = useLoadingComplete();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: loadingComplete ? 1 : 0 }}
      transition={{ duration: 1.8, delay: loadingComplete ? 0.6 : 0, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
