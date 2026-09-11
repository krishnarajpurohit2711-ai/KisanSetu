/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#22C55E',
        navy: '#0F2942',
        amber: '#F59E0B',
      },
      boxShadow: {
        soft: '0 20px 40px rgba(15, 41, 66, 0.12)',
      },
    },
  },
  plugins: [],
};
