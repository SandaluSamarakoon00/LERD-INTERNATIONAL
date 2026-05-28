export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Josefin Sans'", "sans-serif"],
      },
      colors: {
        leather: {
          50:  "#FAF6F0",
          100: "#F0E6D3",
          200: "#DFC5A0",
          300: "#C49A6C",
          400: "#A67C52",
          500: "#8B5E3C",
          600: "#6B4226",
          700: "#4A2D18",
          800: "#2C1A0E",
          900: "#1A0F08",
        },
        gold: { DEFAULT: "#B8860B", light: "#D4A017", dark: "#8B6508" }
      }
    }
  },
  plugins: []
}
