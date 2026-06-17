/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-purple': '#8A2BE2',
        'brand-pink': '#D1118D',
        'brand-light': '#F8F9FA'
      }
    },
  },
  plugins: [],
}

