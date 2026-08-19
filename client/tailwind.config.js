/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CENTRAL CSS VARIABLE TOKENS --th-*
        parchment: {
          DEFAULT: 'var(--th-bg)',
          light: 'var(--th-bg)',
          dark: 'var(--th-bg)',
        },
        bone: {
          DEFAULT: 'var(--th-surface)',
          subtle: 'var(--th-surface-alt)',
        },
        ivorySecondary: 'var(--th-surface-alt)',

        brand: {
          DEFAULT: 'var(--th-primary)',
          light: 'var(--th-primary)',
          dark: 'var(--th-primary-dark)',
          hover: 'var(--th-primary-dark)',
        },
        crimson: {
          DEFAULT: 'var(--th-primary)',
          light: 'var(--th-primary)',
          dark: 'var(--th-primary-dark)',
        },
        mineral: {
          DEFAULT: 'var(--th-primary)',
        },
        clay: {
          DEFAULT: 'var(--th-primary)',
        },

        burnt: {
          DEFAULT: 'var(--th-primary-dark)',
          light: 'var(--th-primary-dark)',
          dark: 'var(--th-primary-dark)',
          hover: 'var(--th-primary-dark)',
        },

        burgundy: {
          DEFAULT: 'var(--th-secondary)',
          light: 'var(--th-secondary)',
          dark: 'var(--th-secondary)',
          hover: 'var(--th-secondary)',
        },
        slate: {
          DEFAULT: 'var(--th-secondary)',
          light: 'var(--th-secondary)',
          dark: 'var(--th-secondary)',
          hover: 'var(--th-secondary)',
        },
        secondary: {
          DEFAULT: 'var(--th-secondary)',
          light: 'var(--th-secondary)',
          dark: 'var(--th-secondary)',
        },

        brass: {
          DEFAULT: 'var(--th-accent)',
          light: 'var(--th-accent)',
          dark: 'var(--th-accent)',
        },

        seafoam: {
          DEFAULT: 'var(--th-success)',
          light: 'var(--th-success)',
          dark: 'var(--th-success)',
          subtle: 'var(--th-success)',
        },
        sage: {
          DEFAULT: 'var(--th-success)',
          light: 'var(--th-success)',
          dark: 'var(--th-success)',
        },
        mint: {
          DEFAULT: 'var(--th-success)',
          light: 'var(--th-success)',
          dark: 'var(--th-success)',
        },

        ink: {
          DEFAULT: 'var(--th-text)',
          light: 'var(--th-text)',
          dark: 'var(--th-text)',
        },

        charcoal: {
          DEFAULT: 'var(--th-text)',
          muted: 'var(--th-muted)',
          subtle: 'var(--th-muted)',
        },

        mist: {
          DEFAULT: 'var(--th-border)',
          dark: 'var(--th-border)',
          light: 'var(--th-border)',
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
