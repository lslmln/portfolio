import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DemoVideo } from "@/components/demo-video";
import { ExpandableImage } from "@/components/expandable-image";
import iconRowStyles from "@/components/icon-row.module.css";
import { Seam } from "@/components/seam";
import { TextSection } from "@/components/text-section";
import { TransitionLink } from "@/components/transition-link";
import { WorkDetailGate } from "@/components/work-detail-gate";
import { WorkHeroImage } from "@/components/work-hero-image";
import { WorkSection } from "@/components/work-section";
import { workProjects } from "@/lib/work-projects";
import styles from "./page.module.css";

type ProcessBlock =
  | { type: "paragraph"; text: ReactNode }
  | { type: "image"; src: string; alt: string };

type BuiltBlock =
  | { type: "paragraph"; text: ReactNode }
  | { type: "gallery"; images: readonly { src: string; alt: string }[] }
  | { type: "video"; src: string }
  | {
      type: "videoGallery";
      videos: readonly (string | { src: string; background?: string })[];
    }
  | {
      type: "mixedGallery";
      compact?: boolean;
      items: readonly (
        | { kind: "image"; src: string; alt: string }
        | { kind: "video"; src: string }
      )[];
    };

function renderBuiltBlocks(blocks: readonly BuiltBlock[]) {
  return blocks.map((block, index) =>
    block.type === "gallery" ? (
      <div
        key={index}
        className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12"
      >
        {block.images.map((image, imageIndex) => (
          <ExpandableImage
            key={imageIndex}
            src={image.src}
            alt={image.alt}
            width={1600}
            height={1000}
            className="tablet:col-span-6"
          />
        ))}
      </div>
    ) : block.type === "video" ? (
      <div
        key={index}
        className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12"
      >
        <div className="tablet:col-span-6">
          <DemoVideo src={block.src} />
        </div>
      </div>
    ) : block.type === "videoGallery" ? (
      <div
        key={index}
        className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12"
      >
        {block.videos.map((video, videoIndex) => {
          const { src, background } = typeof video === "string" ? { src: video } : video;
          return (
            <div key={videoIndex} className="tablet:col-span-6">
              <DemoVideo src={src} background={background} />
            </div>
          );
        })}
      </div>
    ) : block.type === "mixedGallery" ? (
      <div
        key={index}
        className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12"
      >
        {block.items.map((item, itemIndex) =>
          item.kind === "video" ? (
            <div
              key={itemIndex}
              className={block.compact ? "tablet:col-span-6 desktop:col-span-3" : "tablet:col-span-6"}
            >
              <DemoVideo src={item.src} />
            </div>
          ) : (
            <ExpandableImage
              key={itemIndex}
              src={item.src}
              alt={item.alt}
              width={1600}
              height={1000}
              className={block.compact ? "tablet:col-span-6 desktop:col-span-3" : "tablet:col-span-6"}
            />
          ),
        )}
      </div>
    ) : (
      <p
        key={index}
        className={`px-page-x py-page-y font-sans font-medium text-body ${styles.secondaryText}`}
      >
        {block.text}
      </p>
    ),
  );
}

function BuiltSection({ heading, blocks }: { heading: string; blocks: readonly BuiltBlock[] }) {
  return (
    <section className="relative pt-section-gap pb-page-y">
      <Seam />
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        {heading}
      </h2>
      {renderBuiltBlocks(blocks)}
    </section>
  );
}

