/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        Manrope: ['"Manrope"', 'ui-sans-serif', 'system-ui'],
      }
    }
  },
  plugins: [],
};
