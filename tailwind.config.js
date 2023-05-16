const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: { preflight: false },
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
