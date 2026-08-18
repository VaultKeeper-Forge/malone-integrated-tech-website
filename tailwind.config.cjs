/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        'surface-deep': '#080a0d',
        'surface-mid': '#0f151c',
        'surface-soft': '#101723',
        graphite: '#1a222f',
        calibration: '#6f87ff',
        signal: '#2f8cff',
        ink: '#f4f6fc',
        muted: '#9aa4b9'
      },
      fontFamily: {
        display: ['Inter Display', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
        body: ['Inter', 'Arial', 'Helvetica', 'sans-serif']
      },
      boxShadow: {
        panel: '0 24px 50px -28px rgba(20, 35, 55, 0.8)'
      },
      borderRadius: {
        xl: '1.05rem',
        '2xl': '1.35rem'
      },
      animation: {
        scan: 'scan 420ms cubic-bezier(.18,.89,.32,1.28)',
        'frame-pulse': 'framePulse 2.4s ease-in-out infinite'
      },
      keyframes: {
        scan: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        framePulse: {
          '0%': { opacity: 0.48 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.48 }
        }
      }
    }
  },
  plugins: []
};
