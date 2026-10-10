/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        hacker: {
          bg: '#0e141e',
          card: '#171f2a',
          'card-hover': '#1e293b',
          border: '#2c3b4d',
          'border-focus': '#00EA64',
          green: '#00EA64',
          'green-hover': '#00c853',
          'green-dark': '#098239',
          muted: '#9aaec4',
          subtle: '#64748b',
          text: '#f3f7f8',
          danger: '#e74c3c',
          'danger-bg': 'rgba(231, 76, 60, 0.12)',
          'danger-border': 'rgba(231, 76, 60, 0.35)',
        },
        hnue: {
          blue: '#004899',
          'blue-dark': '#003366',
          'blue-light': '#0066cc',
          red: '#8b1d24',
          amber: '#e67e22',
        }
      }
    },
  },
  plugins: [],
}
