"use client";

import { HourglassSimpleMediumIcon, LockIcon, LockOpenIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { PASSCODE_VERIFIED_KEY } from "@/lib/passcode";
import { useIsDark } from "@/lib/use-is-dark";
import { useMediaErrorIconSize } from "@/lib/use-media-error-icon-size";
import { useMediaLoaded } from "@/lib/use-media-loaded";
import { workProjects, type WorkProject } from "@/lib/work-projects";
import { MediaError } from "./media-error";
import { PasscodeModal } from "./passcode-modal";
import { useNavigate } from "./route-transition";
import { Seam } from "./seam";
import { TransitionLink } from "./transition-link";
import styles from "./work-section.module.css";

function CardImage({
  src,
  alt,
  priority = false,
  // WIP cards already show their own always-on overlay — it doubles as the
  // "nothing to see here" state, so the generic MediaError box shouldn't
  // also render underneath it on a real or previewed failure.
  showErrorState = true,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  showErrorState?: boolean;
}) {
  const { loaded, error, onLoad, onError } = useMediaLoaded(src);
  // The priority card is the page's likely LCP element — skip the fade
  // gate for it too, same reasoning as WorkHeroImage.
  const visible = priority || loaded;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={priority}
        onLoad={onLoad}
        onError={onError}
        className={`${styles.image} transition-opacity duration-300 ease-out ${visible && !error ? "opacity-100" : "opacity-0"}`}
      />
      {error && showErrorState && <MediaError />}
    </>
  );
}

export function WorkSection({
  firstOnPage = false,
  lastOnPage = false,
  heading = "WORK",
  items = workProjects,
  hideHeaderOnMobile = false,
}: {
  firstOnPage?: boolean;
  lastOnPage?: boolean;
  heading?: string;
  items?: readonly WorkProject[];
  hideHeaderOnMobile?: boolean;
}) {
  const [unlockingSlug, setUnlockingSlug] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | undefined>(undefined);
  // Starts false on both server and client to avoid a hydration mismatch
  // (sessionStorage isn't available during SSR) — synced from sessionStorage
  // in the effect below immediately after mount, same pattern Navbar uses
  // for isDark.
  const [unlocked, setUnlocked] = useState(false);
  const isDark = useIsDark();
  const navigate = useNavigate();
  const wipIconSize = useMediaErrorIconSize();

  useEffect(() => {
    // sessionStorage is unavailable during SSR — has to be read post-mount,
    // not via a lazy initializer, or the client's first render would
    // mismatch the server's (see the comment on `unlocked`'s declaration).
    if (sessionStorage.getItem(PASSCODE_VERIFIED_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnlocked(true);
    }
  }, []);

  const unlockingCard = items.find((item) => item.slug === unlockingSlug);

  function closePasscode() {
    setUnlockingSlug(null);
    setPreviewError(undefined);
  }

  function handleVerified() {
    sessionStorage.setItem(PASSCODE_VERIFIED_KEY, "1");
    setUnlocked(true);
    if (unlockingCard) navigate(`/work/${unlockingCard.slug}`);
    // Close right away rather than waiting for the cover to fully hide it:
    // the modal is portalled to <body> and covers the whole viewport
    // (including the navbar), but the cover only ever covers the area below
    // it — leaving the modal open for the whole fade-in would show that
    // mismatch as a seam right at the navbar whenever it's in view. Its own
    // exit fade is quick enough to just blend into the cover rising anyway.
    closePasscode();
  }

  return (
    <section
      className={`relative ${firstOnPage ? "" : hideHeaderOnMobile ? "pt-0 tablet:pt-section-gap" : "pt-section-gap"} ${lastOnPage ? "pb-section-end" : "pb-page-y"}`}
    >
      {!firstOnPage && (
        <Seam className={hideHeaderOnMobile ? "hidden tablet:block" : undefined} />
      )}
      {firstOnPage ? (
        <h1
          className={`px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading ${hideHeaderOnMobile ? "hidden tablet:block" : ""}`}
        >
          {heading}
        </h1>
      ) : (
        <h2
          className={`px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading ${hideHeaderOnMobile ? "hidden tablet:block" : ""}`}
        >
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {items.map((card, index) => {
          const cardBody = (
            <>
              <div
                className={`${styles.imageWrapper} aspect-card w-full rounded-card bg-content-secondary/15`}
              >
                <CardImage
                  src={isDark && card.imageDark ? card.imageDark : card.image}
                  alt={card.title}
                  priority={firstOnPage && index === 0}
                  showErrorState={!card.wip}
                />
                {card.locked && (
                  <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-card bg-background-primary/50 p-1 backdrop-blur-sm tablet:bottom-4 tablet:right-4 tablet:p-2">
                    {unlocked ? (
                      <LockOpenIcon
                        size={ICON_SIZE_SM}
                        weight="fill"
                        className="icon-sm text-content-primary"
                      />
                    ) : (
                      <LockIcon
                        size={ICON_SIZE_SM}
                        weight="fill"
                        className="icon-sm text-content-primary"
                      />
                    )}
                  </div>
                )}
                {card.wip && (
                  // -inset-px (rather than inset-0) deliberately overshoots the
                  // wrapper's edge by 1px on every side — Chrome sometimes
                  // leaves a hairline of the unblurred image visible along a
                  // backdrop-blur element's rounded edge otherwise, since the
                  // blur's own render bounds don't always land exactly flush
                  // with the parent's overflow-hidden clip. imageWrapper's own
                  // overflow: hidden trims the 1px overshoot back to the
                  // correct rounded shape.
                  <div
                    className={`absolute -inset-px flex flex-col items-center justify-center gap-card-text-gap rounded-card p-2 text-center backdrop-blur-sm tablet:p-4 ${isDark ? "bg-scrim/80" : "bg-scrim/90"}`}
                  >
                    <HourglassSimpleMediumIcon size={wipIconSize} weight="fill" className="text-icon" />
                    <p className="font-sans font-medium text-body text-on-scrim">
                      WIP - Check back in a couple days
                    </p>
                  </div>
                )}
              </div>
              <p className="font-sans font-medium text-body text-content-primary">
                {card.title}
              </p>
            </>
          );

          if (card.locked && !unlocked) {
            return (
              <button
                key={card.slug}
                type="button"
                onClick={() => setUnlockingSlug(card.slug)}
                className={`${styles.card} flex flex-col gap-card-text-gap text-left tablet:col-span-6`}
              >
                {cardBody}
              </button>
            );
          }

          if (card.wip) {
            return (
              <div
                key={card.slug}
                className="flex flex-col gap-card-text-gap tablet:col-span-6"
              >
                {cardBody}
              </div>
            );
          }

          return (
            <TransitionLink
              key={card.slug}
              href={`/work/${card.slug}`}
              className={`${styles.card} flex flex-col gap-card-text-gap tablet:col-span-6`}
            >
              {cardBody}
            </TransitionLink>
          );
        })}
      </div>
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={() => {
            const lockedCard = items.find((item) => item.locked);
            if (!lockedCard) return;
            setUnlockingSlug(lockedCard.slug);
            setPreviewError("Something went wrong. Try again.");
          }}
          className="fixed bottom-4 left-[430px] z-[60] rounded-md border border-black/20 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm"
        >
          Preview passcode error
        </button>
      )}
      <PasscodeModal
        open={unlockingCard !== undefined}
        onClose={closePasscode}
        onVerified={handleVerified}
        previewError={previewError}
      />
    </section>
  );
}
