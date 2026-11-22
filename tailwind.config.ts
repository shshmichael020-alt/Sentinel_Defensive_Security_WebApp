import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          ink: '#0F172A',
          secondary: '#475569',
          cobalt: '#1D4ED8',
          'cobalt-hover': '#1E40AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        app: '1152px',
      },
    },
  },
  plugins: [],
};

export default config;
