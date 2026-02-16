/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00b4c5',
          light: '#33c3d1',
          dark: '#0099a8',
          lighter: 'rgba(0, 180, 197, 0.1)',
          darker: '#007a87',
        },
        'brand-gold': {
          DEFAULT: '#ffd700',
          light: '#ffe033',
          dark: '#e6c200',
        },
        'brand-muted': '#8a8b8e',
        'surface': {
          DEFAULT: '#0a0a0a',
          elevated: '#141414',
          card: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 