/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', 
    "./app/**/*.{js,jsx,ts,tsx}",
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
