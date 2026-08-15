"use client";

import { ArrowRightIcon, CircleNotchIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { useIsDark } from "@/lib/use-is-dark";
import { verifyPasscode } from "@/lib/verify-passcode";

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

export function PasscodeModal({
  open,
  onClose,
  onVerified,
  previewError,
  // False for a locked page opened directly by URL — see useDialogA11y's
  // autoFocus param for why the input shouldn't visibly select itself when
  // there's no real tap behind this open to raise the keyboard anyway.
  autoFocusInput = true,
}: {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  // Dev-only: lets a caller preview the error state without actually
  // entering a wrong passcode.
  previewError?: string;
  autoFocusInput?: boolean;
}) {
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState<string | null>(previewError ?? null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = useIsDark();
  const reduceMotion = useReducedMotion();
  const dialogRef = useDialogA11y<HTMLDivElement>(open, onClose, { autoFocus: autoFocusInput });
  // Portalled straight to <body> — otherwise this renders inside
  // RouteTransition's page-content wrapper, which fades in from opacity 0
  // on every cold load. Nested inside that fade, the backdrop blur and
  // scrim would fade in right along with it: a low-opacity blur barely
  // blurs anything, so the page shows through as a soft "glow" until the
  // fade finishes. Escaping to <body> keeps this fully opaque and formed
  // from the first frame regardless of what the page underneath is doing.
  // document isn't available during SSR, hence the mount gate.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Reads real DOM state (document.body) that's only available client-side
    // — has to happen post-mount, not via a lazy initializer, or the
    // client's first render would mismatch the server's.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function clearSpinnerTimer() {
    if (spinnerTimerRef.current) {
      clearTimeout(spinnerTimerRef.current);
      spinnerTimerRef.current = null;
    }
  }

  async function handleSubmitPasscode() {
    if (!passcodeInput.trim() || isVerifying) return;
    setIsVerifying(true);
    setPasscodeError(null);
    spinnerTimerRef.current = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    try {
      const isCorrect = await withTimeout(verifyPasscode(passcodeInput), VERIFY_TIMEOUT_MS);
      clearSpinnerTimer();
      if (isCorrect) {
        onVerified();
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Enter password"
          tabIndex={-1}
          variants={backdropVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          exit={reduceMotion ? "visible" : "exit"}
          onClick={onClose}
          className={`fixed inset-0 z-scrim flex flex-col items-stretch justify-start backdrop-blur-lg desktop:flex-row desktop:items-center desktop:justify-center desktop:px-8 ${isDark ? "bg-scrim/50" : "bg-scrim/75"}`}
        >
          <div className="flex justify-end px-page-x py-page-y desktop:p-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer transition-transform duration-150 active:scale-[0.97] desktop:absolute desktop:right-page-x desktop:top-page-y"
            >
              <XIcon size={ICON_SIZE_SM} weight="regular" className="text-white" />
            </button>
          </div>
          <motion.div
            variants={panelVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto flex w-full max-w-[430px] flex-col desktop:block"
          >
            <div className="grid max-w-full grid-cols-1 gap-card-text-gap px-page-x py-page-y desktop:px-0 desktop:py-0">
              <p className="font-sans font-medium text-body text-white">Enter password</p>
              <div className="flex items-center gap-card-text-gap">
                <input
                  type="password"
                  autoFocus
                  data-autofocus
                  value={passcodeInput}
                  onChange={(event) => {
                    setPasscodeInput(event.target.value);
                    setPasscodeError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSubmitPasscode();
                  }}
                  className="h-input-height w-full min-w-0 rounded-card border-2 border-white bg-transparent px-3 font-sans font-medium text-body text-white outline-none focus:border-modal-focus"
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
