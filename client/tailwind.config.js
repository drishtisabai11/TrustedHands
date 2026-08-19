/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trusted Hands Modern Luxury Palette
        // Primary Warm Champagne Gold #D4A338
        brand: {
          DEFAULT: '#D4A338',
          light: '#E2B856',
          dark: '#9C731E',
          hover: '#BC8E2C',
        },
        crimson: {
          DEFAULT: '#D4A338',
          light: '#E2B856',
          dark: '#9C731E',
        },
        // Deep Emerald Slate #1A362B
        burgundy: {
          DEFAULT: '#1A362B',
          light: '#284E3F',
          dark: '#10241C',
        },
        slate: {
          DEFAULT: '#1A362B',
          light: '#284E3F',
          dark: '#10241C',
        },
        // Forest Emerald Verified Success #2D7D46
        seafoam: {
          DEFAULT: '#2D7D46',
          light: '#479C62',
          dark: '#1F5A32',
        },
        sage: {
          DEFAULT: '#2D7D46',
          light: '#479C62',
          dark: '#1F5A32',
        },
        mint: {
          DEFAULT: '#2D7D46',
          light: '#479C62',
          dark: '#1F5A32',
        },
        // Warm Linen Parchment Background #F8F6F0
        parchment: {
          DEFAULT: '#F8F6F0',
          light: '#FCFBF8',
          dark: '#EFECE4',
        },
        // Alabaster Surface #FFFFFF & Secondary Surface #EFECE4
        bone: {
          DEFAULT: '#FFFFFF',
          subtle: '#EFECE4',
        },
        // Obsidian Ink Primary Text #191C1B
        ink: {
          DEFAULT: '#191C1B',
          light: '#2D3230',
          dark: '#0F1211',
        },
        // Charcoal Muted Text #5F6863
        charcoal: {
          DEFAULT: '#191C1B',
          muted: '#5F6863',
          subtle: '#828C86',
        },
        // Sandstone Borders & Dividers #D5CFC3
        mist: {
          DEFAULT: '#D5CFC3',
          dark: '#BEB7A9',
          light: '#EFECE4',
        },
        mineral: {
          DEFAULT: '#D4A338',
        },
        clay: {
          DEFAULT: '#D4A338',
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
        '2xl': '18px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(25, 28, 27, 0.04)',
        'card': '0 2px 8px rgba(26, 54, 43, 0.04), 0 1px 2px rgba(25, 28, 27, 0.02)',
        'elevated': '0 10px 30px rgba(26, 54, 43, 0.07), 0 2px 6px rgba(25, 28, 27, 0.03)',
        'modal': '0 24px 48px rgba(16, 36, 28, 0.14), 0 4px 12px rgba(25, 28, 27, 0.06)',
      },
    },
  },
  plugins: [],
}
