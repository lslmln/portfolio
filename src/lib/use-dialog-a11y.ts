"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared behavior for full-screen overlay dialogs (image lightbox, passcode
// modal, mobile nav menu): Escape closes, Tab loops within the dialog
// instead of leaking focus into the page behind it, and focus returns to
// whatever triggered the dialog once it closes. Attach the returned ref to
// the outermost dialog element (the one that should carry role="dialog").
export function useDialogA11y<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const dialogRef = useRef<T>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    // Plain `overflow: hidden` on body doesn't reliably block touch-scroll
    // on iOS Safari — pinning the body in place with `position: fixed` (and
    // restoring the scroll offset on close) is the part that actually works
    // there, not just on desktop.
    const scrollY = window.scrollY;
    const body = document.body;
    const previousBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    triggerRef.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    // Prefer an element the caller explicitly marked with `autofocus` (e.g.
    // the passcode input) over just grabbing the first focusable element —
    // relevant now that a dialog's first focusable element (a leading close
    // button) isn't necessarily the one that should actually receive focus.
    const autoFocusTarget = dialog?.querySelector<HTMLElement>("[autofocus]");
    (autoFocusTarget ?? focusable?.[0])?.focus();

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
      body.style.position = previousBodyStyle.position;
      body.style.top = previousBodyStyle.top;
      body.style.width = previousBodyStyle.width;
      body.style.overflow = previousBodyStyle.overflow;
      window.scrollTo(0, scrollY);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
    // onClose intentionally omitted — callers pass a fresh function each
    // render; re-running this effect on every render would re-steal focus
    // to the first focusable element on every keystroke inside the dialog.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return dialogRef;
}
