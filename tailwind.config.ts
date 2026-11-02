import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Primary: brand teal-blue, exact logo hex anchored at 700 ---
        primary: {
          DEFAULT: "#1B4D6B",
          50: "#F4F8FB",
          100: "#E4EFF6",
          200: "#C4DEEE",
          300: "#96C6E3",
          400: "#64ADD8",
          500: "#3393CC",
          600: "#2975A3",
          700: "#1B4D6B",
          800: "#15415B",
          900: "#0F2938"
        },

        // --- Secondary: analogous mid blue, exact logo hex anchored at 500 ---
        secondary: {
          DEFAULT: "#2E86AB",
          50: "#F1F7F9",
          100: "#DDECF3",
          200: "#BADAE8",
          300: "#89C3DC",
          400: "#4FA9CF",
          500: "#2E86AB",
          600: "#297899",
          700: "#225E77",
          800: "#1B485A",
          900: "#14313D"
        },

        // --- Neutral/slate: cool-toned, same hue family as primary ---
        neutral: {
          50: "#F9FAFB",
          100: "#F3F5F7",
          200: "#E4E9EC",
          300: "#D0D8DC",
          400: "#A9B5BC",
          500: "#81929C",
          600: "#62747F",
          700: "#485761",
          800: "#313D45",
          900: "#1B2328"
        },

        // --- Semantic status colors ---
        success: {
          light: "#EAF5F0",
          DEFAULT: "#298E5A",
          dark: "#15472D",
          tint: "#81DAAC" // for colored text directly on dark backgrounds
        },
        warning: {
          light: "#F8F2E7",
          DEFAULT: "#BD7905",
          dark: "#634003",
          tint: "#F3C068"
        },
        error: {
          light: "#F7E9EA",
          DEFAULT: "#CA212C",
          dark: "#7B141B",
          tint: "#EB7078"
        },
        info: {
          light: "#E7F0F8",
          DEFAULT: "#1275D9",
          dark: "#0B4784",
          tint: "#68ADF3"
        },

        // --- Existing brand tokens, kept for backward compatibility ---
        // (unchanged from the original scaffold; primary/secondary DEFAULTs
        // above now match these exactly, so existing bg-primary/bg-secondary
        // classes render identically)
        highlight: "#5BC0E8",
        accent: "#3CB878", // used for buttons (Sell/Publish CTAs) — distinct
                            // from the `success` semantic scale, which is
                            // tuned for status badges/text contrast instead
        bg: "#F7FBFC",
        line: "#E3EEF2"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
