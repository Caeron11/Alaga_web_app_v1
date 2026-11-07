import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.15rem' }],
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1rem', { lineHeight: '1.55rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.85rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.1rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.35rem' }],
      },
      colors: {
        alaga: {
          sky: '#DDE7FF',
          periwinkle: '#E8DCFC',
          lavender: '#F3E8FF',
          darkBase: '#12151C',
          darkSurface: '#161922',
          darkElevated: '#1A1E29',
          neonViolet: '#7C3AED',
          neonCyan: '#06B6D4',
        },
      },
      backgroundImage: {
        'alaga-mesh-light': 'linear-gradient(135deg, #DDE7FF 0%, #E8DCFC 50%, #F3E8FF 100%)',
        'alaga-mesh-dark': 'linear-gradient(135deg, #0D1017 0%, #12151C 50%, #1A1E29 100%)',
        'glow-violet': 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0) 70%)',
        'glow-cyan': 'radial-gradient(circle, rgba(6,182,212,0.24) 0%, rgba(6,182,212,0) 70%)',
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 4px 24px -2px rgba(99, 102, 241, 0.12)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [forms],
};

export default config;
