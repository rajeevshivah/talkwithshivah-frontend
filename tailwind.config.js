/** @type {import('tailwindcss').Config} */
// talkWithShivah theme — midnight indigo + lavender + diya gold.
// The `yellow` and `teal` scales are deliberately remapped so every
// existing component picks up the new palette without class renames.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0e0b1f",        // midnight indigo
        "dark-2": "#171230",    // raised surfaces
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
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
