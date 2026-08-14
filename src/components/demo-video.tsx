"use client";

import { useReducedMotion } from "framer-motion";

export function DemoVideo({ src }: { src: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative aspect-card w-full overflow-hidden rounded-card bg-scrim">
      <video
        src={src}
        controls
        muted
        loop
        playsInline
        autoPlay={!reduceMotion}
        className="absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
