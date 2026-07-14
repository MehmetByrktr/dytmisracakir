import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        white: '#FCF8F8',
        porcelain: '#FCF8F8',
        card: '#FCF8F8',
        footer: '#F9DFDF',
        cream: {
          DEFAULT: '#F7F3ED',
          deep: '#F2ECE7',
          line: '#E8CFCF',
        },
        sage: {
          50: '#EEF1E8',
          100: '#DDE5D5',
          300: '#A7B599',
          DEFAULT: '#70805C',
          600: '#627252',
          700: '#526145',
        },
        clay: {
          DEFAULT: '#F9DFDF',
          soft: '#FBEFEF',
          deep: '#914E5E',
        },
        illusion: {
          DEFAULT: '#A35F6D',
          soft: '#D7A5AD',
          deep: '#914E5E',
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
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,223,223,0.70)' }, '50%': { boxShadow: '0 0 0 10px rgba(249,223,223,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
