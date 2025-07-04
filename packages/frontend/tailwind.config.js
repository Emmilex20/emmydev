// packages/frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom colors (e.g., your primary brand color)
      colors: {
        primary: {
          DEFAULT: '#4ADE80', // Aligning DEFAULT with primary-400 for consistency
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80', // This is your bright green
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#0E331B',
        },
        secondary: '#3B82F6', // A blue for accents
        dark: '#111827', // Dark background for the site
        light: '#F3F4F6', // Light text for dark backgrounds
      },
      // Custom font families (e.g., from Google Fonts)
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example
        heading: ['Montserrat', 'sans-serif'], // Example for headings
      },
      // Add other custom theme extensions here (e.g., custom shadows, spacing)
    },
  },
  plugins: [],
}