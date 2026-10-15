/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        kalam: ['Kalam', 'cursive'],
        marck: ['"Marck Script"', 'cursive'],
        patrick: ['"Patrick Hand"', 'cursive'],
        shadows: ['"Shadows Into Light"', 'cursive'],
        indie: ['"Indie Flower"', 'cursive'],
        architects: ['"Architects Daughter"', 'cursive'],
        reenie: ['"Reenie Beanie"', 'cursive'],
        dancing: ['"Dancing Script"', 'cursive'],
        gloria: ['"Gloria Hallelujah"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          fountain: '#1e40af',
          black: '#18181b',
          sepia: '#5c3a21',
          crimson: '#831843',
          forest: '#14532d',
          graphite: '#374151',
          purple: '#581c87',
        },
        paper: {
          cream: '#FAF7F0',
          yellow: '#FEF9C3',
          parchment: '#F5EBE0',
          clean: '#FFFFFF',
          dark: '#1E1E24',
          kraft: '#EAD7BB',
        }
      }
    },
  },
  plugins: [],
}
