export function AboutSection() {
  return (
    <section className="pb-page-y">
      <div className="grid grid-cols-1 items-center gap-page-y px-page-x py-page-y desktop:grid-cols-12">
        <div className="aspect-square w-full rounded-card bg-content-secondary/15 desktop:col-span-2" />
        <div className="desktop:col-span-10">
          <p className="font-sans font-medium text-body text-content-primary">
            I&apos;m a product designer based in Singapore. Previously at Crypto.com & IBM.
          </p>
          <p className="font-sans font-medium text-body text-content-primary">
            I&apos;ve been working full-time in design for a little over a year, but this
            dream started 4 years ago.
          </p>
        </div>
      </div>
    </section>
  );
}
