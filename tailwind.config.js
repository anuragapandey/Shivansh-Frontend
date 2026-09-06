/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mustard: '#EAB308',
        terracotta: '#DC2626',
        ivory: '#FFFDF7',
        charcoal: '#0F172A',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}
