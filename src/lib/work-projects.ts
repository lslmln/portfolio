export interface WorkProject {
  slug: string;
  title: string;
  locked?: boolean;
}

export const workProjects: WorkProject[] = [
  {
    slug: "feature-flow-revamp",
    title:
      "Redesigning asset detail pages to bring consistency and progressive disclosure",
    locked: true,
  },
  {
    slug: "design-system-revamp",
    title: "Rebuilding the design system to scale with an expanding product ecosystem",
    locked: true,
  },
  {
    slug: "screenshot-to-figma",
    title:
      "Building AI-powered tools that aid in visualisation and empower design exploration",
  },
  {
    slug: "tokenized-stocks",
    title: "Bringing tokenized stocks to every day investors",
  },
];
