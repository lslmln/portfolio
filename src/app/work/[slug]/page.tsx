import { notFound } from "next/navigation";

const projects = [
  { slug: "feature-flow-revamp" },
  { slug: "design-system-revamp" },
  { slug: "screenshot-to-figma" },
  { slug: "tokenized-stocks" },
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="px-page-x py-page-y">
      <p className="font-sans font-medium text-body text-content-primary">
        [PLACEHOLDER — {slug} detail content]
      </p>
    </section>
  );
}
