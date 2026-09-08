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
          900: '#0F1A2E',
          800: '#1B2A4A',
          700: '#2A3C63',
          100: '#E8ECF4',
        },
        linen: '#FDFBF7',
        terracotta: {
          DEFAULT: '#E05A47',
          hover: '#C84635',
          light: '#FDEEEB',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#FBF4DB',
        },
        sage: {
          DEFAULT: '#2D7A4D',
          light: '#EAF5EF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
        arabic: ['Amiri', 'Noto Naskh Arabic', 'serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
