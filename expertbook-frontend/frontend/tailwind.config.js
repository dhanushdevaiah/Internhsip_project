/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:       "#080C14",
          card:       "#0F1624",
          border:     "#1E2D45",
          gold:       "#D4AF37",
          "gold-light": "#F0D060",
          slate:      "#8A9BB5",
          text:       "#E8EDF5",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "glow-gold": "0 0 30px rgba(212,175,55,0.15)",
        "card":      "0 4px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "shimmer":    "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
