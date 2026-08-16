import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { CrossfadeReveal } from "@/components/crossfade-reveal";
import { DebugGrid } from "@/components/debug-grid";
import { Dev404Link } from "@/components/dev-404-link";
import { DevMediaErrorToggle } from "@/components/dev-media-error-toggle";
import { DevMediaLoadingToggle } from "@/components/dev-media-loading-toggle";
import { DevResetIntroLink } from "@/components/dev-reset-intro-link";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import { Navbar } from "@/components/navbar";
import { PreventOverscrollBounce } from "@/components/prevent-overscroll-bounce";
import { RouteTransition } from "@/components/route-transition";
import "./globals.css";

// Runs before hydration so the initial paint already matches the right theme,
// instead of always starting light and flashing to dark a moment later. A
// saved manual choice (Navbar's toggle, localStorage) wins if one exists;
// otherwise falls back to the visitor's OS preference.
const THEME_INIT_SCRIPT = `
  try {
    var saved = localStorage.getItem("theme");
    var isDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  } catch (e) {}
`;

// Reloading (or opening a direct link) always lands at the top of the page,
// instead of the browser restoring wherever the scroll position happened to
// be last time. Runs before hydration so there's no flash of the restored
// position first.
const SCROLL_RESET_SCRIPT = `
  try {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    var scrollRoot = document.getElementById("scroll-root");
    if (scrollRoot) scrollRoot.scrollTop = 0;
  } catch (e) {}
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://simin.design";
const SITE_NAME = "Si Min Lee";
const SITE_TITLE = "Si Min Lee — Product Designer";
const SITE_DESCRIPTION =
  "Si Min Lee is a product designer specialising in fintech, design systems, and AI-powered tools. Previously @ Crypto.com and IBM.";

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { template: "%s · Si Min Lee", default: SITE_TITLE },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Keeps the visual viewport fixed when the on-screen keyboard opens (the
// passcode input) — the default behavior instead shrinks it to make room,
// which drags every `fixed inset-0` overlay (the modal's own backdrop) along
// with it: a visible jump when the keyboard shows, and another when it
// hides on close, since that resize lags slightly behind the modal's own
// exit animation. Overlaying instead of resizing means neither ever fires.
export const viewport: Viewport = {
  interactiveWidget: "overlays-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Script id="scroll-reset" strategy="beforeInteractive">
          {SCROLL_RESET_SCRIPT}
        </Script>
        {process.env.NODE_ENV === "development" && <DebugGrid />}
        {process.env.NODE_ENV === "development" && <Dev404Link />}
        {process.env.NODE_ENV === "development" && <DevResetIntroLink />}
        {process.env.NODE_ENV === "development" && <DevMediaLoadingToggle />}
        {process.env.NODE_ENV === "development" && <DevMediaErrorToggle />}
        <PreventOverscrollBounce />
        <LoadingScreen />
        <div id="scroll-root" className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col rounded-card bg-background-primary">
            <RouteTransition
              navbar={
                <CrossfadeReveal>
                  <Navbar />
                </CrossfadeReveal>
              }
            >
              {children}
            </RouteTransition>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
