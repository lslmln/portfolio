import { ContactSection } from "@/components/contact-section";
import { IconRow } from "@/components/icon-row";
import { QuotesSection } from "@/components/quotes-section";
import { ScrollCue } from "@/components/scroll-cue";
import { ToolsSection } from "@/components/tools-section";
import { WorkSection } from "@/components/work-section";

export default function Home() {
  return (
    <>
      <main
        className="flex flex-col"
        style={{ minHeight: "calc(100vh - var(--nav-height))" }}
      >
        <div className="relative flex-1">
          <div className="absolute inset-x-0 top-0 bottom-page-y tablet:bottom-0">
            <IconRow />
          </div>
        </div>
        <div className="flex items-end justify-between px-page-x pb-page-y">
          <div>
            <p className="font-sans font-medium text-body text-content-secondary">
              Si Min was @ Crypto.com
            </p>
            <p className="font-sans font-medium text-body text-content-primary">
              Bringing emerging asset classes to everyday investors.
            </p>
            <p className="font-sans font-medium text-body text-content-primary">
              Building the design system that makes them intuitive and accessible.
            </p>
          </div>
          <div className="hidden desktop:block">
            <ScrollCue />
          </div>
        </div>
      </main>
      <WorkSection />
      <ToolsSection />
      <QuotesSection />
      <ContactSection />
    </>
  );
}
