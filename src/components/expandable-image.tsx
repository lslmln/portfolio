"use client";

import { CornersOutIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./expandable-image.module.css";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaLoaded } from "@/lib/use-media-loaded";
import { useMediaQuery } from "@/lib/use-media-query";
import { MediaError } from "./media-error";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;
const ZOOM_SCALE = 2;
// Below this, a click toggles zoom is ambiguous with a tap-to-scroll — pinch
// takes over instead, matching the site's existing desktop-only-hover gate.
const DESKTOP_QUERY = "(hover: hover) and (pointer: fine) and (min-width: 1024px)";
// Minimum finger-spread change (px) before a pinch counts as a zoom gesture,
// so small tremor while panning with two fingers doesn't false-trigger it.
const PINCH_THRESHOLD = 40;

function touchDistance(touches: React.TouchList) {
  const [a, b] = [touches[0], touches[1]];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

const badgeButtonClassName =
  "group flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-modal-button-bg/50 p-2 backdrop-blur-sm transition-[opacity,transform] duration-150 hover:bg-modal-button-bg-hover active:scale-[0.97]";
const badgeIconClassName = "text-modal-button-bg-hover group-hover:text-modal-button-bg";

export function ExpandableImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const isDark = useIsDark();
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const { loaded, error, onLoad, onError } = useMediaLoaded();
  // The modal image can render before the thumbnail's own onLoad has fired
  // (e.g. clicking Expand immediately) — track its load separately so it
  // still gets a fade-in rather than popping in opaque, but keep sharing
  // `error`: if the source is broken, no point re-attempting a bigger copy.
  const [modalLoaded, setModalLoaded] = useState(false);
  const dialogRef = useDialogA11y<HTMLDivElement>(expanded, close);
  const panelRef = useRef<HTMLDivElement>(null);
  const pinchStartDistance = useRef<number | null>(null);
  // Framer's ref-based dragConstraints re-measures panelRef vs. the draggable
  // element's *current* (transform-inclusive) box, which in practice came
  // back as a zero-size range here — computing the pannable bounds ourselves
  // from the fit-size box (panelRef's layout size never changes with scale,
  // since transforms don't affect layout) sidesteps that entirely.
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  useEffect(() => {
    if (!expanded || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const dx = (rect.width * (ZOOM_SCALE - 1)) / 2;
    const dy = (rect.height * (ZOOM_SCALE - 1)) / 2;
    setDragBounds({ left: -dx, right: dx, top: -dy, bottom: dy });
  }, [expanded]);

  function close() {
    setExpanded(false);
    setZoomed(false);
    pinchStartDistance.current = null;
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      pinchStartDistance.current = touchDistance(event.touches);
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (event.touches.length !== 2 || pinchStartDistance.current === null) return;
    const delta = touchDistance(event.touches) - pinchStartDistance.current;
    if (delta > PINCH_THRESHOLD && !zoomed) {
      setZoomed(true);
      pinchStartDistance.current = null;
    } else if (delta < -PINCH_THRESHOLD && zoomed) {
      setZoomed(false);
      pinchStartDistance.current = null;
    }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (event.touches.length < 2) {
      pinchStartDistance.current = null;
    }
  }

  return (
    <>
      <div className={`relative ${className ?? ""}`}>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Expand image: ${alt}`}
          className={`${styles.imageWrapper} relative w-full cursor-pointer bg-content-secondary/15`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            onLoad={onLoad}
            onError={onError}
            className={`h-auto w-full transition-opacity duration-300 ease-out ${loaded && !error ? "opacity-100" : "opacity-0"}`}
          />
          {error && <MediaError />}
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Expanded image: ${alt}`}
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
              ref={panelRef}
              variants={panelVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              animate="visible"
              exit={reduceMotion ? "visible" : "exit"}
              onClick={(event) => event.stopPropagation()}
              style={{ touchAction: "none" }}
              className="relative inline-flex max-h-full max-w-full items-center justify-center overflow-hidden"
            >
              {error ? (
                <div className="relative flex h-[40vh] w-[40vh] items-center justify-center">
                  <MediaError />
                </div>
              ) : (
                <motion.div
                  animate={{
                    scale: zoomed ? ZOOM_SCALE : 1,
                    x: zoomed ? undefined : 0,
                    y: zoomed ? undefined : 0,
                  }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT_EXPO }}
                  drag={zoomed}
                  dragConstraints={dragBounds}
                  dragElastic={0.05}
                  onTap={isDesktop ? () => setZoomed((current) => !current) : undefined}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`inline-flex ${
                    zoomed
                      ? "cursor-grab active:cursor-grabbing"
                      : isDesktop
                        ? "cursor-zoom-in"
                        : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    sizes="100vw"
                    draggable={false}
                    onLoad={() => setModalLoaded(true)}
                    onError={onError}
                    className={`max-h-[85vh] w-auto max-w-full select-none rounded-card object-contain transition-opacity duration-300 ease-out ${modalLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
