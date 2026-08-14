"use client";

import Image from "next/image";
import { useState } from "react";
import { useIsDark } from "@/lib/use-is-dark";
import { MediaError } from "./media-error";

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
  const [error, setError] = useState(false);

  // No fade-in gate here, unlike other media on the site: this is always
  // the LCP element on a work-detail page. Chrome excludes opacity:0
  // elements from LCP candidacy until they become visible, so a JS-driven
  // fade would push the measured LCP later than the image actually paints
  // — priority + immediate opacity gets it counted as soon as it arrives.
  return (
    <div className="relative w-full rounded-card bg-content-secondary/15" style={{ aspectRatio: `${width} / ${height}` }}>
      <Image
        src={isDark && imageDark ? imageDark : image}
        alt={alt}
        width={width}
        height={height}
        priority
        sizes="(min-width: 768px) 25vw, 100vw"
        onError={() => setError(true)}
        className={`h-auto w-full rounded-card ${error ? "opacity-0" : ""}`}
      />
      {error && <MediaError />}
    </div>
  );
}
