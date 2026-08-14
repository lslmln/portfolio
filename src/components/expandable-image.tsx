"use client";

import { CornersOutIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import styles from "./expandable-image.module.css";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useIsDark } from "@/lib/use-is-dark";

const badgeButtonClassName =
  "group flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-modal-button-bg/50 p-2 backdrop-blur-sm transition-[opacity,transform] duration-150 hover:bg-modal-button-bg-hover active:scale-[0.97]";
const badgeIconClassName = "text-modal-button-bg-hover group-hover:text-modal-button-bg";

export function ExpandableImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const isDark = useIsDark();
  const reduceMotion = useReducedMotion();

  function close() {
    setExpanded(false);
    setZoomed(false);
  }

  return (
    <>
      <div className={`relative ${className ?? ""}`}>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Expand image: ${alt}`}
          className={`${styles.imageWrapper} w-full cursor-pointer`}
        >
          <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expand image"
          className={`${badgeButtonClassName} absolute bottom-2 right-2 tablet:bottom-4 tablet:right-4`}
        >
          <CornersOutIcon size={ICON_SIZE_SM} weight="fill" className={badgeIconClassName} />
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={backdropVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            onClick={close}
            className={`fixed inset-0 z-scrim flex items-center justify-center px-8 py-page-y backdrop-blur-lg ${isDark ? "bg-scrim/50" : "bg-scrim/75"}`}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-page-x top-page-y cursor-pointer transition-transform duration-150 active:scale-[0.97]"
            >
              <XIcon size={ICON_SIZE_SM} weight="regular" className="text-on-scrim" />
            </button>
            <motion.div
              variants={panelVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              animate="visible"
              exit={reduceMotion ? "visible" : "exit"}
              onClick={(event) => event.stopPropagation()}
              className={`max-h-full max-w-full ${zoomed ? "overflow-auto" : ""}`}
            >
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                onClick={() => setZoomed((current) => !current)}
                className={
                  zoomed
                    ? "h-auto w-auto max-w-none cursor-zoom-out rounded-card"
                    : "max-h-[85vh] w-auto max-w-full cursor-zoom-in rounded-card object-contain"
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
