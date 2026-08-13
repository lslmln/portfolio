"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { HomeLink } from "./home-link";
import styles from "./navbar.module.css";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

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

  return (
    <nav
      ref={navRef}
      className="flex w-full items-center justify-between px-page-x py-page-y font-sans font-semibold text-nav text-content-primary"
    >
      <HomeLink />
      <div className="flex items-center gap-page-y">
        <Link
          href="/about"
          data-selected={pathname === "/about" || undefined}
          className={styles.navLink}
        >
          About
        </Link>
        <Link
          href="/work"
          data-selected={pathname === "/work" || undefined}
          className={styles.navLink}
        >
          Work
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={styles.moonButton}
        >
          {isDark ? (
            <>
              <SunIcon size={ICON_SIZE_SM} weight="regular" className={`icon-sm ${styles.moonRegular}`} />
              <SunIcon size={ICON_SIZE_SM} weight="fill" className={`icon-sm ${styles.moonFill}`} />
            </>
          ) : (
            <>
              <MoonIcon size={ICON_SIZE_SM} weight="regular" className={`icon-sm ${styles.moonRegular}`} />
              <MoonIcon size={ICON_SIZE_SM} weight="fill" className={`icon-sm ${styles.moonFill}`} />
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
