import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F3ED',
          deep: '#E8D982',
          line: '#C6B85D',
        },
        sage: {
          50: '#EEF0C8',
          100: '#D8DD8B',
          300: '#BBC45B',
          DEFAULT: '#A6B13C',
          600: '#8E992D',
          700: '#727D20',
        },
        clay: {
          DEFAULT: '#AA9FBE',
          soft: '#C9C0D5',
          deep: '#817592',
        },
        illusion: {
          DEFAULT: '#FB9FC5',
          soft: '#FBC5DC',
          deep: '#D977A0',
        },
        ink: {
          DEFAULT: '#59392C',
          soft: '#705043',
          faint: '#896B5E',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        brand: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
        body: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(89,57,44,0.08), 0 12px 30px -14px rgba(89,57,44,0.28)',
        'card-hover': '0 6px 18px rgba(89,57,44,0.10), 0 30px 58px -22px rgba(89,57,44,0.36)',
        soft: '0 18px 52px -24px rgba(89,57,44,0.34)',
      },
      borderRadius: { xl2: '1.25rem', blob: '63% 37% 54% 46% / 43% 45% 55% 57%' },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-10px) rotate(2deg)' } },
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(170,159,190,0.40)' }, '50%': { boxShadow: '0 0 0 10px rgba(170,159,190,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
