/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.tsx"],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  prefix: "cb-",
  plugins: [],
};
