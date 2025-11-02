import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981", // Verde matrix
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        terminal: {
          bg: "#0D1117",
          border: "#30363D",
          text: "#C9D1D9",
          accent: "#58A6FF",
        },
        dark: {
          DEFAULT: "#0B0F17",
          50: "#F0F1F2",
          100: "#E1E4E6",
          200: "#C3C9CD",
          300: "#A5AEB4",
          400: "#87939B",
          500: "#697882",
          600: "#545E68",
          700: "#40464E",
          800: "#2B2E34",
          900: "#15171A",
        },
        light: "#F5F9FF",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "gradient-matrix":
          "linear-gradient(135deg, #10B981 0%, #047857 50%, #064E3B 100%)",
        "gradient-terminal":
          "linear-gradient(135deg, #0D1117 0%, #161B22 100%)",
      },
      animation: {
        "typing": "typing 3.5s steps(40, end), blink 0.5s step-end infinite alternate",
        "matrix-rain": "matrix-rain 20s linear infinite",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        "loading": "loading 2s ease-in-out infinite",
      },
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 5px #10B981" },
          "50%": { boxShadow: "0 0 20px #10B981, 0 0 30px #10B981" },
        },
        loading: {
          "0%": { width: "0%" },
          "50%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;