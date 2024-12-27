import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  theme: {
    extend: {
      // ... rest of your theme config stays exactly the same
    }
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}

export default config 