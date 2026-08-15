import Image from "next/image";

export function AboutSection() {
  return (
    <section className="pb-page-y">
      <h1 className="sr-only">About Si Min Lee — Product Designer</h1>
      <div className="grid grid-cols-1 items-center gap-page-y px-page-x py-page-y tablet:grid-cols-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-card bg-content-secondary/15 tablet:col-span-4 desktop:col-span-4">
          <Image
            src="/images/profile-photo.jpg"
            alt="Portrait of Simin Lee"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="tablet:col-span-8 desktop:col-span-8">
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
