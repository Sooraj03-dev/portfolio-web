/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#010308',
        surface: '#050C14',
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF2D78',
        'neon-purple': '#9D00FF',
        'neon-teal': '#00E5CC',
        'neon-orange': '#FF6600',
        'street-dark': '#0A0E14',
        'text-primary': '#E8F4F8',
        'text-dim': '#3A6A7A',
        chrome: '#6688AA',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        'share-tech': ['Share Tech Mono', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        cyber: '0.06em',
        wide: '0.15em',
        ultra: '0.2em',
        mega: '0.3em',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'border-trace': 'borderTrace 0.8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', textShadow: '0 0 10px currentColor' },
          '50%': { opacity: '0.8', textShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        borderTrace: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00FFFF, 0 0 20px rgba(0,255,255,0.3)',
        'neon-pink': '0 0 5px #FF2D78, 0 0 20px rgba(255,45,120,0.3)',
        'neon-purple': '0 0 5px #9D00FF, 0 0 20px rgba(157,0,255,0.3)',
      },
    },
  },
  plugins: [],
};
