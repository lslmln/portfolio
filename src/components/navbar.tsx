"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { HomeLink } from "./home-link";
import styles from "./navbar.module.css";
import { TransitionLink } from "./transition-link";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const dialogRef = useDialogA11y<HTMLDivElement>(mobileMenuOpen, () => setMobileMenuOpen(false));

  function toggleTheme() {
    const next = !isDark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  // The inline theme-init script (layout.tsx) already set data-theme before
  // hydration, based on the visitor's OS preference — this just syncs the
  // icon/label to match. Can't read it during the initial render itself
  // (server has no matchMedia), so this corrects it right after mount.
  useEffect(() => {
    // Reads real DOM state (already set by the inline theme-init script in
    // layout.tsx before hydration) — has to happen post-mount, not via a
    // lazy initializer, or the client's first render would mismatch the
    // server's.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.dataset.theme === "dark");
  }, []);

  const themeToggle = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={styles.moonButton}
    >
      {isDark ? (
        <>
          <SunIcon size={ICON_SIZE_SM} weight="regular" className={styles.moonRegular} />
          <SunIcon size={ICON_SIZE_SM} weight="fill" className={styles.moonFill} />
        </>
      ) : (
        <>
          <MoonIcon size={ICON_SIZE_SM} weight="regular" className={styles.moonRegular} />
          <MoonIcon size={ICON_SIZE_SM} weight="fill" className={styles.moonFill} />
        </>
      )}
    </button>
  );

  return (
    <nav
      ref={navRef}
      className="flex w-full items-center justify-between px-page-x py-page-y font-sans font-semibold text-nav text-content-primary"
    >
      <HomeLink />
      <div className="hidden items-center gap-page-y tablet:flex">
        <TransitionLink
          href="/about"
          data-selected={pathname === "/about" || undefined}
          className={styles.navLink}
        >
          About
        </TransitionLink>
        <TransitionLink
          href="/work"
          data-selected={pathname === "/work" || undefined}
          className={styles.navLink}
        >
          Work
        </TransitionLink>
        {themeToggle}
      </div>
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
        className={`${styles.hamburger} flex flex-col items-center gap-hamburger-gap tablet:hidden`}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            variants={backdropVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            onClick={() => setMobileMenuOpen(false)}
            className={`fixed inset-0 z-scrim flex items-center justify-center backdrop-blur-lg ${isDark ? "bg-scrim/50" : "bg-scrim/75"}`}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className={`absolute left-page-x top-page-y ${styles.moonButtonWhite}`}
            >
              {themeToggle}
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-page-x top-page-y transition-transform duration-150 active:scale-[0.97]"
            >
              <XIcon size={ICON_SIZE_SM} weight="regular" className="text-white" />
            </button>
            <motion.div
              variants={panelVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              animate="visible"
              exit={reduceMotion ? "visible" : "exit"}
              onClick={(event) => event.stopPropagation()}
              className="flex flex-col items-center gap-button-gap"
            >
              <TransitionLink
                href="/"
                data-selected={pathname === "/" || undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileMenuLink} font-sans font-semibold text-header text-white transition-transform duration-150 active:scale-[0.97]`}
              >
                Home
              </TransitionLink>
              <TransitionLink
                href="/about"
                data-selected={pathname === "/about" || undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileMenuLink} font-sans font-semibold text-header text-white transition-transform duration-150 active:scale-[0.97]`}
              >
                About
              </TransitionLink>
              <TransitionLink
                href="/work"
                data-selected={pathname === "/work" || undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`${styles.mobileMenuLink} font-sans font-semibold text-header text-white transition-transform duration-150 active:scale-[0.97]`}
              >
                Work
              </TransitionLink>
            </motion.div>
            <div
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-page-y left-page-x flex gap-button-gap"
            >
              <a
                href="mailto:siminlee.work@gmail.com"
                className="flex items-center gap-text-icon font-sans font-medium text-body text-content-secondary"
              >
                <span>Email</span>
                <ArrowUpRightIcon size={ICON_SIZE_SM} weight="regular" className="icon-sm" />
              </a>
              <a
                href="https://www.linkedin.com/in/si-min-lee/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-text-icon font-sans font-medium text-body text-content-secondary"
              >
                <span>LinkedIn</span>
                <ArrowUpRightIcon size={ICON_SIZE_SM} weight="regular" className="icon-sm" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
