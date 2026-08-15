import { notFound } from "next/navigation";
import { NotFoundContent } from "@/components/not-found-content";

export default function Dev404Preview() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <NotFoundContent />;
}
