tailwind.config.js;
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        arial: ["Arial", "Helvetica", "sans-serif"],
        // You can also create variations like:
        "arial-narrow": ['"Arial Narrow"', "Arial", "sans-serif"],
        "arial-black": ['"Arial Black"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
