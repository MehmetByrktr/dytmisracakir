import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        white: '#F7F3ED',
        porcelain: '#F7F3ED',
        powder: '#F4B3A0',
        card: '#F4B3A0',
        footer: '#88916F',
        cream: {
          DEFAULT: '#F7F3ED',
          deep: '#F3EEE7',
          line: '#D8CEC5',
        },
        sage: {
          50: '#F2F3EC',
          100: '#DDE1D1',
          300: '#AEB69C',
          DEFAULT: '#88916F',
          600: '#747C5D',
          700: '#60674E',
        },
        clay: {
          DEFAULT: '#88916F',
          soft: '#F4B3A0',
          deep: '#6F775A',
        },
        illusion: {
          DEFAULT: '#88916F',
          soft: '#A4AB8D',
          deep: '#6F775A',
        },
        ink: {
          DEFAULT: '#4E342E',
          soft: '#755E57',
          faint: '#8C746C',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        brand: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
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
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(136,145,111,0.42)' }, '50%': { boxShadow: '0 0 0 10px rgba(136,145,111,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
