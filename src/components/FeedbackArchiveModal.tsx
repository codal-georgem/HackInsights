"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useState, useMemo } from "react";
import type { FeedbackItem } from "./FeedbackWall";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: FeedbackItem[];
};

export default function FeedbackArchiveModal({
  isOpen,
  onClose,
  items,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const lower = search.toLowerCase();
    return items.filter((item) => item.message.toLowerCase().includes(lower));
  }, [items, search]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-brand-surface border border-white/20 dark:border-brand-border/50 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border p-6 bg-white/50 dark:bg-brand-surface/50 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h2 className="text-2xl font-bold text-brand-text">
                Feedback Archive 📂
              </h2>
              <p className="text-brand-muted text-sm">
                Total {items.length} thoughts collected
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-black/5 dark:bg-white/10 p-2 text-brand-text hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-2">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                size={20}
              />
              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-brand-border bg-brand-surface-2 py-3 pl-12 pr-4 text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="break-inside-avoid rounded-2xl border border-brand-border bg-brand-bg p-4 text-sm text-brand-text shadow-sm hover:border-brand-primary/30 transition-colors"
                >
                  <div className="prose-sm dark:prose-invert">
                    {/* We can reuse the renderer logic or just simple text for archive */}
                    {item.message.replace(/\*\*/g, "").replace(/\*/g, "")}
                  </div>
                  <div className="mt-3 text-xs text-brand-muted font-mono">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-brand-muted">
                  No feedback found matching {search}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
