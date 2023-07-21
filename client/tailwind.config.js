/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        'primary':'#27374D',
      }
    },
  },
  plugins: [],
  corePlugins:{
    preflight:false,
  }
}