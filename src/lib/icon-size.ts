export const ICON_SIZE_LG = 120;
export const ICON_SIZE_MOBILE = 72;
export const ICON_SIZE_SM = 32;
export const ICON_SIZE_FOOTER = 24;

// Must stay in sync with --spacing-page-x in globals.css (the gap between icons on tablet/desktop/large).
export const ICON_ROW_GAP = 32;

// Vertical gap between stacked icons on mobile. Matches --spacing-page-y's mobile
// value (<768px) in globals.css — currently 16px, NOT the 24px desktop/tablet value.
// This can't read the CSS variable directly (it's plain positioning math, not CSS),
// so if the mobile override for --spacing-page-y ever changes, update this too.
export const ICON_GAP_MOBILE = 16;

const ICON_COUNT = 5;

// Full pixel width of the 5-icon row at ICON_SIZE_LG, used to keep the row's
// right edge at least --spacing-page-x from the viewport edge on tablet/desktop/large.
export const ICON_ROW_WIDTH = ICON_COUNT * ICON_SIZE_LG + (ICON_COUNT - 1) * ICON_ROW_GAP;
