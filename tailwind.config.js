module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
        ibm: ['"IBM Plex Sans Condensed"'],
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
    require("flowbite/plugin"),
  ],

  daisyui: {
    themes: false,
  },
};
