import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fffdf7",
          100: "#fdf9ef",
          200: "#f8f0d9",
        },
        harbor: {
          50: "#eff7fb",
          100: "#dceef5",
          200: "#b9dcea",
          300: "#8bc3d8",
          400: "#5aa3c0",
          500: "#3884a7",
          600: "#286a8b",
          700: "#1e5571",
          800: "#1a475d",
          900: "#173c4f",
        },
        palmetto: {
          50: "#f2f7f1",
          100: "#e1ecdf",
          200: "#c4d9bf",
          300: "#9ec19a",
          400: "#76a574",
          500: "#558a56",
          600: "#3f6e44",
          700: "#335837",
          800: "#2b482f",
          900: "#243c28",
        },
        peach: {
          50: "#fdf5ef",
          100: "#fbe8d8",
          200: "#f6cdab",
          300: "#efad7a",
          400: "#e88a4f",
          500: "#df6c2d",
          600: "#cf5523",
          700: "#ac4220",
          800: "#893621",
          900: "#702e1d",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23, 60, 79, 0.06), 0 4px 12px rgba(23, 60, 79, 0.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
