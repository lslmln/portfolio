import Image from "next/image";
import { notFound } from "next/navigation";
import { Seam } from "@/components/seam";
import { TextSection } from "@/components/text-section";
import { WorkSection } from "@/components/work-section";
import { workProjects } from "@/lib/work-projects";

const projects = [
  {
    slug: "feature-flow-revamp",
    context: [
      "As Crypto.com's product suite grew, the existing design didn't scale with it. New features were Frankenstein-ed onto the existing design foundation. For our users, that meant entering an app with an overwhelming, sometimes unnecessary amount of information. Beginners who bought a crypto basket would face an entirely different flow when buying a whale basket, even though both assets are based on a similar concept. We needed progressive disclosure, and took the opportunity to also update long-outdated parts of the app along the way.",
      "I worked on two parts of this revamp: feature-level improvements, and the design system behind them. This page covers the feature work, see this page for design systems. I also explored what AI could do to support the revamp as it grew here.",
    ],
    scope: {
      time: "~2 weeks in Jul 2026",
      toolsUsed: "Claude Code · Cursor · Figma",
      process:
        "Design in Figma → View designs on a simulator via MCP → Push changes as a pull request to the shared repo → Share videos and design rationale with the team for review → Merge once approved",
    },
    whatIBuilt: ["[PLACEHOLDER — what I built]"],
  },
  {
    slug: "design-system-revamp",
    context: ["[PLACEHOLDER — design-system-revamp context]"],
    scope: {
      time: "[PLACEHOLDER]",
      toolsUsed: "[PLACEHOLDER]",
      process: "[PLACEHOLDER]",
    },
    whatIBuilt: ["[PLACEHOLDER — what I built]"],
  },
  {
    slug: "screenshot-to-figma",
    context: ["[PLACEHOLDER — screenshot-to-figma context]"],
    scope: {
      time: "[PLACEHOLDER]",
      toolsUsed: "[PLACEHOLDER]",
      process: "[PLACEHOLDER]",
    },
    whatIBuilt: ["[PLACEHOLDER — what I built]"],
  },
  {
    slug: "tokenized-stocks",
    context: ["[PLACEHOLDER — tokenized-stocks context]"],
    scope: {
      time: "[PLACEHOLDER]",
      toolsUsed: "[PLACEHOLDER]",
      process: "[PLACEHOLDER]",
    },
    whatIBuilt: ["[PLACEHOLDER — what I built]"],
  },
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Cyclic "next 2" order, so across all 4 detail pages every project shows up
// in at least one "more like this" list (never left orphaned).
function getMoreLikeThis(slug: string) {
  const index = workProjects.findIndex((p) => p.slug === slug);
  return [
    workProjects[(index + 1) % workProjects.length],
    workProjects[(index + 2) % workProjects.length],
  ];
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = workProjects.find((p) => p.slug === slug)?.title;

  if (!project || !title) {
    notFound();
  }

  return (
    <>
      <div className="grid grid-cols-1 items-center gap-card-text-gap px-page-x py-page-y tablet:grid-cols-12">
        <div className="relative aspect-card w-full overflow-hidden rounded-card tablet:col-span-3">
          <Image src="/images/work-placeholder.jpg" alt={title} fill className="object-cover" />
        </div>
        <h1 className="font-sans font-semibold text-header text-content-primary tablet:col-span-9">
          {title}
        </h1>
      </div>
      <section className="relative pt-page-y tablet:pt-section-gap pb-page-y [--spacing-section-gap:18px] tablet:[--spacing-section-gap:80px]">
        <Seam />
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          CONTEXT
        </h2>
        <div className="px-page-x">
          {project.context.map((paragraph, index) => (
            <p key={index} className="font-sans font-medium text-body text-content-primary">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section className="relative pt-section-gap pb-page-y">
        <Seam />
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          SCOPE
        </h2>
        <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
          <div className="flex flex-col gap-y-card-row-gap tablet:col-span-6">
            <div>
              <p className="font-sans font-medium text-nav text-content-secondary">
                Time
              </p>
              <p className="font-sans font-medium text-body text-content-primary">
                {project.scope.time}
              </p>
            </div>
            <div>
              <p className="font-sans font-medium text-nav text-content-secondary">
                Tools used
              </p>
              <p className="font-sans font-medium text-body text-content-primary">
                {project.scope.toolsUsed}
              </p>
            </div>
          </div>
          <div className="tablet:col-span-6">
            <p className="font-sans font-medium text-nav text-content-secondary">
              Process
            </p>
            <p className="font-sans font-medium text-body text-content-primary">
              {project.scope.process}
            </p>
          </div>
        </div>
      </section>
      <TextSection heading="WHAT I BUILT" paragraphs={project.whatIBuilt} />
      <WorkSection heading="MORE LIKE THIS" items={getMoreLikeThis(slug)} lastOnPage />
    </>
  );
}
