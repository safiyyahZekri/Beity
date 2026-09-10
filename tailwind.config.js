/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFCF7',
          100: '#FDF8EF',
          200: '#F6EEE0',
          300: '#EFE4D1',
          400: '#E4D5BC',
          500: '#D6C2A2',
        },
        terracotta: {
          50: '#FBEEEA',
          100: '#F5D9D1',
          200: '#E8B4A7',
          300: '#D68A76',
          400: '#C76550',
          500: '#B8452F',
          600: '#9E3826',
          700: '#7C2B1D',
        },
        gold: {
          50: '#FDF6E6',
          100: '#F9E9C4',
          200: '#F0D492',
          300: '#E5BC63',
          400: '#D9A441',
          500: '#C08D2F',
          600: '#9C7124',
        },
        brown: {
          200: '#C9B29C',
          300: '#B0937A',
          400: '#8A6A50',
          500: '#71503A',
          600: '#5C3A24',
          700: '#4A2E1C',
          800: '#361F12',
        },
        olive: {
          50: '#F2F5EA',
          100: '#E2E9D0',
          200: '#C8D4AA',
          300: '#A6B87E',
          400: '#8AA262',
          500: '#748B4E',
          600: '#5D7240',
        },
      },
      fontFamily: {
        display: ['Knewave', 'system-ui', 'cursive'],
        script: ['Niconne', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(92, 58, 36, 0.10), 0 8px 24px -8px rgba(92, 58, 36, 0.14)',
        lift: '0 8px 20px -6px rgba(92, 58, 36, 0.18), 0 20px 40px -16px rgba(92, 58, 36, 0.22)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.6)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'pop-in': {
          from: { opacity: 0, transform: 'translateY(8px) scale(0.97)' },
          to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'rise': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'grow-bar': { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'pop-in': 'pop-in .22s cubic-bezier(.2,.9,.3,1) both',
        'slide-in-right': 'slide-in-right .28s cubic-bezier(.2,.9,.3,1) both',
        rise: 'rise .4s ease-out both',
        'grow-bar': 'grow-bar .6s cubic-bezier(.2,.9,.3,1) both',
      },
    },
  },
  plugins: [],
}
