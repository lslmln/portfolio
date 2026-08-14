"use client";

import NextLink from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useNavigate } from "./route-transition";

type TransitionLinkProps = ComponentProps<typeof NextLink>;

export function TransitionLink({ href, onClick, ...rest }: TransitionLinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(typeof href === "string" ? href : (href.pathname ?? "/"));
  }

  return <NextLink href={href} onClick={handleClick} {...rest} />;
}
