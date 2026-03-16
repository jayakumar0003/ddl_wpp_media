/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        wpp: ["WPP", "sans-serif"],
      },
      colors: {
        lemon: '#B9FD56',
        'dark-blue': '#000050',
      },
    },
  },
  plugins: [],
};
