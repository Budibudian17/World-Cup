import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans)", "Noto Sans", "sans-serif"],
        display: ["var(--font-barlow-condensed)", "Barlow Condensed", "sans-serif"],
      },
      colors: {
        "wc-black": "var(--wc-black)",
        "wc-gold": "var(--wc-gold)",
        "wc-gold-light": "var(--wc-gold-light)",
        "wc-gold-pale": "var(--wc-gold-pale)",
        "wc-white": "var(--wc-white)",
        "wc-gray-1": "var(--wc-gray-1)",
        "wc-gray-2": "var(--wc-gray-2)",
        "wc-gray-3": "var(--wc-gray-3)",
        "wc-live-red": "var(--wc-live-red)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
