import type { ReactNode } from "react";
import { DemoVideo } from "./demo-video";
import { Seam } from "./seam";
import styles from "./text-section.module.css";

export function TextSection({
  heading,
  paragraphs,
  video,
  videoFullWidth = false,
  paragraphGap = false,
  secondary = false,
  firstOnPage = false,
}: {
  heading: string;
  paragraphs: readonly ReactNode[];
  video?: string;
  videoFullWidth?: boolean;
  paragraphGap?: boolean;
  secondary?: boolean;
  firstOnPage?: boolean;
}) {
  return (
    <section className={`relative ${firstOnPage ? "pb-page-y" : "pt-section-gap pb-page-y"}`}>
      {!firstOnPage && <Seam />}
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        {heading}
      </h2>
      <div className="px-page-x py-page-y">
        {video && (
          <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap pb-card-text-gap tablet:grid-cols-12">
            <div className={videoFullWidth ? "tablet:col-span-12" : "tablet:col-span-6"}>
              <DemoVideo src={video} />
            </div>
          </div>
        )}
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`font-sans font-medium text-body ${secondary ? styles.secondaryText : "text-content-primary"} ${paragraphGap ? "mb-card-text-gap" : ""}`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
