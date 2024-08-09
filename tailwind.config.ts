import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      violet2: '#635FC7',
      violet1: '#A8A4FF',
      black: '#000112',
      gray6: '#20212C',
      gray5: '#2B2C37',
      gray4: '#3E3F4E',
      gray3: '#828FA3',
      gray2: '#E4EBFA',
      gray1: '#F4F7FD',
      white: '#ffffff',
      red2: '#EA5555',
      red1: '#FF9898',
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      m: '15px',
      lg: '18px',
      xl: '24px',
      '2xl': '30px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
