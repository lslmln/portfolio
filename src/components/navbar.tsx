"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeLink } from "./home-link";
import styles from "./navbar.module.css";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--nav-height", `${nav.offsetHeight}px`);
    });
    observer.observe(nav);
    return () => observer.disconnect();
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
      </div>
    </nav>
  );
}
