export function Seam() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 h-[2px] bg-black/5"
      style={{ top: "calc(var(--spacing-section-gap) / 2 - 1px)" }}
    />
  );
}
