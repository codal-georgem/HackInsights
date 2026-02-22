"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { Quote, Loader2, ArrowDown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

export type FeedbackItem = {
  _id: string;
  message: string;
  name?: string;
  submittedAt: string;
};

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

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getCardWidth(index: number, messageLength: number) {
  const seed = index * 1337;
  const rand = pseudoRandom(seed);
  
  // Mobile: Full width
  const mobileClass = "w-full";
  
  // Desktop: specific widths
  if (messageLength < 40) return `${mobileClass} md:min-w-[300px] md:w-[300px]`;
  if (messageLength > 180) return `${mobileClass} md:min-w-[500px] md:w-[500px]`;
  
  if (rand < 0.33) return `${mobileClass} md:min-w-[350px] md:w-[350px]`;
  if (rand < 0.66) return `${mobileClass} md:min-w-[420px] md:w-[420px]`;
  return `${mobileClass} md:min-w-[460px] md:w-[460px]`;
}

type Props = {
  items: FeedbackItem[];
  newestId?: string | null;
  loadMore: () => void;
  hasMore: boolean;
  isSearching: boolean;
  onRefresh?: () => Promise<void>;
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
  const widthClasses = getCardWidth(index, item.message.length);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "50px 0px 0px 0px" });

  const displayName = item.name || "Anonymous";

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
            x: 0,
            rotate: 0,
            filter: ["blur(10px)", "blur(0px)"],
            boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
          }
          : isInView
            ? {
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
              rotate: 0,
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
        y: -4, // Lift up instead of push down
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.18 },
      }}
      className={`h-auto md:h-[90%] ${widthClasses} flex-shrink-0 cursor-pointer select-none relative rounded-2xl md:rounded-3xl border transition-all group overflow-visible
        bg-white border-slate-200/80 text-slate-900 shadow-sm hover:shadow-xl hover:border-slate-300 mx-0 mb-0 md:mb-0 md:mx-0
        dark:bg-brand-card-bg dark:border-brand-border/60 dark:text-brand-text dark:shadow-[0_8px_24px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.8)]`}
    >
      <div className="relative h-full whitespace-normal">
        <div className="relative z-10 p-4 md:p-6 flex flex-col h-full">
          {/* Message */}
          <div className="mb-2 md:mb-4 space-y-1.5">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-brand-surface-2/80 text-slate-600 dark:text-brand-text/80 w-7 h-7 md:w-8 md:h-8 mb-0.5">
              <Quote size={13} className="md:w-[15px] md:h-[15px]" />
            </div>
            <p className="text-[15px] leading-normal md:text-[15px] font-medium md:leading-relaxed tracking-wide text-brand-text break-words whitespace-normal font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
              {renderMessage(item.message)}
            </p>
          </div>

          <div className="mt-auto pt-1 flex items-center justify-between gap-2">
            <span className="text-xs md:text-[13px] font-medium text-brand-muted text-right leading-snug ml-auto">
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
  onRefresh,
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

  const pullDownConfig = onRefresh ? {
    pullDownToRefresh: true,
    pullDownToRefreshThreshold: 80,
    refreshFunction: onRefresh,
    pullDownToRefreshContent: (
      <div className="w-full h-16 flex items-center justify-center z-10 relative md:hidden">
        <div className="flex items-center gap-2 text-slate-500 bg-white/80 dark:bg-black/80 px-4 py-2 rounded-full shadow-sm border border-slate-200/50 dark:border-white/10 transition-transform duration-200 ease-out scale-95 opacity-80">
          <ArrowDown className="h-4 w-4 animate-bounce text-brand-primary" />
          <span className="text-sm font-medium">Pull down to refresh</span>
        </div>
      </div>
    ),
    releaseToRefreshContent: (
      <div className="w-full h-16 flex items-center justify-center z-10 relative md:hidden">
        <div className="flex items-center gap-2 text-brand-primary bg-white/90 dark:bg-black/90 px-4 py-2 rounded-full shadow-md border border-brand-primary/20 transition-all duration-200 scale-100">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Updating feed...</span>
        </div>
      </div>
    )
  } : {};

  return (
    <div
      id="scrollableDiv"
      className="fixed inset-0 pt-[72px] md:pt-[72px] pb-0 px-4 md:px-8 mt-0 overflow-y-auto md:overflow-x-auto md:overflow-y-visible scroll-smooth"
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex-shrink-0 w-full h-20 md:h-full md:w-[100px] flex items-center justify-center">
            <h4 className="text-slate-400">Loading...</h4>
          </div>
        }
        scrollableTarget="scrollableDiv"
        className="flex flex-col md:flex-row md:flex-nowrap md:items-start pt-6 md:pt-4 w-full md:min-w-full md:w-max md:mx-auto h-auto md:h-full pb-32 md:pb-10 gap-x-4 gap-y-6 md:gap-y-0" 
        {...pullDownConfig}
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
