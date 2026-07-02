/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: { DEFAULT: "#F2762E", deep: "#D9600F" },
        indiagreen: { DEFAULT: "#158443", deep: "#0E6934" },
        navy: "#0B3C5D",
        cream: "#FFFBF3",
      },
      fontFamily: {
        display: ["'Baloo 2'", "'Noto Sans Devanagari'", "sans-serif"],
        body: ["'Noto Sans Devanagari'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
