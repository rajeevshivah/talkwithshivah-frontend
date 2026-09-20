/** @type {import('tailwindcss').Config} */
// talkWithShivah theme — midnight indigo + lavender + diya gold.
// The `yellow` and `teal` scales are deliberately remapped so every
// existing component picks up the new palette without class renames.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#262048",        // dusk indigo (lifted, softer)
        "dark-2": "#312a58",    // raised surfaces
        yellow: {               // → lavender violet (primary accent)
          300: "#cfc2ff",
          400: "#b5a2fb",
          500: "#9a82f2",
          600: "#7c63dd",
        },
        teal: {                 // → diya gold (secondary accent)
          300: "#ecd9ab",
          400: "#dfc38a",
          500: "#caa860",
        },
      },
      // Faint surface tints used across the site (bg-white/4, border-white/7…).
      opacity: {
        2: "0.02", 3: "0.03", 4: "0.04", 6: "0.06", 7: "0.07", 8: "0.08", 12: "0.12",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};