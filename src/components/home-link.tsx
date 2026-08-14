"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { useNavigate } from "./route-transition";
import styles from "./navbar.module.css";

export function HomeLink() {
  const pathname = usePathname();
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    if (pathname === "/") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }
    navigate("/");
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`${styles.homeLink} text-content-primary no-underline`}
    >
      Si Min Lee
    </Link>
  );
}
