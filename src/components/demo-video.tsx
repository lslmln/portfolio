"use client";

import { useReducedMotion } from "framer-motion";
import { useMediaLoaded } from "@/lib/use-media-loaded";

export function DemoVideo({ src }: { src: string }) {
  const reduceMotion = useReducedMotion();
  const { loaded, onLoad } = useMediaLoaded();

  return (
    <div className="relative aspect-card w-full overflow-hidden rounded-card bg-scrim">
      <video
        src={src}
        controls
        muted
        loop
        playsInline
        autoPlay={!reduceMotion}
        onLoadedData={onLoad}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
