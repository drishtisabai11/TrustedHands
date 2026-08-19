/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trusted Hands Palette
        // Primary / CTA #C89B3C
        brand: {
          DEFAULT: '#C89B3C',
          light: '#D9B055',
          dark: '#AA7F27',
          hover: '#B5882E',
        },
        crimson: {
          DEFAULT: '#C89B3C',
          light: '#D9B055',
          dark: '#AA7F27',
        },
        // Secondary Accent #2F4858
        burgundy: {
          DEFAULT: '#2F4858',
          light: '#415E72',
          dark: '#1F313E',
        },
        slate: {
          DEFAULT: '#2F4858',
          light: '#415E72',
          dark: '#1F313E',
        },
        // Verified / Success #6B7F52
        seafoam: {
          DEFAULT: '#6B7F52',
          light: '#859C6A',
          dark: '#52633C',
        },
        sage: {
          DEFAULT: '#6B7F52',
          light: '#859C6A',
          dark: '#52633C',
        },
        mint: {
          DEFAULT: '#6B7F52',
          light: '#859C6A',
          dark: '#52633C',
        },
        // Background #F5F2EC
        parchment: {
          DEFAULT: '#F5F2EC',
          light: '#FAF8F4',
          dark: '#EDE8DE',
        },
        // Surface #FFFFFF & Secondary Surface #EDE8DE
        bone: {
          DEFAULT: '#FFFFFF',
          subtle: '#EDE8DE',
        },
        // Primary Text #2B2E33
        ink: {
          DEFAULT: '#2B2E33',
          light: '#3C4047',
          dark: '#1A1C1F',
        },
        // Muted Text / Borders #8B8479
        charcoal: {
          DEFAULT: '#2B2E33',
          muted: '#8B8479',
          subtle: '#A29B90',
        },
        mist: {
          DEFAULT: '#8B8479',
          dark: '#736D63',
          light: '#EDE8DE',
        },
        mineral: {
          DEFAULT: '#C89B3C',
        },
        clay: {
          DEFAULT: '#C89B3C',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '14px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(43, 46, 51, 0.05)',
        'card': '0 2px 8px rgba(43, 46, 51, 0.04), 0 1px 2px rgba(43, 46, 51, 0.02)',
        'elevated': '0 8px 24px rgba(43, 46, 51, 0.07), 0 2px 6px rgba(43, 46, 51, 0.03)',
        'modal': '0 20px 40px rgba(43, 46, 51, 0.12), 0 4px 12px rgba(43, 46, 51, 0.06)',
      },
    },
  },
  plugins: [],
}
