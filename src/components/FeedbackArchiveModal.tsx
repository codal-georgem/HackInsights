"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
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
  // Ref to store the element that triggered the modal
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    } else if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            "button, input, [tabindex]:not([tabindex='-1'])"
          )
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
            ref={modalRef}
           role="dialog"
          aria-modal="true"
          aria-label="Feedback Archive"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden rounded-[2rem] bg-white dark:bg-brand-surface border border-white/20 dark:border-brand-border/50 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-border p-4 sm:p-6 bg-white/50 dark:bg-brand-surface/50 backdrop-blur-md sticky top-0 z-10 w-full">
            <div className="pr-2">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text truncate max-w-[200px] sm:max-w-none">
                Feedback Archive 📂
              </h2>
              <p className="text-brand-muted text-xs sm:text-sm">
                Total {items.length} thoughts collected
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full bg-black/5 dark:bg-white/10 p-1.5 sm:p-2 text-brand-text hover:bg-black/10 dark:hover:bg-white/20 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-brand-primary shrink-0"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
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
