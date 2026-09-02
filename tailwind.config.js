/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f6f7f9',
          100: '#edeef2',
          200: '#d7dbe3',
          300: '#b4bdcb',
          400: '#8c9ab0',
          500: '#6d7b97',
          600: '#56627d',
          700: '#464f66',
          800: '#3c4355',
          900: '#1b202e',
          950: '#0e111a',
        },
        saffron: {
          50: '#fff8eb',
          100: '#ffefc6',
          200: '#ffdc88',
          300: '#ffc34a',
          400: '#ffa71d',
          500: '#f5870b',
          600: '#d96306',
          700: '#b44309',
          800: '#92340e',
          900: '#782c0f',
        },
        ashoka: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0b132b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'court': '0 20px 40px -15px rgba(11, 19, 43, 0.15)',
      }
    },
  },
  plugins: [],
}
