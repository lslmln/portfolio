import { CrossfadeReveal } from "@/components/crossfade-reveal";
import { IconRow } from "@/components/icon-row";
import { ScrollCue } from "@/components/scroll-cue";

// The homepage's top section, on its own so it can also be used as the
// backdrop behind the passcode modal when a locked case study is opened via
// a direct URL — see WorkDetailGate.
export function HomeHero() {
  return (
    <main
      className="flex flex-col"
      style={{ minHeight: "calc(100svh - var(--nav-height))" }}
    >
      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0 bottom-page-y tablet:bottom-0">
          <IconRow />
        </div>
      </div>
      <CrossfadeReveal className="flex items-end justify-between px-page-x pb-page-y">
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
      </CrossfadeReveal>
    </main>
  );
}
