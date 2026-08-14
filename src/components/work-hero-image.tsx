"use client";

import Image from "next/image";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaLoaded } from "@/lib/use-media-loaded";

export function WorkHeroImage({
  image,
  imageDark,
  alt,
  width,
  height,
}: {
  image: string;
  imageDark?: string;
  alt: string;
  width: number;
  height: number;
}) {
  const isDark = useIsDark();
  const { loaded, onLoad } = useMediaLoaded();

  return (
    <div className="w-full rounded-card bg-content-secondary/15">
      <Image
        src={isDark && imageDark ? imageDark : image}
        alt={alt}
        width={width}
        height={height}
        onLoad={onLoad}
        className={`h-auto w-full rounded-card transition-opacity duration-300 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
