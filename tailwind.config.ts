import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    extend: {
    colors: {
        primary: {
            DEFAULT: "#166088",
            800: "#166088",
            600: "#447b99",
            400: "#6b97aa",
            300: "#9ab5c3",
            200: "#d1e1ec",
        },
        secondary: {
            DEFAULT: "#4DA8DA",
            800: "#4DA8DA",
            600: "#7abce2",
            400: "#a8cfe9",
            300: "#cde3f0",
            200: "#e9f4fb",
        },
        accent: {
            dirtyBlue: "#2A8A9D",
            aquaIsland: "#A4D6E1",
            whiteRock: "#F0EEE3",
            dirtyBlueLight: "#C9E5EA",
            aquaIslandLight: "#D6EDF3",
            whiteRockLight: "#F9F8F1",
        },
        success: "#2E8B57",
        alert: "#D9534F"
      },
    },
  },
  plugins: [],
} satisfies Config;
