"use client";

import { useEffect } from "react";

// `overscroll-behavior-y: none` (globals.css, on html/body) doesn't reliably
// suppress the native rubber-band bounce on iOS Safari/Chrome (both WebKit) —
// a long-standing WebKit limitation. Left unblocked, overscrolling past the
// very top or bottom of the page briefly reveals body's background (a
// deliberately different color from the page — see the rounded-card
// "peek-through" corners in layout.tsx), which reads as content jumping.
// This blocks just the touchmove that would trigger that specific bounce;
// every other scroll gesture (including mid-page scrolling and the body
// scroll-lock in use-dialog-a11y.ts, which pins scrollTop/scrollHeight so
// both boundary checks below are already satisfied) is untouched.
export function PreventOverscrollBounce() {
  useEffect(() => {
    let startY = 0;

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      startY = event.touches[0].clientY;
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length !== 1) return;
      const doc = document.documentElement;
      const deltaY = event.touches[0].clientY - startY;
      const atTop = doc.scrollTop <= 0;
      const atBottom = doc.scrollTop + window.innerHeight >= doc.scrollHeight;

      // Dragging down while already at the top (deltaY > 0), or dragging up
      // while already at the bottom (deltaY < 0), is exactly the gesture
      // that triggers the boundary bounce — block only that.
      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        event.preventDefault();
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}
