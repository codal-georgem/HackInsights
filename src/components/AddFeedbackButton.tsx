"use client";

import { Plus } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function AddFeedbackButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Add feedback"
      className={[
        "fixed bottom-6 right-6 z-40",
        "flex items-center gap-2 rounded-full",
        "bg-white text-brand-primary shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0 border border-brand-primary/10",
        "px-5 py-3 text-sm font-bold tracking-tight",
        "transition-all duration-200",
        "dark:bg-indigo-600 dark:text-white dark:border-transparent dark:hover:bg-indigo-500 dark:shadow-indigo-500/40",
      ].join(" ")}
    >
      <Plus size={16} strokeWidth={2.5} />
      Mic Drop 🎤
    </button>
  );
}
