"use client";

import Image from "next/image";
import { useIsDark } from "@/lib/use-is-dark";

export function WorkHeroImage({
  image,
  imageDark,
  alt,
}: {
  image: string;
  imageDark?: string;
  alt: string;
}) {
  const isDark = useIsDark();

  return (
    <Image
      src={isDark && imageDark ? imageDark : image}
      alt={alt}
      fill
      sizes="(min-width: 768px) 25vw, 100vw"
      className="object-cover"
    />
  );
}
