"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Quote, Loader2, ArrowDown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

export type FeedbackItem = {
  _id: string;
  message: string;
  name?: string;
  submittedAt: string;
  reactions?: {
    likes?: number; // 👍
    hearts?: number; // ❤️
    parties?: number; // 🎉
  };
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

  // Mobile: Almost full width to show shadows
  const mobileClass = "w-[calc(100%-2px)] mx-auto";

  // Desktop: specific widths
  if (messageLength < 40)
    return `${mobileClass} md:min-w-[300px] md:w-[300px] md:mx-0`;
  if (messageLength > 180)
    return `${mobileClass} md:min-w-[500px] md:w-[500px] md:mx-0`;

  if (rand < 0.33)
    return `${mobileClass} md:min-w-[350px] md:w-[350px] md:mx-0`;
  if (rand < 0.66)
    return `${mobileClass} md:min-w-[420px] md:w-[420px] md:mx-0`;
  return `${mobileClass} md:min-w-[460px] md:w-[460px] md:mx-0`;
}

type Props = {
  items: FeedbackItem[];
  newestId?: string | null;
  loadMore: () => void;
  hasMore: boolean;
  isSearching: boolean;
  onRefresh?: () => Promise<void>;
};

function getCardStyle(index: number) {
  const seed = index * 1337;
  const rand = pseudoRandom(seed);
  const rotate = (rand - 0.5) * 4; // -2 to +2 degrees
  const translateY = (pseudoRandom(seed + 1) - 0.5) * 20; // -10px to +10px

  return {
    rotate,
    translateY,
  };
}

const COLORS = [
  "#4432F5",
  "#6457F0",
  "#a5b4fc",
  "#FFD700",
  "#ffffff",
  "#f472b6",
];

// Floating reaction with quantity component
function FloatingReaction({
  emoji,
  leftOffset,
}: {
  emoji: string;
  leftOffset: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: "-50%", scale: 0.5 }}
      animate={{
        opacity: [1, 1, 0],
        y: -150, // Move up 150px
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute bottom-12 pointer-events-none z-50 text-xl font-bold text-brand-primary flex items-center gap-1"
      style={{ left: leftOffset }}
    >
      <span>+1</span>
      <span>{emoji}</span>
    </motion.div>
  );
}

