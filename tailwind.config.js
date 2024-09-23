/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',  // Para que Tailwind procese los archivos dentro de src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',  // Azul principal
        secondary: '#10B981',  // Verde principal
      },
    },
  },
  plugins: [],
};
