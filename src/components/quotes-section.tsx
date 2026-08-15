"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Seam } from "./seam";
import styles from "./quotes-section.module.css";

const filters = ["Design Directors", "Product Designers", "Engineers"];

const noteColors = [
  "bg-note-blue",
  "bg-note-green",
  "bg-note-teal",
  "bg-note-purple",
  "bg-note-lime",
  "bg-note-pink",
  "bg-note-coral",
  "bg-note-yellow",
];

type Quote = { quote: string; attribution: string };

// Product Managers tab and the second Engineers quote are hidden for now —
// no real content for either yet. Re-add once given.
const quotesByFilter: Record<string, Quote[]> = {
  "Design Directors": [
    {
      quote:
        "I'm very confident to recommend Si Min as a product designer. She possesses an innate natural ability for design, in combination with a skillset and motivation to learn and adapt to any project she approaches.",
      attribution: "Jonah Grindler · VP, Head of Design @ Crypto.com",
    },
    {
      quote:
        "Si Min's ability to navigate complex design challenges with enthusiasm and precision makes her an asset to any team. I am confident that her proactive approach, attention to detail, and unwavering commitment to quality will continue to drive her success in the field of UX design.",
      attribution: "Joel Ling · Design Lead @ IBM iX",
    },
  ],
  "Product Designers": [
    {
      quote:
        "I had the pleasure of working with Si Min at CDC when she was a recent graduate with valuable UI/UX internship experience. She learns quickly, is dependable, and has a keen eye for detail. I was particularly impressed by her thoughtful involvement in user interviews and competitor research for our equities product. Her contributions helped strengthen the user journey and overall design. She would be a valuable addition to any team, and I look forward to seeing where her career takes her.",
      attribution: "Sally Kau · Senior Product Designer @ Crypto.com",
    },
    {
      quote:
        "I enjoyed working with Si Min during her internship at IBM. She's thoughtful, meticulous, and has a great eye for detail, while also being quick to understand problems and think things through. She's easy to work with, and I'd be very happy to work with her again.",
      attribution: "Clifford Goh · User Experience Designer @ IBM",
    },
  ],
  Engineers: [
    {
      quote:
        "Si Min is an exceptional designer who constantly looks for ways to communicate more efficiently with engineers. Working with her creates a positive feedback loop where we can collaborate on diverse solutions and continuously improve design management.",
      attribution: "Marcus Yip · SVP, Software Engineering @ Crypto.com",
    },
  ],
};

export function QuotesSection() {
  const [selected, setSelected] = useState(0);
  const quotes = quotesByFilter[filters[selected]];
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative pt-section-gap pb-page-y">
      <Seam />
      <h2 className="px-page-x py-page-y font-sans font-bold text-title tracking-title text-heading">
        QUOTES
      </h2>
      <div className="relative">
        <div className={`${styles.filterRow} flex gap-button-gap px-page-x pt-page-y pb-filter-row-end`}>
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              data-selected={selected === index || undefined}
              className={`${styles.filterButton} shrink-0 font-sans font-medium text-nav text-content-primary`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className={styles.filterFadeLeft} aria-hidden="true" />
        <div className={styles.filterFadeRight} aria-hidden="true" />
      </div>
      <div className={`${styles.grid} items-start gap-card-spacing px-page-x py-page-y`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {quotes.map((quote, index) => (
            <motion.div
              key={`${selected}-${index}`}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              style={{ borderRadius: 12 }}
              className={`flex min-w-0 flex-col gap-card-text-gap ${noteColors[(selected * 2 + index) % noteColors.length]} p-page-y`}
            >
              <p className="break-words font-sans font-medium text-body text-content-primary">
                {quote.quote}
              </p>
              <p className="font-sans font-medium text-nav text-content-secondary">
                {quote.attribution}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
