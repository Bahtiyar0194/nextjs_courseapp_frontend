module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          200: '#424242',
          500: '#212121',
          900: '#141414'
        },

        accent: {
          300: '#71aaeb;'
        },

        current: {
          500: '#828282'
        }
      }
    },
  },
  plugins: [],
}