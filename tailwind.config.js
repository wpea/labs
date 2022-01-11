module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter']
      }
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],

  daisyui: {
    themes: false,
  }
}
