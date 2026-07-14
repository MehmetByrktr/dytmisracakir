import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        white: '#F7F3ED',
        porcelain: '#F7F3ED',
        card: '#F7F3ED',
        footer: '#F7F3ED',
        cream: {
          DEFAULT: '#F7F3ED',
          deep: '#F3EEE7',
          line: '#D8CEC5',
        },
        sage: {
          50: '#E9EEE8',
          100: '#D5E0D5',
          300: '#8FA38F',
          DEFAULT: '#3F5B45',
          600: '#324A38',
          700: '#263A2C',
        },
        clay: {
          DEFAULT: '#536B56',
          soft: '#D5E0D5',
          deep: '#3F5242',
        },
        illusion: {
          DEFAULT: '#4E342E',
          soft: '#755E57',
          deep: '#3D2824',
        },
        ink: {
          DEFAULT: '#4E342E',
          soft: '#755E57',
          faint: '#8C746C',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        brand: ['Baskerville', 'Libre Baskerville', 'Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(78,52,46,0.08), 0 12px 30px -14px rgba(78,52,46,0.24)',
        'card-hover': '0 6px 18px rgba(78,52,46,0.10), 0 30px 58px -22px rgba(78,52,46,0.32)',
        soft: '0 18px 52px -24px rgba(78,52,46,0.30)',
      },
      borderRadius: { xl2: '1.25rem', blob: '63% 37% 54% 46% / 43% 45% 55% 57%' },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-10px) rotate(2deg)' } },
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(83,107,86,0.38)' }, '50%': { boxShadow: '0 0 0 10px rgba(83,107,86,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
