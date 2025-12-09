/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  important: true, // Make Tailwind utilities more specific
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid conflicts with PrimeNG
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
