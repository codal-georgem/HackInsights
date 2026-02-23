"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Heart, Sparkles, Code2, Trophy, X } from "lucide-react";

type Organizer = {
  name: string;
  role: string;
  image: string;
  gradient: string;
};

type Props = {
  organizers: Organizer[];
  onClose: () => void;
};

export default function OrganizersFlipCard({ organizers, onClose }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className="group relative w-full h-full perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {/* Front Face: Header + Organizers Grid */}
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-[#1a1d2d] rounded-lg sm:rounded-3xl shadow-xl border border-slate-100 dark:border-brand-border/50 flex flex-col overflow-hidden">
            {/* Header Section (Duplicated for Front) */}
            <div className="relative h-28 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4432F5] via-[#6366f1] to-[#8b5cf6]" />
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
              
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, white 2px, transparent 2px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  The Visionaries
                </h2>
              </div>


              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                role="button"
                aria-label="Close modal"
                className="absolute top-3 right-3 z-50 rounded-full bg-black/20 dark:bg-white/10 p-1.5 text-white hover:bg-black/40 transition-all backdrop-blur-md active:scale-90 cursor-pointer"
              >
                <X size={18} />
              </div>
            </div>

            <div className="flex-1 px-4 py-2 flex flex-col justify-between bg-white dark:bg-[#1a1d2d]">
              <div className="text-center mt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  The Organizers
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-4 place-content-center my-auto">
                {organizers.map((org) => (
                  <div
                    key={org.name}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative mb-1.5 h-16 w-16">
                      <div
                        className={`absolute -inset-1 rounded-full bg-gradient-to-br ${org.gradient} opacity-70 blur-md`}
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white dark:border-[#1a1d2d] shadow-sm bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={org.image}
                          alt={org.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {org.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 max-w-[100px]">
                      {org.role}
                    </p>
                  </div>
                ))}
              </div>

              <p className="pt-2 pb-2 text-[10px] uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1 animate-pulse">
                Tap to read message
              </p>
            </div>
          </div>

          {/* Back Face: Header + Thank You Message */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-[#1a1d2d] rounded-lg sm:rounded-3xl shadow-xl border border-slate-100 dark:border-brand-border/50 flex flex-col overflow-hidden">
            {/* Header Section (Duplicated for Back) */}
            <div className="relative h-28 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4432F5] via-[#6366f1] to-[#8b5cf6]" />
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
              
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at center, white 2px, transparent 2px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  The Visionaries
                </h2>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                role="button"
                aria-label="Close modal"
                className="absolute top-3 right-3 z-50 rounded-full bg-black/20 dark:bg-white/10 p-1.5 text-white hover:bg-black/40 transition-all backdrop-blur-md active:scale-90 cursor-pointer"
              >
                <X size={18} />
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-white dark:bg-[#1a1d2d]">
              <div className="rounded-full bg-gradient-to-r from-brand-primary to-violet-600 p-3 shadow-lg ring-4 ring-white dark:ring-[#0f111a] mb-4">
                <Heart
                  size={28}
                  className="text-white fill-white animate-pulse"
                />
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-800 dark:text-white">
                Thank You for the Opportunity! 🚀
              </h3>

              <div className="relative">
                <Sparkles
                  className="absolute -top-4 -left-4 text-yellow-400 opacity-50"
                  size={20}
                />
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-xs">
                  &quot;Big thanks to the leadership for organizing such an
                  incredible event! It was an amazing opportunity to innovate,
                  collaborate, and push our boundaries.&quot;
                </p>
                <Code2
                  className="absolute -bottom-4 -right-4 text-brand-primary opacity-50"
                  size={20}
                />
              </div>

                <p className="mt-auto pt-6 text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-1">
                Tap to see organizers
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
