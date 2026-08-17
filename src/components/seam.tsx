import styles from "./seam.module.css";

export function Seam({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`${styles.seam} absolute inset-x-0 h-seam-thickness ${className}`}
      style={{
        top: "calc(var(--spacing-section-gap) / 2 - var(--spacing-seam-thickness) / 2)",
      }}
    />
  );
}
