/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1F2937',       // primary text
        navy: '#243B6B',      // brand primary (headers, buttons)
        'navy-dark': '#182A4E',
        amber: '#F2994A',     // accent (CTAs, highlights)
        'amber-dark': '#D97B27',
        success: '#1F9D64',   // matched skills / positive states
        danger: '#D64545',    // missing skills / errors
        muted: '#6B7280',     // secondary text
        surface: '#F9FAFB',   // page background
        card: '#FFFFFF',
        line: '#E5E7EB',      // borders/dividers
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
        'card-hover': '0 4px 8px rgba(16, 24, 40, 0.06), 0 2px 4px rgba(16, 24, 40, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
