"use client";

import { ArrowRightIcon, CircleNotchIcon, LockIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICON_SIZE_SM } from "@/lib/icon-size";
import { useIsDark } from "@/lib/use-is-dark";
import { verifyPasscode } from "@/lib/verify-passcode";
import { workProjects, type WorkProject } from "@/lib/work-projects";
import { Seam } from "./seam";
import styles from "./work-section.module.css";

export function WorkSection({
  firstOnPage = false,
  lastOnPage = false,
  heading = "WORK",
  items = workProjects,
}: {
  firstOnPage?: boolean;
  lastOnPage?: boolean;
  heading?: string;
  items?: readonly WorkProject[];
}) {
  const [unlockingSlug, setUnlockingSlug] = useState<string | null>(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const isDark = useIsDark();
  const router = useRouter();

  const unlockingCard = items.find((item) => item.slug === unlockingSlug);

  function closePasscode() {
    setUnlockingSlug(null);
    setPasscodeInput("");
    setPasscodeError(false);
    setIsVerifying(false);
  }

  async function handleSubmitPasscode() {
    if (!unlockingCard || !passcodeInput.trim() || isVerifying) return;
    setIsVerifying(true);
    const isCorrect = await verifyPasscode(passcodeInput);
    if (isCorrect) {
      router.push(`/work/${unlockingCard.slug}`);
      closePasscode();
    } else {
      setPasscodeError(true);
      setIsVerifying(false);
    }
  }

  return (
    <section
      className={`relative ${firstOnPage ? "" : "pt-section-gap"} ${lastOnPage ? "pb-[48px] tablet:pb-[96px]" : "pb-page-y"}`}
    >
      {!firstOnPage && <Seam />}
      {!firstOnPage && (
        <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
          {heading}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-x-card-spacing gap-y-card-row-gap px-page-x py-page-y tablet:grid-cols-12">
        {items.map((card) => {
          const cardBody = (
            <>
              <div className={`${styles.imageWrapper} aspect-card w-full rounded-card`}>
                <Image
                  src="/images/work-placeholder.jpg"
                  alt={card.title}
                  fill
                  className={styles.image}
                />
                {card.locked && (
                  <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-card bg-background-primary/50 p-1 backdrop-blur-sm tablet:bottom-4 tablet:right-4 tablet:p-2">
                    <LockIcon
                      size={ICON_SIZE_SM}
                      weight="fill"
                      className="icon-sm text-content-primary"
                    />
                  </div>
                )}
              </div>
              <p className="font-sans font-medium text-body text-content-primary">
                {card.title}
              </p>
            </>
          );

          if (card.locked) {
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

          return (
            <Link
              key={card.slug}
              href={`/work/${card.slug}`}
              className={`${styles.card} flex flex-col gap-card-text-gap tablet:col-span-6`}
            >
              {cardBody}
            </Link>
          );
        })}
      </div>
      {unlockingCard && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-8 backdrop-blur-lg ${isDark ? "bg-[#000000]/50" : "bg-[#000000]/75"}`}
        >
          <button
            type="button"
            onClick={closePasscode}
            aria-label="Close"
            className="absolute right-page-x top-page-y transition-transform duration-150 active:scale-[0.97]"
          >
            <XIcon size={ICON_SIZE_SM} weight="regular" className="text-white" />
          </button>
          <div className="grid max-w-full grid-cols-1 gap-card-text-gap">
            <p className="font-sans font-medium text-body text-white">Enter password</p>
            <div className="flex items-center gap-card-text-gap">
              <input
                type="password"
                autoFocus
                value={passcodeInput}
                onChange={(event) => {
                  setPasscodeInput(event.target.value);
                  setPasscodeError(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSubmitPasscode();
                }}
                className="h-[52px] w-full min-w-0 rounded-card border-2 border-white bg-transparent px-3 font-sans font-medium text-body text-white focus:border-[#75ACF0]"
              />
              <button
                type="button"
                onClick={handleSubmitPasscode}
                disabled={!passcodeInput.trim() || isVerifying}
                aria-label="Submit password"
                className={`group flex shrink-0 items-center justify-center rounded-full bg-[#242424]/50 p-2 backdrop-blur-sm transition-[opacity,transform] duration-150 active:scale-[0.97] ${
                  passcodeInput.trim()
                    ? "opacity-100 hover:bg-[#EEEAE3]"
                    : "pointer-events-none opacity-30"
                }`}
              >
                {isVerifying ? (
                  <CircleNotchIcon
                    size={20}
                    weight="bold"
                    className="animate-spin text-[#EEEAE3] group-hover:text-[#242424]"
                  />
                ) : (
                  <ArrowRightIcon
                    size={20}
                    weight="fill"
                    className="text-[#EEEAE3] group-hover:text-[#242424]"
                  />
                )}
              </button>
            </div>
            <p
              className={`font-sans font-medium text-nav text-[#F07575] ${passcodeError ? "visible" : "invisible"}`}
            >
              Incorrect password. Try again.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
