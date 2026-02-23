"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import FeedbackEditor from "./FeedbackEditor";

type Props = {
  onClose: () => void;
  onSuccess: (message: string, name: string | undefined) => void;
};

export default function FeedbackModal({ onClose, onSuccess }: Props) {
  const [markdown, setMarkdown] = useState("");
  const [name, setName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Automatically focus the name input when the modal opens
    // Slight delay to ensure animation/rendering is ready
    const timer = setTimeout(() => {
        nameInputRef.current?.focus();
    }, 100);

    // Store the element that had focus when the modal opened
    triggerRef.current = document.activeElement as HTMLElement;

    // Return focus when modal closes
    return () => {
        clearTimeout(timer);
        triggerRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            "button, [contenteditable], [tabindex]:not([tabindex='-1'])"
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
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!markdown.trim() || charCount > 300 || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: markdown.trim(), name: name.trim() || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong.");
      }
      onSuccess(markdown.trim(), name.trim() || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = !markdown.trim();
  const isOverLimit = charCount > 300;
  const canSubmit = !isEmpty && !isOverLimit && !loading;

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
          key="modal"
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Leave anonymous feedback"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative flex flex-col w-full max-w-lg max-h-[85dvh] h-auto overflow-hidden rounded-lg sm:rounded-[2rem] bg-white/95 dark:bg-brand-surface border border-slate-100/80 dark:border-brand-border shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.6)] text-slate-900 dark:text-brand-text"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Header */}
          <div className="shrink-0 relative h-24 w-full overflow-hidden bg-brand-primary">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-purple-600 to-brand-primary animated-gradient opacity-90" />
            
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 rounded-full bg-black/20 p-1.5 sm:p-2 text-white hover:bg-black/30 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-8 z-10 pr-12 sm:pr-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
                <span>Hackathon Vibes</span>
                <span className="text-lg sm:text-xl">🎤</span>
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm font-medium drop-shadow-sm mt-0.5">
                Share your experience the good, the bad, & the epic.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50 dark:from-brand-surface dark:to-brand-surface-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-brand-text ml-1 flex items-center justify-between">
                  <span>Your Name</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-brand-muted font-medium">Optional</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <span className="text-lg">👋</span>
                  </div>
                  <input
                    ref={nameInputRef}
                    type="text"
                    maxLength={20}
                    placeholder="Drop your name or stay Incognito"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-slate-800 placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-base font-medium dark:bg-brand-surface-2 dark:border-brand-border dark:text-brand-text dark:placeholder:text-brand-muted/70"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-brand-text ml-1 flex flex-col gap-0.5">
                  <span>Your Message</span>
                  <span className="text-[11px] font-normal text-slate-500 dark:text-brand-muted">
                    What did you enjoy? What could be better?
                  </span>
                </label>
                <div className="relative">
                  <FeedbackEditor
                    onChange={(md, count) => {
                      setMarkdown(md);
                      setCharCount(count);
                    }}
                  />
                  {/* Character count overlay or helper if needed, but editor has it */}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col gap-3 mt-2">
                <motion.button
                  type="submit"
                  disabled={!canSubmit}
                  whileHover={canSubmit ? { scale: 1.02 } : {}}
                  whileTap={canSubmit ? { scale: 0.98 } : {}}
                  className={`relative overflow-hidden flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold tracking-wide transition-all shadow-lg ${
                    canSubmit
                      ? "bg-gradient-to-r from-brand-primary to-purple-600 text-white shadow-brand-primary/25 hover:shadow-brand-primary/40"
                      : "bg-slate-100 dark:bg-brand-surface-2 text-slate-400 dark:text-brand-muted cursor-not-allowed"
                  }`}
                >
                  {canSubmit && (
                    <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                  )}
                  <Send size={16} className={loading ? "animate-pulse" : ""} />
                  {loading ? "Sending..." : "Post to Wall"}
                </motion.button>
                
                <p className="text-[10px] text-center text-slate-400 dark:text-brand-muted/60 uppercase tracking-widest font-medium">
                  Anonymous unless you sign it • Keep it real
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