function FeedbackCard({
  item,
  index,
  isNew,
  isMobile,
}: {
  item: FeedbackItem;
  index: number;
  isNew: boolean;
  isMobile: boolean;
}) {
  const widthClasses = getCardWidth(index, item.message.length);
  const { rotate, translateY } = getCardStyle(index);

  // Disable scattering on mobile
  const effectiveRotate = isMobile ? 0 : rotate;
  const effectiveTranslateY = isMobile ? 0 : translateY;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "50px 0px 0px 0px" });

  const displayName = item.name || "Anonymous";

  // Reactions state
  const [reactions, setReactions] = useState(
    item.reactions || { likes: 0, hearts: 0, parties: 0 },
  );

  // Sync reactions if prop changes (e.g. from subscription)
  useEffect(() => {
    if (item.reactions) {
      setReactions(item.reactions);
    }
  }, [item.reactions]);

  const [userVotes, setUserVotes] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`votes_${item._id}`);
      if (stored) {
        setUserVotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load votes", e);
    }
  }, [item._id]);

  const [hasReacted, setHasReacted] = useState(false);
  // Track active bursts -> { id: uniqueId, emoji: "👍", left: "20px" }
  const [activeBursts, setActiveBursts] = useState<
    { id: number; emoji: string; left: string }[]
  >([]);

  const handleReaction = async (
    type: "likes" | "hearts" | "parties",
    emoji: string,
    leftOffset: string,
  ) => {
    if (userVotes[type]) return;

    // Add a new burst
    const burstId = Date.now();
    setActiveBursts((prev) => [
      ...prev,
      { id: burstId, emoji, left: leftOffset },
    ]);

    // Remove it after animation duration (e.g. 1.2s + buffer)
    setTimeout(() => {
      setActiveBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 1500);

    const amount = 1;

    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + amount,
    }));

    const newVotes = { ...userVotes, [type]: true };
    setUserVotes(newVotes);
    localStorage.setItem(`votes_${item._id}`, JSON.stringify(newVotes));

    try {
      await fetch("/api/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id, reaction: type, amount }),
      });
    } catch (err) {
      console.error("Failed to react", err);
      setReactions((prev) => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 0) - amount),
      }));
      const revertedVotes = { ...userVotes, [type]: false };
      setUserVotes(revertedVotes);
      localStorage.setItem(`votes_${item._id}`, JSON.stringify(revertedVotes));
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={
        isNew
          ? {
              opacity: 1,
              rotate: 0,
              boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
            }
          : isInView
            ? {
                opacity: 1,
                rotate: effectiveRotate, // Apply scattered rotation
                boxShadow: "0 4px 12px rgba(15,23,42,0.18)",
              }
            : {}
      }
      style={{
        marginTop: `${effectiveTranslateY}px`, // Apply scattered vertical offset
      }}
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
      className={`h-auto ${widthClasses} shrink-0 select-none relative rounded-2xl md:rounded-3xl border transition-all group overflow-visible
        bg-white border-slate-200/80 text-slate-900 shadow-sm hover:shadow-md md:hover:shadow-xl hover:border-slate-300
        dark:bg-brand-surface dark:border-brand-border dark:text-brand-text dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)] dark:hover:border-brand-primary/50 dark:hover:shadow-[0_8px_20px_rgba(99,102,241,0.15)]`}
    >
      <div className="relative h-full whitespace-normal flex flex-col">
        <div className="relative z-10 p-4 md:p-6 pb-2 md:pb-3 flex flex-col grow">
          {/* Message */}
          <div className="mb-2 md:mb-4 space-y-1.5">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-brand-surface-2/80 text-slate-600 dark:text-brand-text/80 w-7 h-7 md:w-8 md:h-8 mb-0.5">
              <Quote size={13} className="md:w-3.75 md:h-3.75" />
            </div>
            <p className="text-[15px] leading-normal md:text-[15px] font-medium md:leading-relaxed tracking-wide text-brand-text wrap-break-word whitespace-normal font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
              {renderMessage(item.message)}
            </p>
          </div>

          <div className="mt-auto pt-1 flex items-center justify-between gap-2">
            <span className="text-xs md:text-[13px] font-medium text-brand-muted text-right leading-snug ml-auto">
              — {displayName}
            </span>
          </div>
        </div>

        {/* Reactions Bar */}
        <div className="relative px-4 pb-4 md:px-6 md:pb-6 pt-2 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("likes", "👍", "40px");
            }}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors active:scale-95 ${
              userVotes.likes
                ? "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40"
                : "text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20"
            }`}
            title="Like"
          >
            <span>👍</span>
            <span className="font-semibold">{reactions.likes || 0}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("hearts", "❤️", "100px");
            }}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors active:scale-95 ${
              userVotes.hearts
                ? "text-pink-600 bg-pink-100 dark:text-pink-300 dark:bg-pink-900/40"
                : "text-slate-500 hover:text-pink-500 hover:bg-pink-50 dark:text-slate-400 dark:hover:text-pink-400 dark:hover:bg-pink-900/20"
            }`}
            title="Love"
          >
            <span>❤️</span>
            <span className="font-semibold">{reactions.hearts || 0}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("parties", "🎉", "160px");
            }}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-colors active:scale-95 ${
              userVotes.parties
                ? "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40"
                : "text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/20"
            }`}
            title="Celebrate"
          >
            <span>🎉</span>
            <span className="font-semibold">{reactions.parties || 0}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeBursts.map((burst) => (
          <FloatingReaction
            key={burst.id}
            emoji={burst.emoji}
            leftOffset={burst.left}
          />
        ))}
      </AnimatePresence>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (items.length === 0) {
    if (isSearching) {
      return (
        <div className="fixed inset-0 flex select-none flex-col items-center justify-center pt-16 pb-15 text-center">
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
      <div className="fixed inset-0 flex select-none flex-col items-center justify-center pt-16 pb-15 text-center px-4">
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

  const pullDownConfig = onRefresh
    ? {
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
        ),
      }
    : {};

  return (
    <div
      id="scrollableDiv"
      className="fixed inset-0 pt-18 pb-0 px-4 md:px-8 mt-0 overflow-y-auto scroll-smooth"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="shrink-0 w-full h-20 flex items-center justify-center">
            <h4 className="text-slate-400">Loading...</h4>
          </div>
        }
        scrollableTarget="scrollableDiv"
        className="flex flex-col md:flex-row md:flex-wrap md:justify-center md:items-center pt-6 md:pt-12 w-full mx-auto h-auto pb-32 md:pb-20 gap-y-4 md:gap-y-8 gap-x-8"
        {...pullDownConfig}
      >
        {items.map((item, index) => (
          <FeedbackCard
            key={item._id}
            item={item}
            index={index}
            isNew={item._id === newestId}
            isMobile={isMobile}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
