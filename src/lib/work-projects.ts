export interface WorkProject {
  slug: string;
  title: string;
  locked?: boolean;
  image: string;
  imageDark?: string;
  // Real aspect ratio of `image`/`imageDark`, used only by the work-detail
  // page's hero (WorkHeroImage) so it can size itself naturally instead of
  // being force-cropped into the card grid's 8:5 aspect-card box — the two
  // aren't always the same ratio. The card grid itself still crops via
  // aspect-card/object-cover on purpose, for uniform tiles.
  heroWidth: number;
  heroHeight: number;
}

export const workProjects: WorkProject[] = [
  {
    slug: "feature-flow-revamp",
    title:
      "Redesigning asset detail pages to bring consistency and progressive disclosure",
    locked: true,
    image: "/images/asset-details-cover.png",
    heroWidth: 1600,
    heroHeight: 1000,
  },
  {
    slug: "design-system-revamp",
    title: "Rebuilding the design system to scale with an expanding product ecosystem",
    locked: true,
    image: "/images/design-system-revamp.png",
    heroWidth: 1600,
    heroHeight: 1000,
  },
  {
    slug: "screenshot-to-figma",
    title:
      "Building AI-powered tools that aid in visualisation and empower design exploration",
    image: "/images/screenshot-to-figma-light.png",
    imageDark: "/images/screenshot-to-figma-dark.png",
    heroWidth: 1600,
    heroHeight: 900,
  },
  {
    slug: "tokenized-stocks",
    title: "Bringing tokenized stocks to every day investors",
    image: "/images/work-placeholder.jpg",
    heroWidth: 1600,
    heroHeight: 900,
  },
];
