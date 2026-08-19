/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // STRICT APPROVED 11-COLOR PALETTE ONLY
        // 1. Warm Linen Background #F4EFE7
        parchment: {
          DEFAULT: '#F4EFE7',
          light: '#F4EFE7',
          dark: '#F4EFE7',
        },

        // 2. Soft Ivory Surface #FFFCF7
        bone: {
          DEFAULT: '#FFFCF7',
          subtle: '#EDE8DE',
        },

        // 3. Secondary Surface #EDE8DE
        ivorySecondary: '#EDE8DE',

        // 4. Refined Terracotta Primary CTA #A6533C
        brand: {
          DEFAULT: '#A6533C',
          light: '#A6533C',
          dark: '#71382D',
          hover: '#71382D',
        },
        crimson: {
          DEFAULT: '#A6533C',
          light: '#A6533C',
          dark: '#71382D',
        },
        mineral: {
          DEFAULT: '#A6533C',
        },
        clay: {
          DEFAULT: '#A6533C',
        },

        // 5. Burnt Umber Primary Dark #71382D
        burnt: {
          DEFAULT: '#71382D',
          light: '#71382D',
          dark: '#71382D',
          hover: '#71382D',
        },

        // 6. Deep Forest Secondary Brand #29483F
        burgundy: {
          DEFAULT: '#29483F',
          light: '#29483F',
          dark: '#29483F',
          hover: '#29483F',
        },
        slate: {
          DEFAULT: '#29483F',
          light: '#29483F',
          dark: '#29483F',
          hover: '#29483F',
        },
        secondary: {
          DEFAULT: '#29483F',
          light: '#29483F',
          dark: '#29483F',
        },

        // 7. Muted Brass Premium Accent #C5A46D
        brass: {
          DEFAULT: '#C5A46D',
          light: '#C5A46D',
          dark: '#C5A46D',
        },

        // 8. Sage Olive Verified / Success #64745A
        seafoam: {
          DEFAULT: '#64745A',
          light: '#64745A',
          dark: '#64745A',
          subtle: '#64745A',
        },
        sage: {
          DEFAULT: '#64745A',
          light: '#64745A',
          dark: '#64745A',
        },
        mint: {
          DEFAULT: '#64745A',
          light: '#64745A',
          dark: '#64745A',
        },

        // 9. Charcoal Ink Primary Text #242825
        ink: {
          DEFAULT: '#242825',
          light: '#242825',
          dark: '#242825',
        },

        // 10. Warm Grey Muted Text #706F68
        charcoal: {
          DEFAULT: '#242825',
          muted: '#706F68',
          subtle: '#706F68',
        },

        // 11. Warm Stone Border #DDD5C8
        mist: {
          DEFAULT: '#DDD5C8',
          dark: '#DDD5C8',
          light: '#DDD5C8',
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
        'modal': '0 24px 48px rgba(41, 72, 63, 0.14), 0 4px 12px rgba(36, 40, 37, 0.06)',
      },
    },
  },
  plugins: [],
}
