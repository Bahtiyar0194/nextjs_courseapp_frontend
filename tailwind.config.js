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
          100: '#cde4ff',
          300: '#56a4ff'
        },

        current: {
          500: '#828282'
        }
      }
    },
  },
  plugins: [],
}