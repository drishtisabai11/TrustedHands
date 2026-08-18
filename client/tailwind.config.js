/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Ochre / Mustard #C89B3C — Primary Brand Accent & CTAs
        brand: {
          DEFAULT: '#C89B3C',
          light: '#D9AD4E',
          dark: '#9F7720',
          hover: '#B78B2C',
        },
        mineral: {
          DEFAULT: '#C89B3C',
          light: '#D9AD4E',
          dark: '#9F7720',
          hover: '#B78B2C',
        },
        clay: {
          DEFAULT: '#C89B3C',
          light: '#D9AD4E',
          dark: '#9F7720',
        },
        // 2. Deep Teal-Slate #2F4858 — Secondary Brand Color & Dark Sections
        slate: {
          DEFAULT: '#2F4858',
          light: '#425F72',
          dark: '#1E313D',
        },
        wine: {
          DEFAULT: '#2F4858',
          light: '#425F72',
          dark: '#1E313D',
        },
        // 3. Muted Olive #6B7F52 — Verified & Trust Badges
        sage: {
          DEFAULT: '#6B7F52',
          light: '#849A6A',
          dark: '#51623D',
          subtle: '#F3F6F0',
        },
        secondary: {
          DEFAULT: '#6B7F52',
          light: '#849A6A',
          dark: '#51623D',
          subtle: '#F3F6F0',
        },
        teal: {
          DEFAULT: '#6B7F52',
          light: '#849A6A',
          dark: '#51623D',
        },
        // 4. Warm Stone Panel #EDE8DE — Secondary Surface & Visual Grouping
        celadon: {
          DEFAULT: '#EDE8DE',
          light: '#F5F2EC',
          dark: '#DFD9CC',
        },
        mint: {
          DEFAULT: '#EDE8DE',
          light: '#F5F2EC',
          dark: '#DFD9CC',
        },
        // 5. Warm Stone #F5F2EC — Primary Website Background
        parchment: {
          DEFAULT: '#F5F2EC',
          light: '#FAF8F4',
          dark: '#EDE8DE',
        },
        background: {
          DEFAULT: '#F5F2EC',
        },
        // 6. Deep Slate #2B2E33 — Primary Text
        ink: {
          DEFAULT: '#2B2E33',
          light: '#3F434A',
          dark: '#1B1D21',
        },
        // 7. Clean White #FFFFFF — Primary Surface & Cards
        bone: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAF8F4',
        },
        // 8. Stone Grey #8B8479 — Muted Typography & Metadata
        charcoal: {
          DEFAULT: '#8B8479',
          muted: '#A19A8F',
          subtle: '#B7B0A5',
        },
        // 9. Warm Mist / Border #DCD6C9 — Subtle Borders & Dividers
        mist: {
          DEFAULT: '#DCD6C9',
          dark: '#C9C2B4',
          light: '#F4F0E8',
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
