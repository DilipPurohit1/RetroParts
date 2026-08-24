/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Exact Red & Black Automotive Palette from Design System
        base: '#0D0D0D', // Deep Charcoal / Obsidian Base (#0D0D0D)
        surface: {
          DEFAULT: '#161616', // Dark Charcoal Surface (#161616)
          raised: '#222222', // Raised Panel Surface (#222222 / #2A2A2A)
          crimson: '#200A0A', // Subtle Deep Red Tinted Panel
        },
        border: {
          DEFAULT: '#2A2A2A', // Hairline Border (#2A2A2A)
          strong: '#383838', // Stronger Border (#383838)
          red: '#551111', // Subtle Red Border
        },
        text: {
          primary: '#E5E5E5', // Primary Text (#E5E5E5 / #FFFFFF)
          secondary: '#BAC0CD', // Secondary Slate Silver
          muted: '#888888', // Graphite Grey Muted Text (#888888)
        },
        accent: {
          DEFAULT: '#E10600', // Signature Racing Red (#E10600)
          hover: '#B20404', // Darker Red Hover (#B20404)
          dark: '#B20404', // Deep Red (#B20404)
          muted: '#260808', // Subtle Red Tint
          glow: 'rgba(225, 6, 0, 0.35)',
        },
        crimson: {
          DEFAULT: '#E10600',
          50: '#FDF2F2',
          100: '#FDE8E8',
          500: '#E10600',
          600: '#B20404',
          700: '#7A0000',
          800: '#4A0000',
          900: '#2A0000',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#E10600',
        verified: '#00B4D8',

        // Backward compatibility mappings
        rp: {
          canvas: '#0D0D0D',
          surface: '#161616',
          card: '#161616',
          'card-hover': '#222222',
          border: '#2A2A2A',
          'border-subtle': '#2A2A2A',
          divider: '#2A2A2A',
          copper: '#E10600',
          'copper-hover': '#B20404',
          'copper-dark': '#B20404',
          'copper-light': '#260808',
          'copper-glow': 'rgba(225, 6, 0, 0.35)',
          text: '#E5E5E5',
          'text-muted': '#BAC0CD',
          'text-subtle': '#888888',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#E10600',
          verified: '#00B4D8',
        },
        neo: {
          bg: '#0D0D0D',
          surface: '#161616',
          card: '#161616',
          'card-hover': '#222222',
          border: '#2A2A2A',
          'border-subtle': '#2A2A2A',
          divider: '#2A2A2A',
          cyan: '#E10600',
          'cyan-hover': '#B20404',
          magenta: '#B20404',
          'magenta-hover': '#E10600',
          amber: '#F59E0B',
          purple: '#888888',
          green: '#10B981',
          text: '#E5E5E5',
          'text-muted': '#BAC0CD',
          'text-subtle': '#888888',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['"Oswald"', '"Bebas Neue"', '"Barlow Condensed"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        card: '8px',
        modal: '12px',
        input: '4px',
        button: '4px',
      },
      boxShadow: {
        none: 'none',
        'red-sm': '0 0 12px 0 rgba(225, 6, 0, 0.25)',
        'red-glow': '0 0 24px 0 rgba(225, 6, 0, 0.4)',
        'red-card': '0 4px 20px 0 rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(225, 6, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
