"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Star } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

export type FeedbackItem = {
  _id: string;
  message: string;
  name?: string;
  submittedAt: string;
  rating?: number;
};

// Parse **bold** and *italic* markers into React nodes
function renderMessage(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong
          key={i}
          className="font-bold text-brand-primary dark:text-brand-primary-light"
        >
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*") && part.endsWith("*"))
      return (
        <em key={i} className="italic text-slate-500 dark:text-slate-400">
          {part.slice(1, -1)}
        </em>
      );
    return part;
  });
}

// Pseudo-random function for consistent visuals
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getCardVisuals(index: number, messageLength: number) {
  const seed = index * 1337;
  const rand = pseudoRandom(seed);
  // Random rotation between -2 and 2 degrees
  const rotate = rand * 4 - 2;
  // Random horizontal offset between -5px and 5px
  const x = rand * 10 - 5;

  // Dynamic width class based on random factor AND message length
  // On mobile: Force smaller widths to fit more items. TARGET: 23% (4 per row) or 31% (3 per row)
  // On desktop: Use the varying widths for masonry feel
  let widthClass = "w-[23%] md:w-auto md:max-w-sm"; // default small

  if (messageLength < 40) {
    widthClass = "w-[23%] md:w-auto md:max-w-[200px]"; // 4 per row
  } else if (messageLength > 150) {
    widthClass = "w-[48%] md:w-auto md:max-w-md"; // 2 per row
  } else {
    // Medium content
    if (rand < 0.5) widthClass = "w-[23%] md:w-auto md:max-w-xs";
    else widthClass = "w-[31%] md:w-auto md:max-w-[300px]";
  }

  return { rotate, x, widthClass };
}

type Props = {
  items: FeedbackItem[];
  newestId?: string | null;
  loadMore: () => void;
  hasMore: boolean;
  isSearching: boolean;
};

function FeedbackCard({
  item,
  index,
  isNew,
}: {
  item: FeedbackItem;
  index: number;
  isNew: boolean;
}) {
  const { rotate, x, widthClass } = getCardVisuals(index, item.message.length);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "50px 0px 0px 0px" });

  const displayName = item.name || "Anonymous";
  const rating = Math.min(5, Math.max(1, item.rating ?? 5));

  return (
    <motion.div
      ref={ref}
      initial={
        isNew
          ? { opacity: 0, scale: 0.8, y: 50, x: 0 }
          : { opacity: 0, scale: 0.95, y: 20, x: 0 }
      }
      animate={
        isNew
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
              x: x,
              rotate: [0, rotate],
              filter: ["blur(10px)", "blur(0px)"],
              boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
            }
          : isInView
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                x: x,
                rotate: rotate,
                filter: "blur(0px)",
                boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
              }
            : {}
      }
      transition={
        isNew
          ? { duration: 0.8, ease: "backOut" }
          : { duration: 0.5, delay: index * 0.02 }
      }
      whileHover={{
        scale: 1.01,
        y: 2,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.18 },
      }}
      className={`inline-block ${widthClass} ${index < 4 ? "mt-[10px]" : ""} cursor-pointer select-none mx-[1px] md:mx-3 relative rounded-2xl md:rounded-3xl border transition-all group overflow-visible
        bg-white border-slate-200/80 text-slate-900 shadow-sm hover:shadow-md hover:border-slate-300
        dark:bg-brand-card-bg dark:border-brand-border/60 dark:text-brand-text dark:shadow-[0_8px_24px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.8)]`}
    >
      <div className="relative h-full">
        <div className="relative z-10 p-2 md:p-5 flex flex-col h-full">
          {/* Message */}
          <div className="mb-2 md:mb-4 space-y-1.5">
            {/* Quote Icon badge */}
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-brand-surface-2/80 text-slate-600 dark:text-brand-text/80 w-7 h-7 md:w-8 md:h-8 mb-0.5">
              <Quote size={13} className="md:w-[15px] md:h-[15px]" />
            </div>
            <p className="text-[11px] sm:text-sm md:text-[15px] font-medium leading-relaxed md:leading-relaxed tracking-wide text-brand-text line-clamp-6">
              {renderMessage(item.message)}
            </p>
          </div>

          {/* Footer: Stars + name inline */}
          <div className="mt-auto pt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < rating;
                return (
                  <Star
                    key={i}
                    size={12}
                    className={
                      filled
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-300 dark:text-brand-border/70"
                    }
                  />
                );
              })}
            </div>
            <span className="text-[9px] md:text-xs font-medium text-brand-muted text-right leading-snug">
              — {displayName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeedbackWall({
  items,
  newestId,
  loadMore,
  hasMore,
  isSearching,
}: Props) {
  if (items.length === 0) {
    if (isSearching) {
      return (
        <div className="fixed inset-0 flex select-none flex-col items-center justify-center pt-16 pb-[60px] text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-brand-surface-2 text-slate-400 dark:text-brand-muted">
            <Quote className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-lg font-medium text-brand-text mb-1">
            No feedback found
          </p>
          <p className="text-sm text-brand-muted max-w-xs mx-auto">
            {`We couldn't find any messages matching your search. Try a different keyword?`}
          </p>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex select-none flex-col items-center justify-center pt-16 pb-[60px] text-center px-4">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary animate-pulse">
          <Quote className="h-10 w-10" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-brand-text mb-2">
          No thoughts yet
        </h3>
        <p className="items-center text-sm md:text-base text-brand-muted max-w-md mx-auto leading-relaxed">
          Be the first to create a ripple. <br />
          Share your experience and help shape the future.
        </p>
      </div>
    );
  }

  return (
    <div
      id="scrollableDiv"
      className="fixed inset-0 overflow-y-auto pt-24 pb-20 px-4 md:px-8"
    >
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <h4 className="w-full text-center text-slate-400 py-4">Loading...</h4>
        }
        scrollableTarget="scrollableDiv"
        className="mx-auto max-w-[1920px] flex flex-wrap justify-center items-start content-start gap-4 sm:gap-6 md:gap-8 pb-10" // removed mt-10, handled by parent pt
      >
        {items.map((item, index) => (
          <FeedbackCard
            key={item._id}
            item={item}
            index={index}
            isNew={item._id === newestId}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
