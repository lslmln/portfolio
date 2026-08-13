"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { Seam } from "./seam";
import styles from "./contact-section.module.css";

const links = [
  { label: "Email", href: "mailto:siminlee.work@gmail.com", external: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/si-min-lee/", external: true },
];

export function ContactSection() {
  return (
    <section className="relative pt-section-gap pb-page-y">
      <Seam />
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-content-secondary">
        CONTACT
      </h2>
      <div className="px-page-x">
        <p className="font-sans font-medium text-body text-content-primary">
          Let&apos;s build together.
        </p>
        <p className="font-sans font-medium text-body text-content-primary">
          I can help with end-to-end product design, crafting design systems and AI-powered
          tools that help teams move faster.
        </p>
      </div>
      <div className="flex gap-button-gap px-page-x py-page-y">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className={`${styles.link} flex items-center gap-text-icon font-sans font-medium text-nav text-content-secondary`}
          >
            <span>{link.label}</span>
            <span className={styles.arrow}>
              <ArrowUpRightIcon size={ICON_SIZE_SM} weight="regular" className="icon-sm" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
