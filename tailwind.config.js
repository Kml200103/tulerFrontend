/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "serif"],
        lato: ["Lato", "serif"],
      },
    },
    container: {
      center: true,

      padding: "1.5rem", // Adjust left/right padding
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      mid: "912px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
