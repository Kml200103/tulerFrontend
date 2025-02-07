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
  },
  plugins: [],
};
