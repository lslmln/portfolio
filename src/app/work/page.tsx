import type { Metadata } from "next";
import { WorkSection } from "@/components/work-section";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <WorkSection firstOnPage lastOnPage />;
}
