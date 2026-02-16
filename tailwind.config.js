/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        cinzel: ['"Cinzel Decorative"', 'serif'],   // ← new
      },
      colors: {
        lemon: '#B9FD56',
        'dark-blue': '#0a1f44',
      },
    },
  },
  plugins: [],
};