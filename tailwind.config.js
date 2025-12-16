/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': {
          'primary': 'var(--bg-primary)',
          'secondary': 'var(--bg-secondary)',
          'tertiary': 'var(--bg-tertiary)',
        },
        'border': {
          'primary': 'var(--border-primary)',
          'secondary': 'var(--border-secondary)',
        },
        'text': {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'tertiary': 'var(--text-tertiary)',
        },
        'theme': {
          'enemy': 'var(--color-enemy)',
          'area': 'var(--color-area)',
          'quest': 'var(--color-quest)',
          'quest-text': 'var(--color-quest-text)',
          'waypoint': 'var(--color-waypoint)',
          'trial': 'var(--color-trial)',
          'portal': 'var(--color-portal)',
        },
      },
    },
  },
  plugins: [],
}
