import { ContactSection } from "@/components/contact-section";
import { HomeHero } from "@/components/home-hero";
import { QuotesSection } from "@/components/quotes-section";
import { ToolsSection } from "@/components/tools-section";
import { WorkSection } from "@/components/work-section";

export default function Home() {
  return (
    <>
      <HomeHero />
      <WorkSection />
      <ToolsSection />
      <QuotesSection />
      <ContactSection />
    </>
  );
}
