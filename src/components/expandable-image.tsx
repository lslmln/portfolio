"use client";

import { CornersOutIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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
  const lastDragEndRef = useRef(0);
  // Last single-finger touch position while panning — null whenever there's
  // no finger down to track (so a fresh touchstart always re-anchors
  // instead of jumping from a stale previous position).
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  // Framer's ref-based dragConstraints re-measures panelRef vs. the draggable
  // element's *current* (transform-inclusive) box, which in practice came
  // back as a zero-size range here — computing the pannable bounds ourselves
  // from the fit-size box (panelRef's layout size never changes with scale,
  // since transforms don't affect layout) sidesteps that entirely.
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  // Shared by both panning paths: on desktop, Framer's own `drag` reads and
  // writes these directly (passed via `style`, the documented pattern for a
  // drag target backed by external motion values); on touch, the handlers
  // below update them by hand instead, since Framer's built-in drag gesture
  // isn't built to coexist with a second touch point on the same element —
  // a pinch that hands off to a single remaining finger was losing pan
  // tracking entirely rather than picking the gesture back up.
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  useEffect(() => {
    // Re-measures once the modal's own (full-res) image actually finishes
    // loading, not just when the dialog opens — panelRef's rect is 0x0 at
    // that instant (the image hasn't decoded yet), which permanently
    // clamped every pan to zero for the rest of the session since this
    // effect never re-ran afterward.
    if (!expanded || !modalLoaded || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const dx = (rect.width * (ZOOM_SCALE - 1)) / 2;
    const dy = (rect.height * (ZOOM_SCALE - 1)) / 2;
    setDragBounds({ left: -dx, right: dx, top: -dy, bottom: dy });
  }, [expanded, modalLoaded]);

  useEffect(() => {
    if (zoomed) return;
    panX.set(0);
    panY.set(0);
  }, [zoomed, panX, panY]);

  function close() {
    setExpanded(false);
    setZoomed(false);
    pinchStartDistance.current = null;
    lastTouchRef.current = null;
  }

  function handleTouchStart(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      pinchStartDistance.current = touchDistance(event.touches);
      lastTouchRef.current = null;
    } else if (event.touches.length === 1 && zoomed) {
      const touch = event.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (event.touches.length === 2) {
      if (pinchStartDistance.current === null) return;
      const delta = touchDistance(event.touches) - pinchStartDistance.current;
      if (delta > PINCH_THRESHOLD && !zoomed) {
        setZoomed(true);
        pinchStartDistance.current = null;
      } else if (delta < -PINCH_THRESHOLD && zoomed) {
        setZoomed(false);
        pinchStartDistance.current = null;
      }
      return;
    }

    if (event.touches.length === 1 && zoomed && lastTouchRef.current) {
      const touch = event.touches[0];
      const dx = touch.clientX - lastTouchRef.current.x;
      const dy = touch.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      panX.set(clamp(panX.get() + dx, dragBounds.left, dragBounds.right));
      panY.set(clamp(panY.get() + dy, dragBounds.top, dragBounds.bottom));
    }
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (event.touches.length < 2) {
      pinchStartDistance.current = null;
    }
    if (event.touches.length === 0) {
      lastTouchRef.current = null;
    } else if (event.touches.length === 1 && zoomed) {
      // A finger was lifted out of a two-finger gesture — re-anchor to the
      // one still down instead of using its old (now-stale) position.
      const touch = event.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
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
              className="absolute right-page-x top-page-y z-10 cursor-pointer transition-transform duration-150 active:scale-[0.97]"
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
                  style={{ touchAction: "none", x: panX, y: panY }}
                  animate={{ scale: zoomed ? ZOOM_SCALE : 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT_EXPO }}
                  // Desktop only, and not just the `drag` boolean — Framer's
                  // own gesture recognizer can still intercept real touch
                  // events on mobile/tablet even with drag={false} as long as
                  // dragConstraints/dragElastic/onDragEnd are present, since
                  // it doesn't know a gesture won't turn into a drag until
                  // after it's already started listening. Touch panning is
                  // handled entirely by hand in the touch handlers below
                  // instead, updating the same two motion values — omitting
                  // these props outside of isDesktop keeps Framer from ever
                  // getting a chance to compete with them for the same
                  // touch stream.
                  {...(isDesktop
                    ? {
                        drag: zoomed,
                        dragConstraints: dragBounds,
                        dragElastic: 0.05,
                        onDragEnd: () => {
                          lastDragEndRef.current = Date.now();
                        },
                        onTap: () => {
                          // A pan that ends right under the cursor can still
                          // read as a "tap" to Framer's gesture recognizer —
                          // this stops that from also toggling zoom back off
                          // mid-drag.
                          if (Date.now() - lastDragEndRef.current < 100) return;
                          setZoomed((current) => !current);
                        },
                      }
                    : {})}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`inline-flex ${
                    !modalLoaded
                      ? "h-[40vh] w-[40vh] rounded-card bg-content-secondary/15"
                      : zoomed
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
