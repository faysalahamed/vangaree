import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B4D6B",
        secondary: "#2E86AB",
        highlight: "#5BC0E8",
        accent: "#3CB878",
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
