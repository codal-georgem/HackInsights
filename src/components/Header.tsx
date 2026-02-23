"use client";

import Image from "next/image";
import { Plus, Users, Search, Moon, Sun, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, memo } from "react";

type Props = {
  onAddClick: () => void;
  onOrganizersClick: () => void;
  onTeamsClick: () => void;
  onSearch: (term: string) => void;
};

const Header = memo(function Header({
  onAddClick,
  onOrganizersClick,
  onTeamsClick,
  onSearch,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-wrap md:flex-nowrap items-center justify-between border-b border-brand-border bg-brand-bg/85 px-4 md:px-8 py-3 md:py-4 backdrop-blur-md transition-all">
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

      <div className="order-last w-full mt-3 flex-none basis-full md:basis-auto md:order-0 md:mt-0 md:w-auto md:flex-1 md:mx-4 max-w-md md:max-w-md mx-auto">
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
      <div className="flex items-center gap-1.5 md:gap-2">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-primary shadow-sm transition-all hover:bg-slate-50 hover:text-brand-primary-light hover:border-slate-300 active:scale-95
              dark:bg-brand-surface-2 dark:text-white dark:border-brand-border dark:hover:bg-brand-border/50 dark:hover:text-white dark:shadow-none"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={14} className="sm:w-4 sm:h-4" />
            ) : (
              <Moon size={14} className="sm:w-4 sm:h-4" />
            )}
          </button>
        )}

        <button
          onClick={onTeamsClick}
          aria-label="View Teams"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-brand-primary font-bold shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-brand-primary-light hover:border-brand-primary/30 active:scale-95
            dark:bg-brand-surface-2 dark:text-white dark:border-brand-border dark:hover:bg-brand-border/50 md:w-auto md:px-3 md:gap-2"
        >
          <Trophy size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden md:inline text-xs font-semibold">Teams</span>
        </button>

        <button
          onClick={onOrganizersClick}
          aria-label="View Organizers"
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-brand-primary font-medium shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-brand-primary-light hover:border-brand-primary/30 active:scale-95
            dark:bg-brand-surface-2 dark:text-white dark:border-brand-border dark:hover:bg-brand-border/50 md:w-auto md:px-3 md:gap-2"
        >
          <Users size={14} className="sm:w-[16px] sm:h-[16px]" />
          <span className="hidden md:inline text-xs font-semibold">
            Organizers
          </span>
        </button>

        <button
          onClick={onAddClick}
          aria-label="Add feedback"
          className="group relative flex h-8 items-center gap-1 sm:h-auto overflow-hidden rounded-full font-bold shadow-sm transition-all duration-300 hover:scale-105 active:scale-95
             bg-white/90 text-brand-primary border border-slate-200/80 hover:bg-white hover:text-brand-primary-light hover:border-brand-primary/30
             dark:bg-gradient-to-r dark:from-brand-primary dark:to-purple-600 dark:text-white dark:border-none dark:shadow-[0_0_20px_rgba(var(--c-primary),0.4)] dark:hover:shadow-[0_0_30px_rgba(var(--c-primary),0.6)]
             px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs"
        >
          {/* Animated background sheen - only show in dark mode now */}
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-none hidden dark:block" />

          <Plus
            size={12}
            strokeWidth={3}
            className="sm:w-[14px] sm:h-[14px] transition-transform group-hover:rotate-90 animate-pulse"
          />
          <span className="whitespace-nowrap">Share Feedback</span>
        </button>
      </div>
    </header>
  );
});

export default Header;