const projects = [
  {
    slug: "feature-flow-revamp",
    context: [
      <>
        As Crypto.com&apos;s product suite grew, the existing design didn&apos;t
        scale with it. New features were Frankenstein-ed onto the existing design
        foundation. For our users, that meant entering an app with an
        overwhelming, sometimes unnecessary amount of information. Beginners who
        bought a crypto basket would face an entirely different flow when buying a
        whale basket, even though both assets are based on a similar concept.{" "}
        <span className={styles.highlight}>We needed progressive disclosure,</span>{" "}
        and took the opportunity to also update long-outdated parts of the app
        along the way.
      </>,
      <>
        I worked on two parts of this revamp: feature-level improvements, and the
        design system behind them. This page covers the feature work, see{" "}
        <TransitionLink href="/work/design-system-revamp" className={iconRowStyles.link}>
          this page
        </TransitionLink>{" "}
        for design systems. I also explored what AI could do to support the
        revamp as it grew{" "}
        <TransitionLink href="/work/screenshot-to-figma" className={iconRowStyles.link}>
          here
        </TransitionLink>
        .
      </>,
    ],
    scope: {
      time: "~2 weeks in Jul 2026",
      toolsUsed: "Claude Code · Cursor · Figma",
      process:
        "Design in Figma → View designs on a simulator via MCP → Push changes as a pull request to the shared repo → Share videos and design rationale with the team for review → Merge once approved",
    },
    whatIBuilt: [
      <>
        I focused on asset detail pages, starting with{" "}
        <span className={styles.highlight}>
          the pairs that felt disconnected despite being conceptually similar
        </span>
        : crypto and stocks, followed by crypto baskets and whale baskets.
      </>,
    ],
    builtContent: [
      {
        type: "gallery",
        images: [
          { src: "/images/crypto-details.png", alt: "Crypto asset detail page" },
          { src: "/images/stock-details.png", alt: "Stock asset detail page" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            <span className={styles.highlight}>
              We moved to a black background to let colour do more of the work
              with less of it.
            </span>{" "}
            The asset logo is distinct, charts indicate sentiment with traffic
            light colours, and we preserve our brand&apos;s blue identity by using
            it as the CTA.
          </>
        ),
      },
      {
        type: "gallery",
        images: [
          { src: "/images/asset-labels-one.png", alt: "Asset detail page, single label" },
          { src: "/images/asset-labels-multiple.png", alt: "Asset detail page, multiple labels" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            To help users tell similar assets apart, I added labels distinguishing
            tokenized stocks from stocks.{" "}
            <span className={styles.highlight}>
              These small signals matter when the underlying asset type isn&apos;t
              obvious at a glance.
            </span>{" "}
            I also experimented with having multiple indicators, if we wanted to
            highlight more differences within assets themselves. In this case,
            only 20 tokenized stocks offered 24/7 trading.
          </>
        ),
      },
      {
        type: "gallery",
        images: [
          { src: "/images/analyst-ratings-old.png", alt: "Analyst ratings, earlier version" },
          { src: "/images/analyst-ratings.png", alt: "Analyst ratings, revised version" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            Analyst ratings, in particular,{" "}
            <span className={styles.highlight}>
              had tested especially well in user interviews, so I gave it heavier
              focus.
            </span>{" "}
            The charts were visually engaging and the sentiment signal was
            genuinely useful for beginners. I brought the price target chart
            earlier in the flow, with sources tucked behind a tap, giving users a
            way to verify legitimacy without cluttering the default view.
          </>
        ),
      },
      {
        type: "paragraph",
        text: "Besides crypto and stocks, I also tackled the issues in more complicated products such as crypto and whale baskets. Crypto baskets are automated bundles of different digital tokens grouped by blockchain themes or sectors. Whale baskets are curated collections of traditional stocks that mirror the exact personal portfolios of billionaire investors and prominent public figures, letting you copy the strategies of market elites with one click.",
      },
      {
        type: "videoGallery",
        videos: ["/videos/baskets-old.mp4", "/videos/bought-basket.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            Previously, a bought basket could only be viewed through Accounts,
            with no entry point from the basket details page. This made balances
            harder for users to find. Now, balance is shown directly on the same
            details screen used before purchase, using the same components with an
            added allocation breakdown, so{" "}
            <span className={styles.highlight}>
              users can relate the pre- and post-purchase versions of the same
              screen.
            </span>
          </>
        ),
      },
      {
        type: "mixedGallery",
        compact: true,
        items: [
          { kind: "image", src: "/images/rebalancing-old.png", alt: "Rebalancing, earlier version" },
          { kind: "video", src: "/videos/rebalancing.mp4" },
          {
            kind: "image",
            src: "/images/allocation-changes-old.png",
            alt: "Allocation changes, earlier version",
          },
          { kind: "video", src: "/videos/allocation-changes.mp4" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            Crypto and whale products look similar on the surface — both bundle
            multiple assets into one purchase — but work differently as hinted at
            earlier. Besides the main differences of what these baskets consist
            of, crypto baskets also support optional rebalancing, letting users
            buy/sell to maintain a target ratio. Whale baskets instead track real
            allocation shifts of specific whales (e.g. Jensen Huang), updating
            automatically as those whales&apos; positions change.{" "}
            <span className={styles.highlight}>
              To surface this difference, rebalancing for crypto baskets appear
              during the trade flow (not shown) and as a toggle post-purchase, so
              the option is always available to users. For whale baskets, any
              allocation changes are surfaced as an inline alert prompting users
              to review the latest trades. This way, it only appears when
              it&apos;s needed.
            </span>
          </>
        ),
      },
      {
        type: "gallery",
        images: [
          { src: "/images/dca-old.png", alt: "DCA calculator, earlier version" },
          { src: "/images/dca.png", alt: "DCA calculator, revised version" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            Previously, the DCA calculator&apos;s entry point looked more like a
            promotional banner than a real feature — easy to miss or dismiss.{" "}
            <span className={styles.highlight}>
              I gave it a standalone section instead, making it clearly a tool
              rather than an ad.
            </span>
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            The calculator itself was overcomplicated: the graph reloaded on every
            input change, and{" "}
            <span className={styles.highlight}>
              it would still indicate a red dollar value even when the basket had
              lost value, inadvertently signaling to beginners not to buy.
            </span>{" "}
            This defeats the point of DCA as a strategy for the business to
            improve retention by pooling in automated recurring investments. I
            simplified the calculator by fixing the time period to one year
            (removing that variable entirely) and cutting the graph altogether. I
            also made the copy more neutral, and any values in the negative would
            show as blue rather than red. Now users only need to adjust amount and
            frequency to see a single, plain-language output. Once a user sets up
            a recurring buy, the DCA section disappears entirely, they can already
            see the value generated directly from their balance, so showing it
            twice would be redundant.
          </>
        ),
      },
    ],
  },
  {
    slug: "design-system-revamp",
    context: [
      <>
        As Crypto.com&apos;s product suite grew, the existing design didn&apos;t
        scale with it. New features were Frankenstein-ed onto the existing design
        foundation. For our users, that meant entering an app with an
        overwhelming, sometimes unnecessary amount of information.{" "}
        <span className={styles.highlight}>
          Alerts gave no distinction between simple, informational nudges and
          warnings about serious risk.
        </span>{" "}
        <span className={styles.highlight}>We needed progressive disclosure,</span>{" "}
        and took the opportunity to also update long-outdated parts of the app
        along the way.
      </>,
      <>
        I worked on two parts of this revamp: feature-level improvements, and the
        design system behind them. This page covers design systems, see{" "}
        <TransitionLink href="/work/feature-flow-revamp" className={iconRowStyles.link}>
          this page
        </TransitionLink>{" "}
        for the feature work. I also explored what AI could do to support the
        revamp as it grew{" "}
        <TransitionLink href="/work/screenshot-to-figma" className={iconRowStyles.link}>
          here
        </TransitionLink>
        .
      </>,
    ],
    scope: {
      time: "~3 months, Apr–Jul 2026",
      toolsUsed: "Claude Code · Cursor · Figma",
      process:
        "Design and write up documentation in Figma → Prototype animations + use skills to improve them → Describe specs to dev who will build animation for me to review",
    },
    whatIBuilt: [
      <>
        I placed a{" "}
        <span className={styles.highlight}>
          strong focus on the core components most users would encounter and that
          would shape their overall experience
        </span>
        : the input amount component, the price chart, and the logic for handling
        alerts as our product suite grew.
      </>,
    ],
    inputAmountContent: [
      {
        type: "videoGallery",
        videos: ["/videos/input-amount-recording.mp4", "/videos/input-amount-phone.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            One of the major changes in this revamp was making the trade drawer
            its own tab in the bottom nav, which meant it now needed to support
            trading across all assets and trade types (e.g. market order, limit
            order).{" "}
            <span className={styles.highlight}>
              Thus it was critical to revamp the input amount experience, making
              it feel premium and giving users a reason to stay and engage with
              our different offerings.
            </span>
          </>
        ),
      },
      {
        type: "video",
        src: "/videos/input-amount-drawer.mp4",
      },
      {
        type: "paragraph",
        text: (
          <>
            I did extensive competitor research (e.g. Coinbase, Kraken, Robinhood)
            and ended up heavily inspired by Family, which achieved a seamless,
            premium feel through its top / bottom gradients when numbers were
            added or removed, bouncing commas, and scaling down large numbers to
            keep them readable. I took Family&apos;s approach and adjusted it to
            fit our own design direction,{" "}
            <span className={styles.highlight}>
              one general principle across the revamp was left alignment, which
              meant values shifted less as digits were added or removed,
            </span>{" "}
            and improved the overall alignment and readability of the page.
          </>
        ),
      },
      {
        type: "videoGallery",
        videos: ["/videos/input-amount-suffix.mp4", "/videos/input-amount-light.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            <span className={styles.highlight}>
              Getting the suffix to work correctly was one of the harder problems
              to solve, since it had to reposition dynamically as users added or
              removed digits.
            </span>{" "}
            I also explored a light mode variant to make sure the design would
            scale accessibly, since we wanted the option to offer users a light
            mode in the future.
          </>
        ),
      },
      {
        type: "videoGallery",
        videos: ["/videos/input-switcher.mp4", "/videos/input-delete.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            Other micro-interactions included a switcher animation between input
            types — partly for feedback, partly just for user delight — and
            press-and-hold to delete for faster input correction.
          </>
        ),
      },
    ],
    priceChartContent: [
      {
        type: "videoGallery",
        videos: ["/videos/price-chart-recording.mp4", "/videos/price-chart-phone.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            The existing price chart felt outdated: the whole chart rescaled
            whenever a value moved beyond the axis range, the loading animation
            fully reloaded (with a skeleton state) on every timeframe switch, and
            scrubbing snapped numbers instantly with no transition.{" "}
            <span className={styles.highlight}>
              This was disorienting, since there was no continuity for the eye to
              follow.
            </span>{" "}
            The chart also felt cramped and could afford more visual space.
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            To fix the rescaling, I added extra buffer room to the chart&apos;s
            axis range,{" "}
            <span className={styles.highlight}>
              so it&apos;s less likely to rescale while a user is actively viewing
              it.
            </span>
          </>
        ),
      },
      {
        type: "videoGallery",
        videos: [
          "/videos/price-chart-timeframe.mp4",
          { src: "/videos/price-chart-liveline.mp4", background: "bg-white" },
        ],
      },
      {
        type: "paragraph",
        text: (
          <>
            When switching between timeframes, I took cues from Family&apos;s
            approach:{" "}
            <span className={styles.highlight}>
              the chart snaps smoothly along the y-axis so each transition has
              continuity, rather than fully reloading.
            </span>{" "}
            When scrubbing, a rolling lift/press interaction transitions into a
            subtle sliding animation, making values easier to read while still
            feeling delightful.
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            For the live chart specifically, I drew inspiration from{" "}
            <a
              href="https://benji.org/liveline"
              target="_blank"
              rel="noopener noreferrer"
              className={iconRowStyles.link}
            >
              Liveline
            </a>{" "}
            — where the current value stays fixed at a set x-position while only
            the y-value moves, and historical data scrolls off to the left as new
            points arrive.{" "}
            <span className={styles.highlight}>
              This makes movement easy to track, since the eye only has to follow
              one point rather than a chart repositioning on both axes at once,
            </span>{" "}
            while also giving the chart more room to breathe.
          </>
        ),
      },
    ],
    inlineAlertContent: [
      {
        type: "videoGallery",
        videos: ["/videos/inline-alert-old.mp4", "/videos/inline-alert.mp4"],
      },
      {
        type: "paragraph",
        text: (
          <>
            Previously, there was no differentiation between alert types, a
            serious risk warning looked identical to a simple informational
            nudge. I addressed this by introducing warning and danger alerts on
            top of informational ones,{" "}
            <span className={styles.highlight}>
              differentiated by coloured backgrounds and triangle warning fill
              icons that stand out clearly against the black background, so
              severity is legible at a glance.
            </span>
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            Given that we had introduced multiple types of alerts, I wanted to
            tackle corner cases where users had multiple alerts, and help users
            digest info hierarchy by grouping related alerts together. I also
            allowed them to condense to save space,{" "}
            <span className={styles.highlight}>
              capping the total number of alerts at three visible at once. They
              must be ordered by severity: danger, then warning, then info.
            </span>{" "}
            Ideally, we could analyse real usage data on how often more than
            three alerts could realistically appear at once, to validate whether
            this limit suited the app&apos;s needs.
          </>
        ),
      },
    ],
  },
  {
    slug: "screenshot-to-figma",
    context: [
      <>
        As Crypto.com&apos;s product suite grew, the existing design didn&apos;t scale
        with it. New features were Frankenstein-ed onto the existing design
        foundation instead of the foundation being revisited to accommodate them.
        So we decided to revisit that foundation, from the components (read more
        about it{" "}
        <TransitionLink href="/work/design-system-revamp" className={iconRowStyles.link}>
          here
        </TransitionLink>
        ) to the flow of our core features (read more about it{" "}
        <TransitionLink href="/work/feature-flow-revamp" className={iconRowStyles.link}>
          here
        </TransitionLink>
        ). But with a tight ~3-month timeline,{" "}
        <span className={styles.highlight}>
          it&apos;s faster for designers to rebuild what they already know than to
          genuinely explore something new.
        </span>
      </>,
      <>
        Was there a way I could lower the barrier to exploration? Exploration is
        critical to robust designs, and competitor analysis is the typical way
        designers explore.{" "}
        <span className={styles.highlight}>
          What if I could take it further and see how competitor designs can be
          restyled to our new design system rules?
        </span>{" "}
        Manually restyling each screen clearly isn&apos;t a productive use of time,
        so I turned to AI to see if I could automate this process.
      </>,
    ],
    scope: {
      time: "~2.5 days in Apr 2026",
      toolsUsed: "Cursor · Figma",
      model: "Claude Opus 4.6 / Sonnet 4.6",
    },
    whatIBuilt: [
      "Turns a screenshot of any UI component into a Figma frame with typography, spacing and colours restyled to match our design system.",
    ],
    video: "/videos/screenshot-to-figma.mp4",
    whatIBuiltVideoFullWidth: true,
    processContent: [
      {
        type: "paragraph",
        text: "This started as a side project born out of curiosity, but I didn't know where it was going to take me, or if it would even work. To break down this ambitious idea of mine, I wanted to get a proof of concept working first.",
      },
      {
        type: "paragraph",
        text: (
          <>
            First, Cursor needed to understand my project before it could help
            execute it. Designers should be able to screenshot any component they
            liked from another app, drop it into a website, and{" "}
            <span className={styles.highlight}>
              have it converted into an image of the same component style using
              our new design system&apos;s colours, font styles, and spacing.
            </span>
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            I chose to build this as a standalone website rather than a more
            AI-native approach which would have been much simpler to setup such as
            a Cursor skill. AI adoption was still early at the company, and I
            wanted anyone to be able to use it,{" "}
            <span className={styles.highlight}>
              I believed this tool had the potential to be especially useful to
              PMs, who have ideas about their products but have a harder time
              visualising it than designers.
            </span>
          </>
        ),
      },
      {
        type: "paragraph",
        text: (
          <>
            For this setup to work,{" "}
            <span className={styles.highlight}>
              Cursor needed a source of truth, the design system variables.
            </span>{" "}
            So I asked it to generate a markdown file describing them, pulled
            directly from our Figma design system file via Figma&apos;s MCP. Then
            I tested whether Cursor actually understood what I wanted: I dropped
            in a component image and asked it to output an HTML preview styled
            with our design system, viewed it on localhost, and tested it across
            images of different components to check accuracy.
          </>
        ),
      },
      {
        type: "paragraph",
        text: "From there, I built the rough outline of the site using Github pages. Drop an image in, hit convert, see the preview. The next step was getting this tool to run on the live site. I needed the website to securely call our company's Claude, hosted on Bedrock, without exposing credentials to anyone visiting the page. A personal access token worked at first, but new company security measures broke that setup, so I had to get the site whitelisted with the security team before it could call the model again.",
      },
      {
        type: "paragraph",
        text: "Once that was working, I added extra features that helped the AI build better context, such as letting users describe the component before converting, and a feedback loop for correcting output.",
      },
      {
        type: "paragraph",
        text: (
          <>
            At this point, we had Screenshot → Preview. I wanted to stretch that
            further and{" "}
            <span className={styles.highlight}>
              get the output directly in Figma.
            </span>{" "}
            If designers could actually use this in their own files, the barrier
            to exploration would drop even further. I discussed with Cursor what
            Figma&apos;s MCP could support, and landed on the most seamless path.
            Generating code from the website that could be pasted into a custom
            Figma plugin. I iterated on the plugin until it produced accurate
            output: frames using auto layout, with spacing, typography, and colour
            all pulled from our actual design system variables.
          </>
        ),
      },
    ] as ProcessBlock[],
    reflections: [
      <>
        If I had more time to spare on this project, I&apos;d want to feed this
        tool more context using other design system elements, such as icons, and
        even components. Ideally, it would be able to screenshot and generate full
        screens rather than standalone components. And if we eventually have a
        more mature design system, one developers had built out in React Native,{" "}
        <span className={styles.highlight}>
          feeding that in as context could get us a lot closer to shippable,
          production ready code.
        </span>
      </>,
      <>
        This project was about taking an existing idea in the design field and
        pushing it further than the industry typically has in the past, asking
        what&apos;s actually possible once AI is part of the process.{" "}
        <span className={styles.highlight}>
          Design and engineering are already blending together,
        </span>{" "}
        and this tool hints at where that could go.
      </>,
    ],
  },
  {
    slug: "tokenized-stocks",
    context: ["[PLACEHOLDER — tokenized-stocks context]"],
    scope: {
      time: "[PLACEHOLDER]",
      toolsUsed: "[PLACEHOLDER]",
      process: "[PLACEHOLDER]",
    },
    whatIBuilt: ["[PLACEHOLDER — what I built]"],
  },
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = workProjects.find((p) => p.slug === slug)?.title;
  return { title: title ?? "Work" };
}

// Cyclic "next 2" order, so across all detail pages every finished project
// shows up in at least one "more like this" list (never left orphaned). WIP
// projects are excluded from the pool entirely — nothing should recommend a
// case study that isn't written yet.
function getMoreLikeThis(slug: string) {
  // screenshot-to-figma's context directly references both the asset-detail
  // and design-system revamps ("from the components... to the flow of our
  // core features"), so its "more like this" points at those two specifically
  // — asset details left, components/DS right — instead of the generic cycle.
  if (slug === "screenshot-to-figma") {
    return [
      workProjects.find((p) => p.slug === "feature-flow-revamp")!,
      workProjects.find((p) => p.slug === "design-system-revamp")!,
    ];
  }

  const recommendable = workProjects.filter((p) => !p.wip);
  const index = recommendable.findIndex((p) => p.slug === slug);
  const start = index === -1 ? 0 : index;
  return [
    recommendable[(start + 1) % recommendable.length],
    recommendable[(start + 2) % recommendable.length],
  ];
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const workProject = workProjects.find((p) => p.slug === slug);
  const title = workProject?.title;

  if (!project || !workProject || !title) {
    notFound();
  }

  const content = (
    <>
      <div className="grid grid-cols-1 items-center gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        <div className="min-w-0 tablet:col-span-6 desktop:col-span-4">
          <WorkHeroImage
            image={workProject.image}
            imageDark={workProject.imageDark}
            alt={title}
            width={workProject.heroWidth}
            height={workProject.heroHeight}
          />
        </div>
        <h1 className="font-sans font-semibold text-header tablet:text-body desktop:text-header text-content-primary tablet:col-span-6 desktop:col-span-8">
          {title}
        </h1>
      </div>
      <section className="relative pt-page-y tablet:pt-section-gap pb-page-y [--spacing-section-gap:18px] tablet:[--spacing-section-gap:80px]">
        <Seam />
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          CONTEXT
        </h2>
        <div className="flex flex-col gap-card-text-gap px-page-x py-page-y">
          {project.context.map((paragraph, index) => (
            <p key={index} className={`font-sans font-medium text-body ${styles.secondaryText}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section className="relative pt-section-gap pb-page-y">
        <Seam />
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          SCOPE
        </h2>
        <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
          <div className="flex flex-col gap-y-card-row-gap tablet:col-span-6">
            <div>
              <p className="font-sans font-medium text-nav text-content-secondary">
                Time
              </p>
              <p className="font-sans font-medium text-body text-content-primary">
                {project.scope.time}
              </p>
            </div>
            <div>
              <p className="font-sans font-medium text-nav text-content-secondary">
                Tools used
              </p>
              <p className="font-sans font-medium text-body text-content-primary">
                {project.scope.toolsUsed}
              </p>
            </div>
          </div>
          <div className="tablet:col-span-6">
            <p className="font-sans font-medium text-nav text-content-secondary">
              {"model" in project.scope ? "Model" : "Process"}
            </p>
            <p className="font-sans font-medium text-body text-content-primary">
              {"model" in project.scope ? project.scope.model : project.scope.process}
            </p>
          </div>
        </div>
      </section>
      <TextSection
        heading="WHAT I BUILT"
        paragraphs={project.whatIBuilt}
        video={"video" in project ? project.video : undefined}
        videoFullWidth={
          "whatIBuiltVideoFullWidth" in project ? project.whatIBuiltVideoFullWidth : false
        }
        secondary
      />
      {"builtContent" in project && renderBuiltBlocks(project.builtContent)}
      {"inputAmountContent" in project && (
        <BuiltSection heading="INPUT AMOUNT" blocks={project.inputAmountContent} />
      )}
      {"priceChartContent" in project && (
        <BuiltSection heading="PRICE CHART" blocks={project.priceChartContent} />
      )}
      {"inlineAlertContent" in project && (
        <BuiltSection heading="INLINE ALERT" blocks={project.inlineAlertContent} />
      )}
      {"processContent" in project && (
        <section className="relative pt-section-gap pb-page-y">
          <Seam />
          <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
            PROCESS
          </h2>
          <div className={`${styles.content} px-page-x py-page-y`}>
            {project.processContent.map((block, index) =>
              block.type === "image" ? (
                <ExpandableImage
                  key={index}
                  src={block.src}
                  alt={block.alt}
                  width={1235}
                  height={1999}
                  className={styles.floatImage}
                />
              ) : (
                <p
                  key={index}
                  className={`mb-card-text-gap font-sans font-medium text-body ${styles.secondaryText}`}
                >
                  {block.text}
                </p>
              ),
            )}
          </div>
        </section>
      )}
      {"reflections" in project && (
        <TextSection heading="REFLECTIONS" paragraphs={project.reflections} paragraphGap secondary />
      )}
      <WorkSection heading="MORE LIKE THIS" items={getMoreLikeThis(slug)} lastOnPage />
    </>
  );

  return workProject.locked ? <WorkDetailGate>{content}</WorkDetailGate> : content;
}
