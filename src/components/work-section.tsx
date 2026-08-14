"use client";

import {
  ArrowRightIcon,
  CircleNotchIcon,
  LockIcon,
  LockOpenIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaLoaded } from "@/lib/use-media-loaded";
import { verifyPasscode } from "@/lib/verify-passcode";
import { workProjects, type WorkProject } from "@/lib/work-projects";
import { COVER_DURATION, useNavigate } from "./route-transition";
import { Seam } from "./seam";
import { TransitionLink } from "./transition-link";
import styles from "./work-section.module.css";

// Session-scoped, not persistent — matches the loading-screen intro's own
// "seen" flag: survives reloads within the tab, clears on a fresh
// tab/session. Once verified, every locked card unlocks, not just the one
// the user typed the passcode for — a single shared passcode gates all of
// them today (see verify-passcode.ts), so there's only one thing to "know."
const PASSCODE_VERIFIED_KEY = "portfolio-passcode-verified";

function CardImage({ src, alt }: { src: string; alt: string }) {
  const { loaded, onLoad } = useMediaLoaded();

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      onLoad={onLoad}
      className={`${styles.image} transition-opacity duration-300 ease-out ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

export function WorkSection({
  firstOnPage = false,
  lastOnPage = false,
  heading = "WORK",
  items = workProjects,
}: {
  firstOnPage?: boolean;
  lastOnPage?: boolean;
  heading?: string;
  items?: readonly WorkProject[];
}) {
  const [unlockingSlug, setUnlockingSlug] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  // Starts false on both server and client to avoid a hydration mismatch
  // (sessionStorage isn't available during SSR) — synced from sessionStorage
  // in the effect below immediately after mount, same pattern Navbar uses
  // for isDark.
  const [unlocked, setUnlocked] = useState(false);
  const isDark = useIsDark();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem(PASSCODE_VERIFIED_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const unlockingCard = items.find((item) => item.slug === unlockingSlug);

  function closePasscode() {
    setUnlockingSlug(null);
    setPasscodeInput("");
    setPasscodeError(false);
    setIsVerifying(false);
  }

  async function handleSubmitPasscode() {
    if (!unlockingCard || !passcodeInput.trim() || isVerifying) return;
    setIsVerifying(true);
    const isCorrect = await verifyPasscode(passcodeInput);
    if (isCorrect) {
      sessionStorage.setItem(PASSCODE_VERIFIED_KEY, "1");
      setUnlocked(true);
      navigate(`/work/${unlockingCard.slug}`);
      // Don't pop the modal closed — let the page-level cover (which sits
      // above it) rise over it first, so it quietly disappears under the
      // same crossfade used for every other navigation instead of visibly
      // animating itself away right before the page covers anyway.
      setTimeout(closePasscode, reduceMotion ? 0 : COVER_DURATION * 1000);
    } else {
      setPasscodeError(true);
      setIsVerifying(false);
    }
  }

  return (
    <section
      className={`relative ${firstOnPage ? "" : "pt-section-gap"} ${lastOnPage ? "pb-section-end" : "pb-page-y"}`}
    >
      {!firstOnPage && <Seam />}
      {!firstOnPage && (
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {items.map((card) => {
          const cardBody = (
            <>
              <div
                className={`${styles.imageWrapper} aspect-card w-full rounded-card bg-content-secondary/15`}
              >
                <CardImage
                  src={isDark && card.imageDark ? card.imageDark : card.image}
                  alt={card.title}
                />
                {card.locked && (
                  <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-card bg-background-primary/50 p-1 backdrop-blur-sm tablet:bottom-4 tablet:right-4 tablet:p-2">
                    {unlocked ? (
                      <LockOpenIcon
                        size={ICON_SIZE_SM}
                        weight="fill"
                        className="icon-sm text-content-primary"
                      />
                    ) : (
                      <LockIcon
                        size={ICON_SIZE_SM}
                        weight="fill"
                        className="icon-sm text-content-primary"
                      />
                    )}
                  </div>
                )}
              </div>
              <p className="font-sans font-medium text-body text-content-primary">
                {card.title}
              </p>
            </>
          );

          if (card.locked && !unlocked) {
            return (
              <button
                key={card.slug}
                type="button"
                onClick={() => setUnlockingSlug(card.slug)}
                className={`${styles.card} flex flex-col gap-card-text-gap text-left tablet:col-span-6`}
              >
                {cardBody}
              </button>
            );
          }

          return (
            <TransitionLink
              key={card.slug}
              href={`/work/${card.slug}`}
              className={`${styles.card} flex flex-col gap-card-text-gap tablet:col-span-6`}
            >
              {cardBody}
            </TransitionLink>
          );
        })}
      </div>
      <AnimatePresence>
        {unlockingCard && (
          <motion.div
            variants={backdropVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            className={`fixed inset-0 z-scrim flex items-center justify-center px-8 backdrop-blur-lg ${isDark ? "bg-scrim/50" : "bg-scrim/75"}`}
          >
            <button
              type="button"
              onClick={closePasscode}
              aria-label="Close"
              className="absolute right-page-x top-page-y cursor-pointer transition-transform duration-150 active:scale-[0.97]"
            >
              <XIcon size={ICON_SIZE_SM} weight="regular" className="text-white" />
            </button>
            <motion.div
              variants={panelVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              animate="visible"
              exit={reduceMotion ? "visible" : "exit"}
              className="grid max-w-full grid-cols-1 gap-card-text-gap"
            >
              <p className="font-sans font-medium text-body text-white">Enter password</p>
              <div className="flex items-center gap-card-text-gap">
                <input
                  type="password"
                  autoFocus
                  value={passcodeInput}
                  onChange={(event) => {
                    setPasscodeInput(event.target.value);
                    setPasscodeError(false);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSubmitPasscode();
                  }}
                  className="h-input-height w-full min-w-0 rounded-card border-2 border-white bg-transparent px-3 font-sans font-medium text-body text-white focus:border-modal-focus"
                />
                <button
                  type="button"
                  onClick={handleSubmitPasscode}
                  disabled={!passcodeInput.trim() || isVerifying}
                  aria-label="Submit password"
                  className={`group flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-modal-button-bg/50 p-2 backdrop-blur-sm transition-[opacity,transform] duration-150 active:scale-[0.97] ${
                    passcodeInput.trim()
                      ? "opacity-100 hover:bg-modal-button-bg-hover"
                      : "pointer-events-none opacity-30"
                  }`}
                >
                  {isVerifying ? (
                    <CircleNotchIcon
                      size={20}
                      weight="bold"
                      className="animate-spin text-modal-button-bg-hover group-hover:text-modal-button-bg"
                    />
                  ) : (
                    <ArrowRightIcon
                      size={20}
                      weight="fill"
                      className="text-modal-button-bg-hover group-hover:text-modal-button-bg"
                    />
                  )}
                </button>
              </div>
              <p
                className={`font-sans font-medium text-nav text-danger ${passcodeError ? "visible" : "invisible"}`}
              >
                Incorrect password. Try again.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
