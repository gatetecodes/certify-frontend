/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html", "./src/**/*.{ts,html}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5D866C", // Sage Green
          dark: "#4a6b56",
        },
        secondary: {
          DEFAULT: "#C2A68C", // Earth Brown
          light: "#E6D8C3", // Light Beige
        },
        background: "#F5F5F0", // Off-white
      },
      fontFamily: {
        sans: ['"Manrope"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
