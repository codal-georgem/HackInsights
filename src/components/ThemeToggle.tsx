"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-brand-primary shadow-lg hover:scale-110 hover:text-brand-primary-light hover:border-slate-300 active:scale-90 transition-all dark:bg-brand-surface-2 dark:text-white dark:border-brand-border dark:hover:bg-brand-border/50 dark:hover:text-white dark:shadow-none"
      whileHover={{ y: -2 }}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-brand-primary" />
      )}
    </motion.button>
  );
}
