/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Trusted Hands Sapphire & Slate Luxury Palette
        // Primary Electric Indigo #6366F1
        brand: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4338CA',
          hover: '#4F46E5',
        },
        crimson: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4338CA',
        },
        // Deep Navy Slate #0F172A
        burgundy: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          dark: '#020617',
        },
        slate: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          dark: '#020617',
        },
        // Emerald Verified Success #10B981
        seafoam: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        sage: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        mint: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        // Crisp Snow White Background #F8FAFC
        parchment: {
          DEFAULT: '#F8FAFC',
          light: '#FFFFFF',
          dark: '#F1F5F9',
        },
        // Pure White Surface #FFFFFF & Secondary Surface #F1F5F9
        bone: {
          DEFAULT: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        // Deep Slate Ink Primary Text #0F172A
        ink: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          dark: '#020617',
        },
        // Slate Muted Charcoal Text #475569
        charcoal: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          subtle: '#64748B',
        },
        // Slate 200 Borders & Dividers #E2E8F0
        mist: {
          DEFAULT: '#E2E8F0',
          dark: '#CBD5E1',
          light: '#F1F5F9',
        },
        mineral: {
          DEFAULT: '#6366F1',
        },
        clay: {
          DEFAULT: '#EF4444',
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
        'subtle': '0 1px 3px rgba(15, 23, 42, 0.04)',
        'card': '0 2px 8px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        'elevated': '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.03)',
        'modal': '0 24px 48px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
