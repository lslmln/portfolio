import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { TimelineSection } from "@/components/timeline-section";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <TimelineSection />
      <ContactSection />
    </>
  );
}
