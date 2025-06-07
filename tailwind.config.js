/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '428px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',  // blue-500
          dark: '#1e40af',   // blue-800
        },
        secondary: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24',  // orange-300
          dark: '#b45309',   // orange-700
        },
        accent: {
          DEFAULT: '#10b981', // emerald-500
          light: '#6ee7b7',  // emerald-300
          dark: '#047857',   // emerald-800
        },
        neutral: {
          DEFAULT: '#f3f4f6', // gray-100
          dark: '#111827',   // gray-900
        },
        success: '#22c55e', // green-500
        warning: '#facc15', // yellow-400
        error: '#ef4444',   // red-500
        info: '#0ea5e9',    // sky-500
        white: '#fff',
        black: '#000',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'Montserrat',
          'ui-sans-serif',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '0.5rem', // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} 