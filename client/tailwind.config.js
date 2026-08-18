/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Burnished Copper #B85C45 — Primary Brand Accent & CTAs
        brand: {
          DEFAULT: '#B85C45',
          light: '#D27861',
          dark: '#96432E',
          hover: '#A14E38',
        },
        mineral: {
          DEFAULT: '#B85C45',
          light: '#D27861',
          dark: '#96432E',
          hover: '#A14E38',
        },
        clay: {
          DEFAULT: '#B85C45',
          light: '#D27861',
          dark: '#96432E',
        },
        // 2. Mulberry Ink #3A2432 — Deep Brand Accent & Headings
        slate: {
          DEFAULT: '#3A2432',
          light: '#54384A',
          dark: '#251520',
        },
        wine: {
          DEFAULT: '#3A2432',
          light: '#54384A',
          dark: '#251520',
        },
        // 3. Lichen Green #718A78 — Secondary Accent & Verification Badges
        sage: {
          DEFAULT: '#718A78',
          light: '#8FA696',
          dark: '#566E5D',
          subtle: '#F0F4F1',
        },
        secondary: {
          DEFAULT: '#718A78',
          light: '#8FA696',
          dark: '#566E5D',
          subtle: '#F0F4F1',
        },
        teal: {
          DEFAULT: '#718A78',
          light: '#8FA696',
          dark: '#566E5D',
        },
        // 4. Pale Celadon #DCE5D8 — Light Brand Accent & Highlights
        celadon: {
          DEFAULT: '#DCE5D8',
          light: '#EAF0E7',
          dark: '#C5D2C0',
        },
        mint: {
          DEFAULT: '#DCE5D8',
          light: '#EAF0E7',
          dark: '#C5D2C0',
        },
        // 5. Warm Porcelain #F5F1E8 — Primary Page Background
        parchment: {
          DEFAULT: '#F5F1E8',
          light: '#FAF8F3',
          dark: '#E8E2D5',
        },
        background: {
          DEFAULT: '#F5F1E8',
        },
        // 6. Near Black #202624 — Primary Text
        ink: {
          DEFAULT: '#202624',
          light: '#2E3634',
          dark: '#131716',
        },
        // 7. Soft White #FCFAF5 — Card Surface & Modals
        bone: {
          DEFAULT: '#FCFAF5',
          subtle: '#F8F5EE',
        },
        // 8. Stone Grey #5F6661 — Secondary & Muted Typography
        charcoal: {
          DEFAULT: '#5F6661',
          muted: '#757D77',
          subtle: '#919994',
        },
        // 9. Warm Mist #D8D4CA — Subtle Borders & Dividers
        mist: {
          DEFAULT: '#D8D4CA',
          dark: '#C3BEB2',
          light: '#EBE7E0',
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
