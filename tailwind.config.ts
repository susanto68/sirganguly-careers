import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        mint: "#10b981",
        coral: "#f97316",
        iris: "#7c3aed",
        skyglass: "#e0f2fe"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(16, 185, 129, 0.18)",
        card: "0 24px 60px rgba(15, 23, 42, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
