/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Bang mau cam chu dao cua Zhongwen_xuexi
        brand: {
          50: '#FFF7F0',
          100: '#FFEEDD',
          200: '#FFD8B5',
          300: '#FFBC85',
          400: '#FF9D52',
          500: '#F97316',
          600: '#EA6A0C',
          700: '#C2540A',
          800: '#9A430D',
          900: '#7C380F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 20px rgba(249, 115, 22, 0.08)',
        soft: '0 2px 12px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: []
}