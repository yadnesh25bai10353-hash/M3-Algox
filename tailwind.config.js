/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070709', // Very deep rich black
          800: '#101014', // Elegant dark card background
          700: '#1a1a21', // Lighter panel background
          600: '#2a2a35', // Borders and subtle highlights
          500: '#3f3f4e', // Muted elements
        },
        accent: {
          DEFAULT: '#d4af37', // Classic metallic gold
          light: '#f9e596', // Light gold for hover/glow
          dark: '#aa8c2c', // Dark gold for active states
          gold: '#ffd700', // Bright gold for accents
          blue: '#3b82f6', // Keep a blue just in case
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-gold-lg': '0 0 35px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
