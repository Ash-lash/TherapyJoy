/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        brand: {
          red:    "#ff6b6b",
          orange: "#ff8e53",
          yellow: "#ffd200",
          green:  "#56ab2f",
          teal:   "#4ecdc4",
          light:  "#a8edea",
        },
      },
      animation: {
        blob:    "morphBlob 8s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        pulse2:  "logoPulse 3s ease-in-out infinite",
        grad:    "gradShift 4s ease infinite",
        blink:   "blink 1.5s ease-in-out infinite",
      },
      keyframes: {
        morphBlob: {
          "0%,100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%", transform: "scale(1)" },
          "33%":     { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%", transform: "scale(1.05)" },
          "66%":     { borderRadius: "50% 40% 60% 30%/40% 70% 30% 60%", transform: "scale(0.97)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        logoPulse: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,107,107,0.5)" },
          "50%":     { boxShadow: "0 0 0 10px rgba(255,107,107,0)" },
        },
        gradShift: {
          "0%,100%": { backgroundPosition: "0%" },
          "50%":     { backgroundPosition: "100%" },
        },
        blink: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%":     { opacity: "0.4", transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};