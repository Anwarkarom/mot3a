/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: '#556b2f',
        warm: '#f7f4ed',
        gold: '#d4b483',
        soft: '#e8e3d9',
      },
      boxShadow: {
        neo: '10px 10px 30px rgba(0,0,0,0.08), -10px -10px 30px rgba(255,255,255,0.9)',
        'neo-sm': '6px 6px 20px rgba(0,0,0,0.05), -6px -6px 20px rgba(255,255,255,0.9)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
