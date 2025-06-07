/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '428px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        // We'll add our custom colors here based on the style guide
      },
      fontFamily: {
        // We'll add our custom fonts here based on the style guide
      },
    },
  },
  plugins: [],
} 