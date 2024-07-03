const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        ...colors
      },
    },
  },
  plugins: [

  ]
}