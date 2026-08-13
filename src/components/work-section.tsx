import Image from "next/image";
import Link from "next/link";
import { Seam } from "./seam";
import styles from "./work-section.module.css";

const cards = [
  {
    slug: "feature-flow-revamp",
    title:
      "Redesigning asset detail pages to bring consistency and progressive disclosure",
  },
  {
    slug: "design-system-revamp",
    title: "Rebuilding the design system to scale with an expanding product ecosystem",
  },
  {
    slug: "screenshot-to-figma",
    title:
      "Building AI-powered tools that aid in visualisation and empower design exploration",
  },
  {
    slug: "tokenized-stocks",
    title: "Bringing tokenized stocks to every day investors",
  },
];

export function WorkSection({ firstOnPage = false }: { firstOnPage?: boolean }) {
  return (
    <section
      className={`relative ${firstOnPage ? "pb-[48px] tablet:pb-[96px]" : "pt-section-gap pb-page-y"}`}
    >
      {!firstOnPage && <Seam />}
      {!firstOnPage && (
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          WORK
        </h2>
      )}
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {cards.map((card) => (
          <Link
            key={card.slug}
            href={`/work/${card.slug}`}
            className={`${styles.card} flex flex-col gap-card-text-gap tablet:col-span-6`}
          >
            <div className={`${styles.imageWrapper} aspect-card w-full rounded-card`}>
              <Image
                src="/images/work-placeholder.jpg"
                alt={card.title}
                fill
                className={styles.image}
              />
            </div>
            <p className="font-sans font-medium text-body text-content-primary">
              {card.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
