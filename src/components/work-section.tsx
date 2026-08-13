import Image from "next/image";
import { Seam } from "./seam";
import styles from "./work-section.module.css";

const cards = [
  {
    title:
      "Redesigning asset detail pages to bring consistency and progressive disclosure",
  },
  {
    title: "Rebuilding the design system to scale with an expanding product ecosystem",
  },
  {
    title:
      "Building AI-powered tools that aid in visualisation and empower design exploration",
  },
  {
    title: "Bringing tokenized stocks to every day investors",
  },
];

export function WorkSection({ firstOnPage = false }: { firstOnPage?: boolean }) {
  return (
    <section className={`relative pb-page-y ${firstOnPage ? "" : "pt-section-gap"}`}>
      {!firstOnPage && <Seam />}
      {!firstOnPage && (
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-content-secondary">
          WORK
        </h2>
      )}
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {cards.map((card) => (
          <div
            key={card.title}
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
          </div>
        ))}
      </div>
    </section>
  );
}
