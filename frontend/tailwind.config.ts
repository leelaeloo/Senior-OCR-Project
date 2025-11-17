import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xl": ["1.75rem", { lineHeight: "2.25rem" }],
        "3xl": ["2rem", { lineHeight: "2.5rem" }],
        "4xl": ["2.5rem", { lineHeight: "3rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
        "senior-base": ["1.125rem", { lineHeight: "1.75rem" }],
        "senior-lg": ["1.5rem", { lineHeight: "2rem" }],
        "senior-xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },

        theme: {
          "bg-card": "var(--color-bg-card)",
          "bg-light": "var(--color-bg-light)",
          "bg-lighter": "var(--color-bg-lighter)",
          border: "var(--color-border)",
          "text-primary": "var(--color-text-primary)",
          "text-secondary": "var(--color-text-secondary)",
          "text-dark": "var(--color-text-dark)",
          button: "var(--color-button)",
          "button-hover": "var(--color-button-hover)",
        },
      },
      spacing: {
        "btn-y": "1rem",
        "btn-x": "1.5rem",
        touch: "3.75rem",
      },

      borderRadius: {
        senior: "1rem",
        "senior-lg": "1.5rem",
      },

      boxShadow: {
        senior:
          "0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
        "senior-lg":
          "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
