"use client";

import { useReducedMotion } from "framer-motion";
import { useMediaLoaded } from "@/lib/use-media-loaded";
import { MediaError } from "./media-error";

export function DemoVideo({
  src,
  background = "bg-scrim",
}: {
  src: string;
  // Letterboxing color shown around the video when its aspect ratio
  // doesn't match the card — a Tailwind bg-* class. Defaults to the
  // scrim so most videos blend into an intentionally dark frame.
  background?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { loaded, error, onLoad, onError } = useMediaLoaded();

  return (
    <div className={`relative aspect-card w-full overflow-hidden rounded-card ${background}`}>
      <video
        src={src}
        controls
        muted
        loop
        playsInline
        autoPlay={!reduceMotion}
        onLoadedData={onLoad}
        onError={onError}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out ${loaded && !error ? "opacity-100" : "opacity-0"}`}
      />
      {error && <MediaError />}
    </div>
  );
}
