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
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569'
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
