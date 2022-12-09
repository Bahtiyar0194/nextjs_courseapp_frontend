module.exports = {
  content: [
    "./pages/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
            500: '#DDCF73'
        },

        dark: {
            200: '#2c3642',
            500: '#1f2935',
            900: '#15232e'
        },

        current: {
            500: '#8b8b8b'
        }
    }
    },
  },
  plugins: [],
}