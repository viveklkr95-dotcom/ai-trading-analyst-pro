import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        surface: '#111827',
        accent: '#38bdf8',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56, 189, 248, 0.2), 0 10px 30px rgba(15, 23, 42, 0.7)',
      },
    },
  },
  plugins: [],
};

export default config;
