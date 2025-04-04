import type { Config } from 'tailwindcss'

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - 1.5rem))' }, // 1.5rem accounts for the gap-6
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ['light', 'dark'],
  },
} satisfies Config

export default config 