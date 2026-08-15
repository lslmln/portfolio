"use client";

import { useEffect, useRef } from "react";
import { lockScroll } from "./scroll-root";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared behavior for full-screen overlay dialogs (image lightbox, passcode
// modal, mobile nav menu): Escape closes, Tab loops within the dialog
// instead of leaking focus into the page behind it, and focus returns to
// whatever triggered the dialog once it closes. Attach the returned ref to
// the outermost dialog element (the one that should carry role="dialog").
export function useDialogA11y<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  // Set false when the caller knows this open isn't backed by a real user
  // gesture (e.g. the passcode modal auto-opening for a direct URL to a
  // locked page) — focusing the input there can't trigger the on-screen
  // keyboard anyway (iOS only raises it for a focus() called synchronously
  // inside an actual tap), so leaving it visibly focused just shows a
  // "selected" input the user can't type into without tapping it first.
  { autoFocus = true }: { autoFocus?: boolean } = {},
) {
  const dialogRef = useRef<T>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    const unlockScroll = lockScroll();

    triggerRef.current = document.activeElement;
    const dialog = dialogRef.current;
    if (autoFocus) {
      const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      // Prefer an element the caller explicitly marked via data-autofocus
      // (e.g. the passcode input) over just grabbing the first focusable
      // element — relevant now that a dialog's first focusable element (a
      // leading close button) isn't necessarily the one that should
      // actually receive focus. Deliberately not React's `autoFocus` prop /
      // the plain `autofocus` HTML attribute: React implements `autoFocus`
      // by calling .focus() directly rather than setting the DOM
      // attribute, so a querySelector("[autofocus]") here would always
      // find nothing and silently fall back to focusable[0] instead —
      // which, for the passcode modal, is the close button rendered before
      // the input, stealing focus right back off it a moment after React's
      // own autoFocus had already (correctly) put it there.
      const autoFocusTarget = dialog?.querySelector<HTMLElement>("[data-autofocus]");
      (autoFocusTarget ?? focusable?.[0])?.focus({ preventScroll: true });
    } else {
      // Still moves focus into the dialog (for screen readers / Tab
      // navigation) without visibly selecting any control inside it —
      // dialog itself has tabIndex={-1} so it's programmatically focusable
      // without joining the normal tab order.
      dialog?.focus({ preventScroll: true });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Blur whatever's still focused inside the dialog (the passcode
      // input, most often) before releasing the scroll lock below —
      // otherwise the on-screen keyboard's own closing animation and the
      // scroll-lock's own layout change land at the same instant while
      // the dialog is still fading out, reading as the keyboard flickering
      // and the background jumping instead of one clean settle.
      if (dialog && dialog.contains(document.activeElement)) {
        (document.activeElement as HTMLElement | null)?.blur();
      }
      unlockScroll();
      if (triggerRef.current instanceof HTMLElement) {
        // Without preventScroll, focus()'s default browser behavior scrolls
        // the trigger element into view — if the page had moved at all since
        // the dialog opened, closing it would jump the page to reveal
        // whatever originally triggered it, instead of staying put.
        triggerRef.current.focus({ preventScroll: true });
      }
    };
    // onClose intentionally omitted — callers pass a fresh function each
    // render; re-running this effect on every render would re-steal focus
    // to the first focusable element on every keystroke inside the dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return dialogRef;
}
