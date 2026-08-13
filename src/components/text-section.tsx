import { Seam } from "./seam";

export function TextSection({
  heading,
  paragraphs,
  firstOnPage = false,
}: {
  heading: string;
  paragraphs: readonly string[];
  firstOnPage?: boolean;
}) {
  return (
    <section className={`relative ${firstOnPage ? "pb-page-y" : "pt-section-gap pb-page-y"}`}>
      {!firstOnPage && <Seam />}
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        {heading}
      </h2>
      <div className="px-page-x">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="font-sans font-medium text-body text-content-primary">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
