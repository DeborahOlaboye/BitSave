import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#FF8C00', // Bitcoin Orange
          dark: '#E67E00',
          light: '#FFB347', // Soft Orange
        },
        // Secondary Colors (Deep Purple)
        secondary: {
          DEFAULT: '#2D1B4E', // Deep Purple
          light: '#5B4D77', // Medium Purple
          lighter: '#8B7FA8', // Light Purple
        },
        // Functional Colors
        success: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24',
        },
        error: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#F87171',
        },
        info: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        // Neutral Colors
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        background: {
          DEFAULT: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(255, 140, 0, 0.3)',
        'glow-lg': '0 8px 16px rgba(255, 140, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'slide-in': 'slideIn 300ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'enter': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'sharp': 'cubic-bezier(0.4, 0.0, 0.6, 1)',
      },
      transitionDuration: {
        'instant': '100ms',
        'quick': '200ms',
        'standard': '300ms',
        'moderate': '400ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
};

export default config;
