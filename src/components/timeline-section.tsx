"use client";

import {
  BoatIcon,
  ChartLineIcon,
  GraduationCapIcon,
  GraphIcon,
  LeafIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";
import { ICON_SIZE_LG, ICON_SIZE_MOBILE } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaQuery } from "@/lib/use-media-query";
import iconRowStyles from "./icon-row.module.css";
import { Seam } from "./seam";

// href and highlight for the 5 IconRow companies reused verbatim from IconRow's
// `items` array (`highlight` = each item's `pre` text, minus the trailing " @ ").
// Yale-NUS College isn't one of those 5, so it has no highlight to reuse.
const entries = [
  {
    Icon: ChartLineIcon,
    company: "Crypto.com",
    href: "https://crypto.com/",
    role: "Product Designer",
    meta: "Jun 2025 - Aug 2026 · Singapore",
    highlight: "Tokenized stocks & Equities Trading",
  },
  {
    Icon: GraduationCapIcon,
    company: "Yale-NUS College",
    href: "https://www.yale-nus.edu.sg/",
    role: "B.A. (Honours), Economics Major, Mathematical, Computational and Statistical Sciences Minor",
    meta: "Aug 2020 - May 2025 · Singapore",
    highlight: "Development Economics, Optimization & Proofs",
  },
  {
    Icon: BoatIcon,
    company: "IBM",
    href: "https://www.ibm.com/",
    role: "UX Designer Intern",
    meta: "Jul 2024 - Dec 2024 · Singapore",
    highlight: "Manpower planning for the Navy",
  },
  {
    Icon: GraphIcon,
    company: "Economic Development Board",
    href: "https://www.edb.gov.sg/",
    role: "Product & Service Designer Intern",
    meta: "May 2024 - Jul 2024 · Singapore",
    highlight: "Incentive processing workflows",
  },
  {
    Icon: LeafIcon,
    company: "Univers",
    href: "https://univers.com/",
    role: "Product Experience Designer Intern (UI/UX)",
    meta: "Jan 2024 - May 2024 · Singapore",
    highlight: "IoT for Public Housing & Parks",
  },
  {
    Icon: ShoppingCartIcon,
    company: "NetVirta",
    href: "https://www.netvirta.com/",
    role: "UI/UX Designer Intern",
    meta: "Jun 2022 - Aug 2022 · Singapore",
    highlight: "3D body scanning for online fit sizing",
  },
];

export function TimelineSection() {
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isDark = useIsDark();
  const iconSize = isTablet ? ICON_SIZE_LG : ICON_SIZE_MOBILE;

  return (
    <section className="relative pt-section-gap pb-page-y">
      <Seam />
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        TIMELINE
      </h2>
      <div className="flex flex-col gap-timeline-gap px-page-x py-page-y">
        {entries.map(({ Icon, company, href, role, meta, highlight }, index) => (
          <div key={index} className="flex items-start gap-page-x">
            <Icon
              size={iconSize}
              weight={isDark ? "fill" : "regular"}
              className="shrink-0 text-icon"
            />
            <div>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${iconRowStyles.link} font-sans font-medium text-nav`}
                >
                  {company}
                </a>
              ) : (
                <p className="font-sans font-medium text-nav text-content-primary">{company}</p>
              )}
              <p className="break-words font-sans font-medium text-body text-content-primary">
                {role}
              </p>
              <p className="font-sans font-medium text-nav text-content-secondary">{meta}</p>
              {highlight && (
                <p className="mt-highlight-gap font-sans font-medium text-caption leading-6 text-content-primary">
                  {highlight}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
