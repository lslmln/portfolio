import styles from "./seam.module.css";

export function Seam() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.seam} absolute inset-x-0 h-seam-thickness`}
      style={{
        top: "calc(var(--spacing-section-gap) / 2 - var(--spacing-seam-thickness) / 2)",
      }}
    />
  );
}
