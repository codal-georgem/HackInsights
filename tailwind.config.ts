import type { Config } from "tailwindcss";

// NOTE: In Tailwind CSS v4, colors and theme tokens are defined in CSS via
// the `@theme` directive in globals.css — NOT in this config file.
// The brand colors (brand-primary, brand-text, etc.) are registered there.
// This file is kept only for the `darkMode` strategy and content paths.
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
