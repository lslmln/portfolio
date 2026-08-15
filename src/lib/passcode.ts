// Session-scoped, not persistent — clears on a fresh tab/session, survives
// reloads within the tab. A single shared passcode gates every locked case
// study (see verify-passcode.ts), so entering it once unlocks all of them.
export const PASSCODE_VERIFIED_KEY = "portfolio-passcode-verified";
