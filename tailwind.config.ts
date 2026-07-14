import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F3ED',
          deep: '#E3D6BF',
          line: '#9F9679',
        },
        sage: {
          50: '#EEF1E8',
          100: '#AABAAE',
          300: '#9F9679',
          DEFAULT: '#839958',
          600: '#657A45',
          700: '#0A3323',
        },
        clay: {
          DEFAULT: '#933B5B',
          soft: '#B5728A',
          deep: '#742D48',
        },
        ink: {
          DEFAULT: '#0A3323',
          soft: '#3F4D43',
          faint: '#6C756D',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        brand: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Georgia', 'serif'],
        body: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,51,35,0.04), 0 10px 30px -12px rgba(10,51,35,0.12)',
        'card-hover': '0 5px 16px rgba(10,51,35,0.06), 0 28px 56px -20px rgba(10,51,35,0.20)',
        soft: '0 18px 52px -24px rgba(10,51,35,0.28)',
      },
      borderRadius: { xl2: '1.25rem', blob: '63% 37% 54% 46% / 43% 45% 55% 57%' },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floaty: { '0%, 100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-10px) rotate(2deg)' } },
        pulseSoft: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(147,59,91,0.30)' }, '50%': { boxShadow: '0 0 0 10px rgba(147,59,91,0)' } },
      },
      animation: { marquee: 'marquee 28s linear infinite', floaty: 'floaty 6s ease-in-out infinite', 'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
