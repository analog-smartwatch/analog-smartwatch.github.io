module.exports = {
  content: ["./src/**/*.{html,njk,md,js}", "./src/**/*.svg"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
