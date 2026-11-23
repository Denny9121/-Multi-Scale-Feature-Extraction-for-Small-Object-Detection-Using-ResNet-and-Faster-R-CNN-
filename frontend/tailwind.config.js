/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00F0FF",
        secondary: "#7B2FBE",
        accent: "#FF3CAC",
        bg: "#0A0A12",
        surface: "#12121F",
        textPrimary: "#EAEAEA",
        textMuted: "#6E6E8A",
        success: "#00E676",
        warning: "#FFD740",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,240,255,0.3), 0 0 60px rgba(0,240,255,0.1)",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
