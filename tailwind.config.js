/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3B2D', 
          dark: '#06261D',
          light: '#135c47',
        },
        accent: {
          DEFAULT: '#D4AF37', 
          light: '#E6CA65',
          dark: '#AA8C2C',
        }
      }
    },
  },
  plugins: [],
}