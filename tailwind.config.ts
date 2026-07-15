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
          deep: '#F1EBE7',
          line: '#D9CED5',
        },
        sage: {
          50: '#D9C9D6',
          100: '#C8B1C4',
          300: '#B491AE',
          DEFAULT: '#A980A2',
          600: '#916D8B',
          700: '#75566F',
        },
        clay: {
          DEFAULT: '#8C6B89',
          soft: '#BFA4BA',
          deep: '#70536D',
        },
        illusion: {
          DEFAULT: '#A980A2',
          soft: '#BC9AB6',
          deep: '#896682',
        },
        ink: {
          DEFAULT: '#55434F',
          soft: '#715F6A',
          faint: '#8B7883',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        brand: ['Baskerville', 'Libre Baskerville', 'Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(78,48,73,0.10), 0 12px 30px -14px rgba(78,48,73,0.28)',
        'card-hover': '0 6px 18px rgba(78,48,73,0.14), 0 30px 58px -22px rgba(78,48,73,0.38)',
        soft: '0 18px 52px -24px rgba(78,48,73,0.36)',
      },
      borderRadius: { xl2: '1.25rem', blob: '63% 37% 54% 46% / 43% 45% 55% 57%' },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-10px) rotate(2deg)' } },
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(140,107,137,0.40)' }, '50%': { boxShadow: '0 0 0 10px rgba(140,107,137,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
