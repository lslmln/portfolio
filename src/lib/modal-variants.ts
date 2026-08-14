const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

// Shared entrance/exit motion for full-screen overlay modals (passcode
// prompt, mobile nav menu) — backdrop fades, panel scales up from 0.95 with
// a shorter, simpler exit than entrance.
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE_OUT_EXPO } },
};

export const panelVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: EASE_OUT_EXPO } },
};
