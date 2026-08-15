import { Seam } from "./seam";

const tools = [
  { label: "Design", items: "Figma · Framer · Adobe CS" },
  { label: "Analytics", items: "Dovetail · Mixpanel · Amplitude · Tableau" },
  { label: "Development", items: "Claude Code · Cursor · VS Code · GitHub" },
  { label: "Collaboration", items: "Jira · Notion · Google Workspace" },
];

export function ToolsSection() {
  return (
    <section className="relative pt-section-gap pb-page-y">
      <Seam />
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        TOOLS
      </h2>
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {tools.map((tool) => (
          <div key={tool.label} className="tablet:col-span-6">
            <p className="font-sans font-medium text-nav text-content-secondary">
              {tool.label}
            </p>
            <p className="font-sans font-medium text-body text-content-primary">
              {tool.items}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
