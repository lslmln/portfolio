import type { MetadataRoute } from "next";
import { workProjects } from "@/lib/work-projects";

const SITE_URL = "https://simin.design";

export default function sitemap(): MetadataRoute.Sitemap {
  // Locked (passcode-gated) and WIP case studies have no crawlable content —
  // a locked page just shows a passcode prompt, a WIP one isn't written yet —
  // so both are excluded here rather than pointing crawlers at empty pages.
  const crawlableProjects = workProjects.filter((p) => !p.locked && !p.wip);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/work` },
    ...crawlableProjects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}` })),
  ];
}
