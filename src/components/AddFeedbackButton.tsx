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
        "bg-blue-500 hover:bg-blue-600 active:scale-95",
        "px-5 py-3 text-sm font-medium text-white",
        "shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60",
        "transition-all duration-200",
      ].join(" ")}
    >
      <Plus size={16} strokeWidth={2.5} />
      Mic Drop 🎤
    </button>
  );
}
