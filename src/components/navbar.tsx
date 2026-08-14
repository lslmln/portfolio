"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, MoonIcon, SunIcon, XIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { backdropVariants, panelVariants } from "@/lib/modal-variants";
import { HomeLink } from "./home-link";
import styles from "./navbar.module.css";
import { TransitionLink } from "./transition-link";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  function toggleTheme() {
    setIsDark((current) => {
      const next = !current;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
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
        className={`${styles.hamburger} flex flex-col items-center gap-[6px] tablet:hidden`}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={backdropVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            animate="visible"
            exit={reduceMotion ? "visible" : "exit"}
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg ${isDark ? "bg-[#000000]/50" : "bg-[#000000]/75"}`}
          >
            <div className={`absolute left-page-x top-page-y ${styles.moonButtonWhite}`}>
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
              className="flex flex-col items-center gap-[16px]"
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
            <div className="absolute bottom-page-y left-page-x flex gap-button-gap">
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
