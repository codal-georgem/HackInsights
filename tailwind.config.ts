import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          bg: "var(--c-bg)",
          surface: "var(--c-surface)", // #0C1525
          "surface-2": "var(--c-surface-2)", // #111E35
          border: "var(--c-border)", // #1B2C4A
          primary: "var(--c-primary)", // #4432F5
          "primary-light": "var(--c-primary-light)", // #6457F0
          "primary-glow": "var(--c-primary-glow)", // rgba(68, 50, 245, 0.35)
          text: "var(--c-text)", // #E4EEFF
          muted: "var(--c-muted)", // #6B84AD
          "card-bg": "var(--c-card-bg)", // rgba(12, 21, 37, 0.92)
        },
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
