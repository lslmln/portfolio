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
import { useEffect, useRef, useState } from "react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaLoaded } from "@/lib/use-media-loaded";
import { verifyPasscode } from "@/lib/verify-passcode";
import { workProjects, type WorkProject } from "@/lib/work-projects";
import { MediaError } from "./media-error";
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
// The passcode check is a Server Action (a network round-trip) — without a
// client-side cutoff, a dropped connection or slow server leaves the button
// spinning with no way to retry, since nothing else would ever flip
// isVerifying back off.
const VERIFY_TIMEOUT_MS = 8000;
// A wrong password almost always comes back well under this — showing the
// spinner immediately would just flash it on and off for a moment, which
// reads as a glitch rather than useful feedback. Only a check that's
// genuinely still pending after this long actually shows one.
const SPINNER_DELAY_MS = 200;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("verify-passcode-timeout")), ms)),
  ]);
}

function CardImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const { loaded, error, onLoad, onError } = useMediaLoaded(src);
  // The priority card is the page's likely LCP element — skip the fade
  // gate for it too, same reasoning as WorkHeroImage.
  const visible = priority || loaded;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={priority}
        onLoad={onLoad}
        onError={onError}
        className={`${styles.image} transition-opacity duration-300 ease-out ${visible && !error ? "opacity-100" : "opacity-0"}`}
      />
      {error && <MediaError />}
    </>
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
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Starts false on both server and client to avoid a hydration mismatch
  // (sessionStorage isn't available during SSR) — synced from sessionStorage
  // in the effect below immediately after mount, same pattern Navbar uses
  // for isDark.
  const [unlocked, setUnlocked] = useState(false);
  const isDark = useIsDark();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const dialogRef = useDialogA11y<HTMLDivElement>(unlockingSlug !== null, closePasscode);

  useEffect(() => {
    // sessionStorage is unavailable during SSR — has to be read post-mount,
    // not via a lazy initializer, or the client's first render would
    // mismatch the server's (see the comment on `unlocked`'s declaration).
    if (sessionStorage.getItem(PASSCODE_VERIFIED_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlocked(true);
    }
  }, []);

  const unlockingCard = items.find((item) => item.slug === unlockingSlug);

  function clearSpinnerTimer() {
    if (spinnerTimerRef.current) {
      clearTimeout(spinnerTimerRef.current);
      spinnerTimerRef.current = null;
    }
  }

  function closePasscode() {
    clearSpinnerTimer();
    setUnlockingSlug(null);
    setPasscodeInput("");
    setPasscodeError(null);
    setIsVerifying(false);
    setShowSpinner(false);
  }

  async function handleSubmitPasscode() {
    if (!unlockingCard || !passcodeInput.trim() || isVerifying) return;
    setIsVerifying(true);
    setPasscodeError(null);
    spinnerTimerRef.current = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    try {
      const isCorrect = await withTimeout(verifyPasscode(passcodeInput), VERIFY_TIMEOUT_MS);
      clearSpinnerTimer();
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
        setPasscodeError("Incorrect password. Try again.");
        setIsVerifying(false);
        setShowSpinner(false);
      }
    } catch {
      clearSpinnerTimer();
      setPasscodeError("Something went wrong. Try again.");
      setIsVerifying(false);
      setShowSpinner(false);
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
        {items.map((card, index) => {
          const cardBody = (
            <>
              <div
                className={`${styles.imageWrapper} aspect-card w-full rounded-card bg-content-secondary/15`}
              >
                <CardImage
                  src={isDark && card.imageDark ? card.imageDark : card.image}
                  alt={card.title}
                  priority={firstOnPage && index === 0}
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
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() => {
            const lockedCard = items.find((item) => item.locked);
            if (!lockedCard) return;
            setUnlockingSlug(lockedCard.slug);
            setIsVerifying(false);
            setPasscodeError("Something went wrong. Try again.");
          }}
          className="fixed bottom-4 left-[430px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
        >
          Preview passcode error
        </button>
      )}
      <AnimatePresence>
        {unlockingCard && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Enter password"
            variants={backdropVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            onClick={closePasscode}
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
              onClick={(event) => event.stopPropagation()}
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
                    setPasscodeError(null);
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
                  {showSpinner ? (
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
                {passcodeError || "Incorrect password. Try again."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
