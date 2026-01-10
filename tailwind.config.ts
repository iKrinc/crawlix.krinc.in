import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lofi: {
          cream: '#F5F1E8',
          sand: '#E8DCC4',
          brown: '#8B7355',
          darkBrown: '#5C4A3A',
          coffee: '#3D2C1F',
          sage: '#9CA986',
          mint: '#B8C9A8',
          rose: '#D4A5A5',
          lavender: '#B8A8C9',
          peach: '#F4C4A0',
        },
        brand: {
          primary: '#8B7355',    // Warm brown
          secondary: '#9CA986',  // Soft sage
          accent: '#D4A5A5',     // Dusty rose
          background: '#F5F1E8', // Cream
          text: '#3D2C1F',       // Coffee
          muted: '#5C4A3A',      // Dark brown
        },
        status: {
          success: '#9CA986',
          warning: '#F4C4A0',
          error: '#D4A5A5',
          info: '#B8A8C9',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
