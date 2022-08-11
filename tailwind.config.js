module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
      colors: {
        "wp-blue": "#2D7EC2",
        "wp-blue-dark": "#27669B",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],

  daisyui: {
    themes: false,
  },
};
