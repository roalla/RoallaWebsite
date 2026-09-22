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
          DEFAULT: '#f5c518',
          light: '#f7d045',
          dark: '#d4a80f',
        },
        'brand-muted': '#64748b',
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f8fafc',
          card: '#ffffff',
          muted: '#f1f5f9',
        },
        ink: {
          DEFAULT: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['var(--font-portal-body)', 'Figtree', 'system-ui', 'sans-serif'],
        serif: ['var(--font-portal-display)', 'Sora', 'system-ui', 'sans-serif'],
        display: ['var(--font-portal-display)', 'Sora', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
        'card-hover':
          '0 14px 36px -8px rgb(0 180 197 / 0.28), 0 8px 16px -6px rgb(15 23 42 / 0.12), 0 0 0 1px rgb(0 180 197 / 0.12)',
      },
    },
  },
  plugins: [],
}
