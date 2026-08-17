import { CrossfadeReveal } from "@/components/crossfade-reveal";
import { IconRow } from "@/components/icon-row";
import iconRowStyles from "@/components/icon-row.module.css";
import { ScrollCue } from "@/components/scroll-cue";

// The homepage's top section, on its own so it can also be used as the
// backdrop behind the passcode modal when a locked case study is opened via
// a direct URL — see WorkDetailGate.
export function HomeHero() {
  return (
    <main className="flex flex-col tablet:min-h-[calc(100svh-var(--nav-height))]">
      <h1 className="sr-only">Si Min Lee · Product Designer</h1>
      <div className="relative hidden flex-1 tablet:block">
        <div className="absolute inset-x-0 top-0 bottom-page-y tablet:bottom-0">
          <IconRow />
        </div>
      </div>
      <CrossfadeReveal className="flex items-start justify-between px-page-x py-6 tablet:items-end tablet:pt-0 tablet:pb-page-y">
        <div>
          <p className="font-sans font-medium text-body text-content-secondary">
            Si Min was @{" "}
            <a
              href="https://crypto.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconRowStyles.link} font-sans font-medium text-body`}
            >
              Crypto.com
            </a>
            .
          </p>
          <p className="hidden font-sans font-medium text-body text-content-primary tablet:block">
            Bringing emerging asset classes to everyday investors.
          </p>
          <p className="hidden font-sans font-medium text-body text-content-primary tablet:block">
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
