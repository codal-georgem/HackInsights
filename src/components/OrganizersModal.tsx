"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trophy, Sparkles, Code2 } from "lucide-react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const organizers = [
  {
    name: "Keval Baxi",
    role: "CEO",
    image: "https://ca.slack-edge.com/T0299GT5T-U0299GT5V-b3b714a70133-512",
    gradient: "from-brand-primary to-indigo-600",
  },
  {
    name: "Danny Goyal",
    role: "Executive VP of Global Operations",
    image: "https://ca.slack-edge.com/T0299GT5T-U45M76ZM0-78e76b90a678-512",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    name: "Stephen Yi",
    role: "Managing Director, Engineering & Product",
    image: "https://ca.slack-edge.com/T0299GT5T-U01Q8DBV43T-df6c2a9d9b48-512",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    name: "Markus",
    role: "Director of Technology Solutions",
    image: "https://ca.slack-edge.com/T0299GT5T-U0A0TRZAD0E-4e2826634d81-192",
    gradient: "from-purple-600 to-brand-primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function OrganizersModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-[#0f111a] border border-white/20 dark:border-brand-border shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/20 dark:bg-white/10 p-2 text-white hover:bg-black/40 dark:hover:bg-white/20 transition-all backdrop-blur-md"
          >
            <X size={20} />
          </button>

          <div className="relative h-32 sm:h-40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4432F5] via-[#6366f1] to-[#8b5cf6]" />
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
            
            <motion.div 
               animate={{ 
                 backgroundPosition: ["0% 0%", "100% 100%"],
               }}
               transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
               className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: "radial-gradient(circle at center, white 2px, transparent 2px)",
                 backgroundSize: "24px 24px",
               }}
            />

            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0f111a] to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pt-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md border border-white/20"
              >
                <Trophy size={14} className="text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">The Visionaries</span>
              </motion.div>
              
              <motion.h2 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm"
              >
                Codal Hackathon 2026
              </motion.h2>
            </div>
          </div>

          <div className="relative px-4 pb-8 sm:px-8 -mt-8">
            {/* Thank You Note */}
            <motion.div 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative mx-auto max-w-xl text-center mb-8"
            >
              <div className="relative z-10 rounded-2xl bg-white dark:bg-[#1a1d2d] p-5 sm:p-6 shadow-xl border border-slate-100 dark:border-brand-border/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-gradient-to-r from-brand-primary to-violet-600 p-2 shadow-lg ring-4 ring-white dark:ring-[#0f111a]">
                    <Heart size={20} className="text-white fill-white animate-pulse" />
                  </div>
                </div>
                
                <h3 className="mt-3 mb-2 text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
                  Thank You for the Opportunity! 🚀
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  &quot;Big thanks to the leadership for organizing such an incredible event! 
                  It was an amazing opportunity to innovate, collaborate, and push our boundaries. 
                  We truly appreciate the platform to build something cool and impactful. 
                  Looking forward to more hackathons and creative challenges in the future!&quot;
                </p>
                <div className="mt-3 flex justify-center gap-1 text-[#4432F5]">
                  <Sparkles size={14} />
                  <Code2 size={14} />
                  <Sparkles size={14} />
                </div>
              </div>
            </motion.div>

            {/* Organizers Grid */}
            <div className="text-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                Organizers
              </h3>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 sm:gap-6"
            >
              {organizers.map((org) => (
                <motion.div
                  key={org.name}
                  variants={itemVariants}
                  className="group relative flex flex-col items-center"
                >
                  <div className="relative mb-3 h-20 w-20 sm:h-24 sm:w-24 transition-all duration-300 group-hover:-translate-y-1">
                    <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${org.gradient} opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative h-full w-full overflow-hidden rounded-full border-2 sm:border-4 border-white dark:border-[#1a1d2d] shadow-sm bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={org.image}
                        alt={org.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-full"
                        unoptimized
                        priority
                      />
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-white dark:bg-[#1a1d2d] p-1 shadow-md">
                      <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${org.gradient}`} />
                    </div>
                  </div>
                  
                  <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-primary dark:group-hover:text-brand-primary-light transition-colors text-center leading-snug">
                    {org.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 text-center max-w-[140px] leading-tight mt-1">
                    {org.role}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
