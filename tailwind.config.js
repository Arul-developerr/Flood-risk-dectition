/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Surface scale — CSS variables so both appearance modes share one system. */
        navy: {
          950: 'rgb(var(--navy-950) / <alpha-value>)',
          900: 'rgb(var(--navy-900) / <alpha-value>)',
          800: 'rgb(var(--navy-800) / <alpha-value>)',
          700: 'rgb(var(--navy-700) / <alpha-value>)',
          600: 'rgb(var(--navy-600) / <alpha-value>)',
        },
        teal: {
          brand: 'rgb(var(--teal-brand) / <alpha-value>)',
          bright: 'rgb(var(--teal-bright) / <alpha-value>)',
        },
        glacier: {
          DEFAULT: 'rgb(var(--glacier) / <alpha-value>)',
          soft: 'rgb(var(--glacier-soft) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--cyan) / <alpha-value>)',
          brand: 'rgb(var(--cyan) / <alpha-value>)',
        },
        risk: {
          low: 'rgb(var(--risk-low) / <alpha-value>)',
          moderate: 'rgb(var(--risk-moderate) / <alpha-value>)',
          high: 'rgb(var(--risk-high) / <alpha-value>)',
          critical: 'rgb(var(--risk-critical) / <alpha-value>)',
        },
        shell: {
          border: 'rgb(var(--shell-border) / <alpha-value>)',
          text: 'rgb(var(--shell-text) / <alpha-value>)',
          muted: 'rgb(var(--shell-muted) / <alpha-value>)',
          faint: 'rgb(var(--shell-faint) / <alpha-value>)',
        },
        light: {
          page: '#F5F7FA',
          card: '#FFFFFF',
        },
        /* Always-dark scrim used behind modals and drawers. */
        scrim: 'rgb(2 8 16 / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Noto Sans Tamil',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        card: '12px',
        panel: '18px',
        xs: '6px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        panel: 'var(--shadow-panel)',
        glow: 'var(--shadow-glow)',
        'glow-cyan': 'var(--shadow-glow-cyan)',
        hairline: 'var(--shadow-hairline)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.65' },
          '70%': { transform: 'scale(1.7)', opacity: '0' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        'chart-draw': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(320%)' },
        },
        'sheen': {
          '0%': { opacity: '0.35', transform: 'translateX(-60%)' },
          '100%': { opacity: '0', transform: 'translateX(160%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 240ms ease-out both',
        'scale-in': 'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        'chart-draw': 'chart-draw 420ms ease-out both',
        'sweep': 'sweep 2.6s ease-in-out infinite',
        'sheen': 'sheen 3.2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
