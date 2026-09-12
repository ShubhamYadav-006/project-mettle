/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mettle: {
          bg: '#0D0D0D',
          'bg-secondary': '#141414',
          surface: '#1A1A1A',
          elevated: '#222222',
          'surface-raised': '#222222',
          'text-primary': '#F5F5F5',
          'text-secondary': '#A6A6A6',
          'text-muted': '#707070',
          accent: '#B5E34A',
          'accent-hover': '#C5F05C',
          'accent-soft': 'rgba(181, 227, 74, 0.10)',
          'accent-border': 'rgba(181, 227, 74, 0.25)',
          border: '#2A2A2A',
          'border-strong': '#3A3A3A',
          success: '#65C99A',
          warning: '#E6B84D',
          danger: '#F27A72',
          info: '#5B8DEF',
          xp: '#B5E34A',
          gold: '#E6B84D',
          // Attributes
          mind: '#6E9AC4',
          will: '#B5E34A',
          body: '#65C99A',
          craft: '#B18CFF',
          habit: '#E6B84D',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
