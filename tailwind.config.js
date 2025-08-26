/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme.js'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Max-width responsive breakpoints and an extra small (xs) min-width
      screens: {
        // Max breakpoints (apply at and below)
        'max-2xl': { max: '1535px' },
        'max-xl': { max: '1279px' },
        'max-lg': { max: '1023px' },
        'max-md': { max: '767px' },
        'max-sm': { max: '639px' },
        'max-xs': { max: '475px' },

        // Optional: add xs min-width (Tailwind doesn't include xs by default)
        'xs': '475px',
      },
    },
  },
  plugins: [],
}