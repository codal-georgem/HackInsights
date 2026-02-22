"use client";

import Image from "next/image";
import { Plus, Users, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = { 
  onAddClick: () => void;
  onOrganizersClick: () => void;
  onSearch: (term: string) => void;
};

export default function Header({ onAddClick, onOrganizersClick, onSearch }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-brand-border bg-brand-bg/85 px-4 md:px-8 py-4 backdrop-blur-md transition-all"
    >
      <a 
        href="https://codal.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="shrink-0 overflow-hidden rounded-lg bg-brand-primary p-1">
          <Image
            src="/codal-logo.png"
            alt="Codal logo"
            width={24}
            height={24}
            priority
          />
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-base font-black tracking-tight text-brand-text">
            Codal AI Hackathon
          </span>
        </div>
      </a>

      <div className="flex-1 max-w-md mx-2 md:mx-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-brand-muted group-focus-within:text-brand-primary dark:group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-1.5 border border-brand-border rounded-full leading-5 
              bg-white/80 text-slate-900 placeholder-slate-500
              focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary
              dark:bg-brand-surface-2/90 dark:text-brand-text dark:placeholder-brand-muted/80 dark:border-brand-border
              dark:focus:bg-brand-surface-2 dark:focus:ring-brand-primary dark:focus:border-brand-primary
              sm:text-sm transition-all"
            placeholder="Search feedback..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border/80 bg-white/70 text-slate-900 backdrop-blur-sm transition-all hover:bg-white active:scale-95
              dark:bg-brand-surface-2 dark:text-brand-text dark:border-brand-border dark:hover:bg-brand-surface"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}

        <button
          onClick={onOrganizersClick}
          aria-label="View Organizers"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border/80 bg-white/70 text-slate-900 backdrop-blur-sm transition-all hover:bg-white active:scale-95
            dark:bg-brand-surface-2 dark:text-brand-text dark:border-brand-border dark:hover:bg-brand-surface sm:w-auto sm:px-3 sm:gap-2"
        >
          <Users size={16} />
          <span className="hidden sm:inline text-xs font-semibold">Squad</span>
        </button>

        <button
          onClick={onAddClick}
          aria-label="Add feedback"
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-primary to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(var(--c-primary),0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--c-primary),0.6)] active:scale-95"
        >
          {/* Animated background sheen */}
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-none" />
          
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
          </span>
          
          <Plus size={14} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
          <span>Mic Drop</span>
        </button>
      </div>
    </header>
  );
}
