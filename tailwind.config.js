/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6d28d9',
          dark: '#5b21b6',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669'
        }
      },
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  plugins: [],
}
