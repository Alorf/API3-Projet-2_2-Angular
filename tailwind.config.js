/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  theme: {
    container: {
      center: true,
    },
  },
  daisyui: {
    themes: ['dim'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
