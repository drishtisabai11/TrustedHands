/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Crimson Red #AE2448
        brand: {
          DEFAULT: '#AE2448',
          light: '#C94364',
          dark: '#74152F',
          hover: '#8F1D3B',
        },
        // Mineral & Clay alias mapped to Primary Brand Crimson Red #AE2448
        mineral: {
          DEFAULT: '#AE2448',
          light: '#C94364',
          dark: '#74152F',
          hover: '#8F1D3B',
        },
        clay: {
          DEFAULT: '#AE2448',
          light: '#C94364',
          dark: '#74152F',
        },
        // Deep Burgundy / Wine #6E1A37
        slate: {
          DEFAULT: '#6E1A37',
          light: '#892A4B',
          dark: '#521027',
        },
        wine: {
          DEFAULT: '#6E1A37',
          light: '#892A4B',
          dark: '#521027',
        },
        // Muted Seafoam / Teal #72BAA9
        sage: {
          DEFAULT: '#72BAA9',
          light: '#95D1C3',
          dark: '#478A7B',
          subtle: '#EBF7F4',
        },
        secondary: {
          DEFAULT: '#72BAA9',
          light: '#95D1C3',
          dark: '#478A7B',
          subtle: '#EBF7F4',
        },
        teal: {
          DEFAULT: '#72BAA9',
          light: '#95D1C3',
          dark: '#478A7B',
        },
        // Soft Mint / Light Surface #D5E7B5
        parchment: {
          DEFAULT: '#D5E7B5',
          light: '#E6F2CD',
          dark: '#BECF9D',
        },
        mint: {
          DEFAULT: '#D5E7B5',
          light: '#E6F2CD',
          dark: '#BECF9D',
        },
        // Preserved text & surface contrast neutrals
        ink: {
          DEFAULT: '#17211D',
          light: '#23302B',
          dark: '#0E1513',
        },
        bone: {
          DEFAULT: '#FBF9F4',
          subtle: '#F6F3EB',
        },
        charcoal: {
          DEFAULT: '#292E2B',
          muted: '#525B56',
          subtle: '#7A857F',
        },
        mist: {
          DEFAULT: '#D9DED6',
          dark: '#C3CAC0',
          light: '#E8ECE6',
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
        'subtle': '0 1px 3px rgba(23, 33, 29, 0.05)',
        'card': '0 2px 8px rgba(23, 33, 29, 0.04), 0 1px 2px rgba(23, 33, 29, 0.02)',
        'elevated': '0 8px 24px rgba(23, 33, 29, 0.07), 0 2px 6px rgba(23, 33, 29, 0.03)',
        'modal': '0 20px 40px rgba(23, 33, 29, 0.12), 0 4px 12px rgba(23, 33, 29, 0.06)',
      },
      letterSpacing: {
        'tightest': '-0.025em',
        'tight': '-0.015em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
      },
    },
  },
  plugins: [],
}
