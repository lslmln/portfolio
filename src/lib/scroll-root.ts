// Below this width, html/body are pinned via CSS (globals.css) and
// #scroll-root (layout.tsx) becomes the real scrolling element instead of
// the document — the fixed-shell technique for suppressing iOS Safari's
// native rubber-band bounce, which overscroll-behavior alone doesn't
// reliably suppress there. Every scroll-position read/write in the app has
// to target whichever element is actually scrolling at the current
// viewport width, hence the helpers below. Keep in sync with globals.css's
// matching `(max-width: 767.98px)` block.
export const MOBILE_QUERY = "(max-width: 767.98px)";

function isMobileScrollRoot() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

function scrollRootEl() {
  return document.getElementById("scroll-root");
}

export function scrollToTop(top: number, behavior: ScrollBehavior = "auto") {
  if (isMobileScrollRoot()) {
    scrollRootEl()?.scrollTo({ top, behavior });
    return;
  }
  window.scrollTo({ top, behavior });
}

// Locks whichever element is currently scrolling (for a full-screen dialog)
// and returns a function that restores it. On mobile, #scroll-root is
// already permanently pinned in place by CSS, so locking it is just an
// overflow toggle with no scroll-position bookkeeping needed. At tablet+,
// this is the same position:fixed + top-offset trick as before, since the
// document itself is still the real scroller there.
export function lockScroll(): () => void {
  if (isMobileScrollRoot()) {
    const el = scrollRootEl();
    const previousOverflow = el?.style.overflow ?? "";
    if (el) el.style.overflow = "hidden";
    return () => {
      if (el) el.style.overflow = previousOverflow;
    };
  }

  const scrollY = window.scrollY;
  const body = document.body;
  const previous = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overflow: body.style.overflow,
  };
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.width = "100%";
  body.style.overflow = "hidden";
  return () => {
    body.style.position = previous.position;
    body.style.top = previous.top;
    body.style.width = previous.width;
    body.style.overflow = previous.overflow;
    window.scrollTo(0, scrollY);
  };
}
