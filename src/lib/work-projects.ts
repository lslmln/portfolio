export interface WorkProject {
  slug: string;
  title: string;
  locked?: boolean;
  image: string;
  imageDark?: string;
}

export const workProjects: WorkProject[] = [
  {
    slug: "feature-flow-revamp",
    title:
      "Redesigning asset detail pages to bring consistency and progressive disclosure",
    locked: true,
    image: "/images/asset-details-cover.png",
  },
  {
    slug: "design-system-revamp",
    title: "Rebuilding the design system to scale with an expanding product ecosystem",
    locked: true,
    image: "/images/design-system-revamp.png",
  },
  {
    slug: "screenshot-to-figma",
    title:
      "Building AI-powered tools that aid in visualisation and empower design exploration",
    image: "/images/screenshot-to-figma-light.png",
    imageDark: "/images/screenshot-to-figma-dark.png",
  },
  {
    slug: "tokenized-stocks",
    title: "Bringing tokenized stocks to every day investors",
    image: "/images/work-placeholder.jpg",
  },
];
