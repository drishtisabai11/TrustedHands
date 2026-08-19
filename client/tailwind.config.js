/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trusted Hands TERRACOTTA & FOREST Palette
        
        // Primary Brand #A6533C (Refined Terracotta)
        brand: {
          DEFAULT: '#A6533C',
          light: '#B8654E',
          dark: '#71382D',
          hover: '#8C432F',
        },
        crimson: {
          DEFAULT: '#A6533C',
          light: '#B8654E',
          dark: '#71382D',
        },
        mineral: {
          DEFAULT: '#A6533C',
        },
        clay: {
          DEFAULT: '#A6533C',
        },

        // Primary Dark #71382D (Burnt Umber)
        burnt: {
          DEFAULT: '#71382D',
          light: '#88473A',
          dark: '#5A2B22',
        },

        // Secondary Brand #29483F (Deep Forest)
        burgundy: {
          DEFAULT: '#29483F',
          light: '#375D52',
          dark: '#1C322B',
          hover: '#1E362F',
        },
        slate: {
          DEFAULT: '#29483F',
          light: '#375D52',
          dark: '#1C322B',
          hover: '#1E362F',
        },
        secondary: {
          DEFAULT: '#29483F',
          light: '#375D52',
          dark: '#1C322B',
        },

        // Premium Accent #C5A46D (Muted Brass)
        brass: {
          DEFAULT: '#C5A46D',
          light: '#D4B886',
          dark: '#B08E56',
        },

        // Verified / Success #64745A (Sage Olive)
        seafoam: {
          DEFAULT: '#64745A',
          light: '#75876A',
          dark: '#4E5B46',
          subtle: '#EBF0E8',
        },
        sage: {
          DEFAULT: '#64745A',
          light: '#75876A',
          dark: '#4E5B46',
        },
        mint: {
          DEFAULT: '#64745A',
          light: '#75876A',
          dark: '#4E5B46',
        },

        // Primary Background #F4EFE7 (Warm Linen)
        parchment: {
          DEFAULT: '#F4EFE7',
          light: '#FAF7F2',
          dark: '#E8E1D5',
        },

        // Primary Surface #FFFCF7 (Soft Ivory)
        bone: {
          DEFAULT: '#FFFCF7',
          subtle: '#F4EFE7',
        },

        // Primary Text #242825 (Charcoal Ink)
        ink: {
          DEFAULT: '#242825',
          light: '#363B37',
          dark: '#151816',
        },

        // Muted Text #706F68 (Warm Grey)
        charcoal: {
          DEFAULT: '#242825',
          muted: '#706F68',
          subtle: '#919088',
        },

        // Border #DDD5C8 (Warm Stone)
        mist: {
          DEFAULT: '#DDD5C8',
          dark: '#C9BFB0',
          light: '#EFE8DC',
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
        'subtle': '0 1px 3px rgba(36, 40, 37, 0.04)',
        'card': '0 2px 8px rgba(41, 72, 63, 0.04), 0 1px 2px rgba(36, 40, 37, 0.02)',
        'elevated': '0 10px 30px rgba(41, 72, 63, 0.07), 0 2px 6px rgba(36, 40, 37, 0.03)',
        'modal': '0 24px 48px rgba(28, 50, 43, 0.14), 0 4px 12px rgba(36, 40, 37, 0.06)',
      },
    },
  },
  plugins: [],
}
