/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'], // Add Orbitron font
      },
      // Add other theme extensions if needed
    },
  },
  plugins: [
    require('tailwindcss-scrollbar'), // Add the scrollbar plugin
  ],
}