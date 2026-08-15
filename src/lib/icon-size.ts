export const ICON_SIZE_LG = 120;
// Homepage icon row only, at the tablet breakpoint only — between
// ICON_SIZE_MOBILE and ICON_SIZE_LG, since neither fits well at tablet
// widths (LG is too wide for 5-across, MOBILE reads too small once the
// row switches from stacked to inline).
export const ICON_SIZE_TABLET = 96;
export const ICON_SIZE_MOBILE = 72;
export const ICON_SIZE_SM = 32;
export const ICON_SIZE_FOOTER = 24;

// Must stay in sync with --spacing-page-x in globals.css (the gap between icons on tablet/desktop/large).
export const ICON_ROW_GAP = 32;

const ICON_COUNT = 5;

// Full pixel width of the 5-icon row at the given icon size, used to keep
// the row's right edge at least --spacing-page-x from the viewport edge —
// a function rather than a constant since the icon row now renders at a
// different size per breakpoint (mobile/tablet/desktop).
export function iconRowWidth(iconSize: number): number {
  return ICON_COUNT * iconSize + (ICON_COUNT - 1) * ICON_ROW_GAP;
}
