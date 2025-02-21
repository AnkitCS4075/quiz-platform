import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.5s ease-out',
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
      },
      boxShadow: {
        'glow': '0 0 15px rgba(14, 165, 233, 0.5)',
        'glow-success': '0 0 15px rgba(34, 197, 94, 0.5)',
        'glow-error': '0 0 15px rgba(239, 68, 68, 0.5)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0ea5e9",
          "primary-focus": "#0284c7",
          secondary: "#7dd3fc",
          accent: "#38bdf8",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
          info: "#3ABFF8",
          success: "#22c55e",
          warning: "#FBBD23",
          error: "#ef4444",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#0ea5e9",
          "primary-focus": "#0284c7",
          secondary: "#7dd3fc",
          accent: "#38bdf8",
          neutral: "#2A2E37",
          "base-100": "#1F2937",
          "base-200": "#111827",
          "base-300": "#0F172A",
          info: "#3ABFF8",
          success: "#22c55e",
          warning: "#FBBD23",
          error: "#ef4444",
        },
      },
    ],
  },
};

export default config;
