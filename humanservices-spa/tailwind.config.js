// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',   // blue-500
          DEFAULT: '#1e40af', // blue-800
          dark: '#1e3a8a'     // blue-900
        },
        secondary: {
          light: '#f3f4f6',   // gray-100
          DEFAULT: '#ffffff', // white
        },
        accent: {
          light: '#34d399',   // green-300
          DEFAULT: '#10b981', // green-500
          dark: '#047857'     // green-700
        },
        text: {
          light: '#f9fafb',   // gray-50
          DEFAULT: '#374151', // gray-700
          dark: '#111827'     // gray-900
        }
      }
    }
  },
  plugins: []
}
