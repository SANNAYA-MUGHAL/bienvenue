/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        french: {
          DEFAULT: '#183B66',
          light: '#234C80',
          dark: '#0F2744',
        },
        coral: {
          DEFAULT: '#F26B6B',
          light: '#F88B8B',
          dark: '#E05353',
        },
        lavender: {
          DEFAULT: '#7C6FF0',
          light: '#9E94F5',
          dark: '#5D4EE0',
        },
        warm: {
          DEFAULT: '#FDFBF7',
        },
        navy: {
          900: '#0F1A2E',
          800: '#1B2A4A',
          700: '#2A3C63',
          100: '#E8ECF4',
        },
        linen: '#FDFBF7',
        terracotta: {
          DEFAULT: '#F26B6B',
          hover: '#E05353',
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
        french: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
        arabic: ['"Noto Sans Arabic"', 'Amiri', 'serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
